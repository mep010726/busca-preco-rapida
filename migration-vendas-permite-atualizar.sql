-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- A tabela "vendas" tinha politicas de SELECT/INSERT/DELETE mas nunca teve
-- uma de UPDATE. Isso fazia o recalculo de total (ao adicionar ou remover
-- item de uma venda ja finalizada, em app.js) falhar silenciosamente: o
-- Postgres so aplica um update em linhas que passam pela politica, entao
-- sem nenhuma o update simplesmente nao alterava nada, mesmo sem erro.
create policy "Usuarios atualizam suas vendas, admin atualiza qualquer"
  on vendas for update
  using (user_id = auth.uid() or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com')
  with check (user_id = auth.uid() or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');
