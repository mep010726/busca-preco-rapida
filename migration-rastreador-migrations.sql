-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Nao da pra saber "quais migrations eu ja rodei" so olhando os arquivos
-- .sql do projeto - isso so existe na sua cabeca (ou nesse chat). Essa
-- funcao verifica, direto no banco, se a tabela/coluna/policy/funcao que
-- cada migration cria realmente existe, e devolve uma lista com o status
-- de cada uma. Funciona pra migrations que ja rodaram no passado tambem
-- (nao depende de nenhum registro criado na hora que a migration rodou).
create or replace function status_migrations()
returns table(nome text, aplicada boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.jwt() ->> 'email' != 'lucasfsa1998@hotmail.com' then
    return;
  end if;

  return query select 'supabase-setup.sql'::text, to_regclass('public.historico') is not null;
  return query select 'migration-referencias.sql'::text, to_regclass('public.referencias_index') is not null;
  return query select 'migration-favoritos.sql'::text,
    exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'historico' and column_name = 'favorito');
  return query select 'migration-indice-estado.sql'::text, to_regclass('public.indice_estado') is not null;
  return query select 'migration-vendas.sql'::text,
    to_regclass('public.vendas') is not null and to_regclass('public.venda_itens') is not null;
  return query select 'migration-vendas-desconto.sql'::text,
    exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'vendas' and column_name = 'desconto_percentual');
  return query select 'migration-vendas-trocas.sql'::text,
    exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'venda_itens' and column_name = 'devolvido');
  return query select 'migration-vendas-permite-atualizar.sql'::text,
    exists(select 1 from pg_policies where tablename = 'vendas' and policyname = 'Usuarios atualizam suas vendas, admin atualiza qualquer');
  return query select 'migration-comissao.sql (inclui fix-ambiguidade)'::text, to_regclass('public.config_comissao') is not null;
  return query select 'migration-mais-procurados.sql'::text, to_regclass('public.mais_procurados') is not null;
  return query select 'migration-metas.sql'::text,
    to_regclass('public.metas') is not null and to_regclass('public.folgas') is not null;
  return query select 'migration-mute-sugestoes.sql'::text, to_regclass('public.sugestoes_mute') is not null;
  return query select 'migration-promo-fotos.sql'::text, to_regclass('public.promo_fotos') is not null;
  return query select 'migration-protege-referencias.sql'::text, to_regprocedure('public.bloquear_troca_referencia()') is not null;
  return query select 'migration-sugestoes.sql'::text, to_regclass('public.sugestoes') is not null;
  return query select 'migration-stats-admin.sql'::text,
    exists(select 1 from pg_policies where tablename = 'historico' and policyname = 'Admin ve todo o historico');
  return query select 'migration-usuarios-ativos.sql'::text,
    exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'historico' and column_name = 'email');
  return query select 'migration-esconde-email-admin.sql'::text, to_regprocedure('public.sou_admin()') is not null;
  return query select 'migration-limite-requisicoes.sql'::text, to_regclass('public.limite_requisicoes') is not null;
  return query select 'migration-config-layout.sql'::text, to_regclass('public.config_layout') is not null;
  return query select 'migration-tentativas-bot.sql'::text, to_regclass('public.tentativas_bot') is not null;
end;
$$;

grant execute on function status_migrations() to authenticated;
