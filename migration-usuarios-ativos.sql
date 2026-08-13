-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Pra montar o painel "Usuarios mais ativos" no admin, precisamos saber o
-- e-mail de quem fez cada busca, e o admin precisa poder ver o historico de
-- todo mundo (nao so o proprio). A tabela historico ainda nao guarda o
-- e-mail (so o user_id), e a policy de select so deixa cada um ver o
-- proprio historico.

-- Guarda o e-mail direto no registro, igual "vendas" e "sugestoes" ja fazem
-- (evita depender de acesso a auth.users so pra mostrar "quem buscou").
alter table historico add column if not exists email text;

-- Troca a policy de select: cada um continua vendo so o proprio historico,
-- mas o admin (lucasfsa1998@hotmail.com) passa a ver de todo mundo.
drop policy if exists "Usuarios veem so seu proprio historico" on historico;
create policy "Usuarios veem seu historico, admin ve tudo"
  on historico for select
  using (auth.uid() = user_id or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');
