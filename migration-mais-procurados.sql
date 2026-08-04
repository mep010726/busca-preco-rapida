-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

create table mais_procurados (
  id uuid primary key default gen_random_uuid(),
  codigo_barras text not null,
  produto text,
  preco numeric,
  lojas text,
  status text not null default 'pendente' check (status in ('pendente', 'aprovado', 'rejeitado')),
  sugerido_por uuid references auth.users(id) not null default auth.uid(),
  criado_em timestamptz not null default now(),
  revisado_em timestamptz
);

alter table mais_procurados enable row level security;

-- Todo mundo logado ve os itens ja aprovados; quem sugeriu ve o proprio
-- pendente/rejeitado tambem; e o admin (lucasfsa1998@hotmail.com) ve tudo.
create policy "Ver aprovados, os proprios, ou tudo se for admin"
  on mais_procurados for select
  using (
    status = 'aprovado'
    or sugerido_por = auth.uid()
    or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com'
  );

-- Qualquer usuario logado pode sugerir um item (fica pendente ate revisao)
create policy "Usuarios sugerem itens"
  on mais_procurados for insert
  with check (sugerido_por = auth.uid());

-- So o admin aprova ou rejeita (muda o status)
create policy "Somente admin revisa"
  on mais_procurados for update
  using (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com')
  with check (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');

-- So o admin apaga
create policy "Somente admin apaga"
  on mais_procurados for delete
  using (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');
