-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Registro de vendas: cada venda tem uma loja, um total, uma observacao
-- opcional, e uma lista de itens (venda_itens). O email do vendedor fica
-- salvo direto na venda (igual a tabela sugestoes ja faz) pra nao precisar
-- de acesso a auth.users so pra mostrar "quem vendeu" pro admin.
create table vendas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  vendedor_email text,
  loja integer not null,
  total numeric not null default 0,
  observacao text,
  criado_em timestamptz not null default now()
);

create table venda_itens (
  id uuid primary key default gen_random_uuid(),
  venda_id uuid references vendas(id) on delete cascade not null,
  codigo_barras text,
  produto text,
  preco_unit numeric not null,
  quantidade integer not null default 1,
  subtotal numeric not null
);

create index vendas_user_id_idx on vendas (user_id);
create index venda_itens_venda_id_idx on venda_itens (venda_id);

alter table vendas enable row level security;
alter table venda_itens enable row level security;

-- Cada um ve as proprias vendas; o admin (lucasfsa1998@hotmail.com) ve todas
create policy "Usuarios veem suas vendas, admin ve tudo"
  on vendas for select
  using (user_id = auth.uid() or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');

create policy "Usuarios criam suas vendas"
  on vendas for insert
  with check (user_id = auth.uid());

create policy "Usuarios apagam suas vendas, admin apaga qualquer"
  on vendas for delete
  using (user_id = auth.uid() or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');

-- Itens seguem a visibilidade/permissao da venda-pai
create policy "Itens visiveis se a venda for visivel"
  on venda_itens for select
  using (exists (
    select 1 from vendas v where v.id = venda_id
    and (v.user_id = auth.uid() or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com')
  ));

create policy "Itens inseridos se a venda for do usuario"
  on venda_itens for insert
  with check (exists (
    select 1 from vendas v where v.id = venda_id and v.user_id = auth.uid()
  ));

create policy "Itens apagados se a venda for visivel/admin"
  on venda_itens for delete
  using (exists (
    select 1 from vendas v where v.id = venda_id
    and (v.user_id = auth.uid() or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com')
  ));
