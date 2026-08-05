-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

create table sugestoes_mute (
  user_id uuid primary key references auth.users(id),
  mutado_ate timestamptz not null,
  mutado_por uuid references auth.users(id),
  criado_em timestamptz not null default now()
);

alter table sugestoes_mute enable row level security;

-- Só o admin gerencia mutes (criar, ver todos, remover)
create policy "Admin gerencia mutes"
  on sugestoes_mute for all
  using (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com')
  with check (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');

-- O proprio usuario pode ver se ele esta mutado (pra mostrar aviso no app)
create policy "Usuario ve seu proprio mute"
  on sugestoes_mute for select
  using (user_id = auth.uid());

-- Bloqueio de verdade no banco: mesmo que alguem tente burlar a tela e
-- chamar a API direto, o insert em "sugestoes" e rejeitado se o usuario
-- estiver mutado no momento.
create or replace function bloquear_sugestao_se_mutado()
returns trigger as $$
begin
  if exists (
    select 1 from sugestoes_mute
    where user_id = new.user_id
      and mutado_ate > now()
  ) then
    raise exception 'Você está temporariamente impedido de enviar sugestões.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_bloquear_sugestao on sugestoes;
create trigger trg_bloquear_sugestao
  before insert on sugestoes
  for each row execute function bloquear_sugestao_se_mutado();
