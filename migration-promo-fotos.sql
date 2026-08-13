-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Registra 1 linha toda vez que alguem processa uma foto na aba Promocao
-- (tirando ou enviando uma foto ja tirada) - usado so pra contar atividade
-- no painel "Usuarios mais ativos" do admin, sem guardar a foto em si.
create table promo_fotos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  email text,
  criado_em timestamptz not null default now()
);

create index promo_fotos_user_id_idx on promo_fotos (user_id);

alter table promo_fotos enable row level security;

create policy "Usuarios veem suas fotos de promocao, admin ve tudo"
  on promo_fotos for select
  using (auth.uid() = user_id or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');

create policy "Usuarios registram suas fotos de promocao"
  on promo_fotos for insert
  with check (auth.uid() = user_id);
