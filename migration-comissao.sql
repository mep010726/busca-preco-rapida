-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Configuracao (unica, global) das porcentagens de comissao. So o admin
-- edita; todo mundo logado le, pra calcular a propria comissao.
create table config_comissao (
  id int primary key default 1,
  pct_1_lugar numeric not null default 5,
  pct_2_lugar numeric not null default 4.5,
  pct_3_lugar numeric not null default 4.2,
  pct_meta_batida numeric not null default 4,
  pct_meta_nao_batida numeric not null default 3.3,
  atualizado_em timestamptz not null default now(),
  constraint config_comissao_singleton check (id = 1)
);
insert into config_comissao (id) values (1);

alter table config_comissao enable row level security;

create policy "Todos logados leem a config de comissao"
  on config_comissao for select
  to authenticated
  using (true);

create policy "Somente admin atualiza a config de comissao"
  on config_comissao for update
  using (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com')
  with check (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');

-- Funcao que calcula a posicao do vendedor no ranking do mes (por total
-- vendido) e se ele bateu a meta mensal (soma das duas metas quinzenais).
-- E' "security definer" pra poder comparar com o total de TODOS os
-- vendedores sem que cada vendedor precise ter permissao de ler as vendas
-- alheias (RLS normal so deixa cada um ver as proprias vendas) — mas ela
-- so devolve a linha do proprio usuario que chamou, entao nao vaza dado de
-- ninguem, so a posicao relativa.
create or replace function ranking_vendedor_mes()
returns table(posicao bigint, total_vendido numeric, total_vendedores bigint, meta_total numeric, meta_batida boolean)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  inicio_mes timestamptz := date_trunc('month', now());
  fim_mes timestamptz := date_trunc('month', now()) + interval '1 month';
begin
  return query
  with totais as (
    select user_id, sum(total) as total_vendido
    from vendas
    where criado_em >= inicio_mes and criado_em < fim_mes
    group by user_id
  ),
  ranking as (
    select user_id, total_vendido,
           rank() over (order by total_vendido desc) as posicao,
           count(*) over () as total_vendedores
    from totais
  )
  select r.posicao, r.total_vendido, r.total_vendedores,
         coalesce(m.meta_quinzena_1, 0) + coalesce(m.meta_quinzena_2, 0) as meta_total,
         r.total_vendido >= (coalesce(m.meta_quinzena_1, 0) + coalesce(m.meta_quinzena_2, 0))
           and (coalesce(m.meta_quinzena_1, 0) + coalesce(m.meta_quinzena_2, 0)) > 0 as meta_batida
  from ranking r
  left join metas m on m.user_id = r.user_id and m.ano_mes = to_char(now(), 'YYYY-MM')
  where r.user_id = auth.uid();
end;
$$;

grant execute on function ranking_vendedor_mes() to authenticated;
