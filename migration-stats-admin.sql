-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Ate agora cada usuario so enxergava o proprio historico (RLS por user_id).
-- Pra montar o painel de estatisticas do admin (total de buscas, favoritos
-- etc. de TODOS os usuarios), o admin precisa poder ler a tabela inteira.
create policy "Admin ve todo o historico"
  on historico for select
  using (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');
