-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- O app.js guardava o e-mail do admin em texto puro (const ADMIN_EMAIL =
-- "..."), visivel pra qualquer um que abrisse o F12/"Ver codigo-fonte".
-- Isso nao era uma falha de acesso (a checagem de verdade sempre foi feita
-- no banco, via RLS), mas expunha o e-mail pessoal do admin publicamente.
-- Essa funcao move a checagem "sou admin?" pro banco - o cliente so recebe
-- true/false, nunca o e-mail em si.
create or replace function sou_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com';
$$;

grant execute on function sou_admin() to authenticated;
