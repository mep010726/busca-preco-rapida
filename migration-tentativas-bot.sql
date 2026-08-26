-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Registra quando o campo isca (honeypot) do cadastro e preenchido -
-- sinal de cadastro automatizado (bot), ja que nenhum humano navegando
-- normalmente ve ou preenche esse campo. So guarda a data/hora, sem
-- nenhum dado que o bot mandou (nem e-mail, nem o que ele digitou no
-- campo isca), pra nao virar um jeito de injetar lixo no banco.
create table tentativas_bot (
  id bigserial primary key,
  criado_em timestamptz not null default now()
);

alter table tentativas_bot enable row level security;

-- O honeypot dispara ANTES do cadastro de verdade, entao quem tenta
-- ainda nao esta logado - a policy de insert precisa valer pro "anon".
create policy "Qualquer um pode registrar uma tentativa de bot"
  on tentativas_bot for insert
  to anon, authenticated
  with check (true);

-- So o admin ve o total (nao expoe pra ninguem quantas tentativas
-- de bot o site recebe).
create policy "Somente admin ve as tentativas de bot"
  on tentativas_bot for select
  using (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');
