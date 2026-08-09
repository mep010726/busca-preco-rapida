-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)
-- Corrige o erro "column reference total_vendido is ambiguous" na função
-- ranking_vendedor_mes: os nomes das colunas de retorno colidiam com os
-- nomes usados dentro da consulta. Só precisa rodar isso (não mexe na
-- tabela config_comissao, que já foi criada).

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
