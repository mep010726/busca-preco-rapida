-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

create table sugestoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  email text not null,
  texto text not null,
  criado_em timestamptz not null default now()
);

alter table sugestoes enable row level security;

-- O usuario ve as proprias sugestoes; o admin ve todas
create policy "Ver proprias sugestoes ou tudo se for admin"
  on sugestoes for select
  using (
    user_id = auth.uid()
    or auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com'
  );

-- Qualquer usuario logado pode enviar uma sugestao
create policy "Usuarios enviam sugestoes"
  on sugestoes for insert
  with check (user_id = auth.uid());

-- So o admin apaga (ex: depois de ler e resolver)
create policy "Somente admin apaga sugestoes"
  on sugestoes for delete
  using (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');
