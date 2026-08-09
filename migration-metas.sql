-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Meta de vendas por quinzena, por vendedor, por mes (ano_mes no formato
-- 'YYYY-MM'). Cada vendedor define a propria meta.
create table metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  ano_mes text not null,
  meta_quinzena_1 numeric not null default 0,
  meta_quinzena_2 numeric not null default 0,
  unique (user_id, ano_mes)
);

-- Dias de folga marcados pelo vendedor, usados pra recalcular a meta
-- diaria descontando os dias que ele nao vai trabalhar.
create table folgas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  data date not null,
  unique (user_id, data)
);

alter table metas enable row level security;
alter table folgas enable row level security;

create policy "Usuarios veem suas metas, admin ve tudo"
  on metas for select
  using (user_id = auth.uid() or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');

create policy "Usuarios gerenciam suas metas"
  on metas for insert
  with check (user_id = auth.uid());

create policy "Usuarios atualizam suas metas"
  on metas for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Usuarios veem suas folgas, admin ve tudo"
  on folgas for select
  using (user_id = auth.uid() or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');

create policy "Usuarios gerenciam suas folgas"
  on folgas for insert
  with check (user_id = auth.uid());

create policy "Usuarios apagam suas folgas"
  on folgas for delete
  using (user_id = auth.uid());
