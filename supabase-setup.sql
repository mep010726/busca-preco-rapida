-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

create table historico (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  codigo_barras text not null,
  produto text,
  preco numeric,
  lojas text,
  criado_em timestamptz not null default now()
);

alter table historico enable row level security;

create policy "Usuarios veem so seu proprio historico"
  on historico for select
  using (auth.uid() = user_id);

create policy "Usuarios inserem seu proprio historico"
  on historico for insert
  with check (auth.uid() = user_id);

-- IMPORTANTE: mantenha "Confirm email" ATIVADO em Authentication > Providers
-- > Email (e' o padrao do Supabase). Isso obriga o funcionario a clicar no
-- link enviado por e-mail antes de conseguir logar, confirmando que o
-- cadastro e' real.

-- Tambem va em Authentication > Settings > Bot and Abuse Protection,
-- ative "Enable Captcha protection", escolha "Turnstile" e cole a
-- Secret Key que voce gerou no Cloudflare Turnstile (dashboard.cloudflare.com
-- > Turnstile > Add site). A Site Key (diferente da Secret Key) vai no
-- index.html, na constante TURNSTILE_SITE_KEY.
