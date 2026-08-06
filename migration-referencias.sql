-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Indice compartilhado entre todos os usuarios: toda vez que alguem busca um
-- produto pelo codigo de barras, guarda a relacao referencia -> codigo de
-- barras aqui. Com o tempo, isso permite buscar produtos ja vistos antes
-- direto pela referencia (ex: "593102-001"), sem precisar do codigo de barras.
-- Precisa da extensao pg_trgm pra busca "contém" (ilike) ser rapida
create extension if not exists pg_trgm;

create table referencias_index (
  id uuid primary key default gen_random_uuid(),
  codigo_barras text not null unique,
  cd_referencia text not null,
  produto text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index referencias_index_referencia_idx on referencias_index using gin (cd_referencia gin_trgm_ops);
create index referencias_index_produto_idx on referencias_index using gin (produto gin_trgm_ops);

alter table referencias_index enable row level security;

-- Qualquer usuario logado pode ver e alimentar o indice
create policy "Usuarios logados veem o indice"
  on referencias_index for select
  to authenticated
  using (true);

create policy "Usuarios logados alimentam o indice"
  on referencias_index for insert
  to authenticated
  with check (true);

create policy "Usuarios logados atualizam o indice"
  on referencias_index for update
  to authenticated
  using (true)
  with check (true);
