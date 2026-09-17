-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- A tela "Usuarios mais ativos" buscava a tabela "historico" inteira pro
-- navegador contar linha por linha - mas o Supabase, por padrao, so
-- devolve as primeiras 1000 linhas de uma consulta sem paginacao. Com a
-- tabela ja passando de 1947 linhas, a contagem ficava incompleta (faltava
-- gente com atividade recente, ja que a fatia devolvida nao cobre tudo).
-- Essa funcao faz a contagem dentro do banco (que nao tem esse limite) e
-- so devolve o resultado ja somado - poucas linhas, uma por usuario.
create or replace function usuarios_ativos_stats()
returns table(email text, buscas bigint, vendas bigint, fotos bigint)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  if auth.jwt() ->> 'email' != 'lucasfsa1998@hotmail.com' then
    return;
  end if;

  return query
  select
    e.email,
    count(*) filter (where e.origem = 'busca') as buscas,
    count(*) filter (where e.origem = 'venda') as vendas,
    count(*) filter (where e.origem = 'foto') as fotos
  from (
    select email, 'busca' as origem from historico where email is not null
    union all
    select vendedor_email as email, 'venda' as origem from vendas where vendedor_email is not null
    union all
    select email, 'foto' as origem from promo_fotos where email is not null
  ) e
  group by e.email
  order by count(*) desc;
end;
$$;

grant execute on function usuarios_ativos_stats() to authenticated;

-- Mesmo problema, mesma solucao: "Vendas por vendedor (mes atual)" ainda
-- nao tinha estourado o limite (vendas tem 251 linhas hoje), mas ia
-- estourar com o tempo. Corrigindo junto agora evita o mesmo bug se
-- repetir mais pra frente sem ninguem perceber.
create or replace function resumo_vendedores_mes()
returns table(vendedor_email text, total_vendas bigint, total_valor numeric)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.jwt() ->> 'email' != 'lucasfsa1998@hotmail.com' then
    return;
  end if;

  return query
  select v.vendedor_email, count(*), sum(v.total)
  from vendas v
  where v.criado_em >= date_trunc('month', now())
    and v.criado_em < date_trunc('month', now()) + interval '1 month'
  group by v.vendedor_email
  order by sum(v.total) desc;
end;
$$;

grant execute on function resumo_vendedores_mes() to authenticated;
