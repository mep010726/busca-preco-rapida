-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Deixa qualquer usuario "observar" um produto por nome numa loja - um
-- script separado (scripts/checar-alertas-estoque.js, rodando em loop)
-- confere periodicamente se apareceu estoque e marca o alerta como
-- encontrado. O app so mostra um sininho com os avisos ja encontrados.
create table estoque_alertas (
  id bigserial primary key,
  user_id uuid not null,
  termo text not null,
  loja text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  notificado_em timestamptz,
  encontrado_produto text,
  encontrado_referencia text,
  encontrado_qtd int,
  visto boolean not null default false
);

create index estoque_alertas_ativo_idx on estoque_alertas (ativo) where ativo = true and notificado_em is null;

alter table estoque_alertas enable row level security;

create policy "Usuarios veem seus proprios alertas"
  on estoque_alertas for select
  using (user_id = auth.uid());

create policy "Usuarios criam seus proprios alertas"
  on estoque_alertas for insert
  with check (user_id = auth.uid());

create policy "Usuarios atualizam seus proprios alertas"
  on estoque_alertas for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Usuarios apagam seus proprios alertas"
  on estoque_alertas for delete
  using (user_id = auth.uid());
