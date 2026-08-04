-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

alter table historico add column favorito boolean not null default false;

-- Politicas que faltavam: sem elas, apagar e favoritar (update) sao bloqueados
-- pelo RLS mesmo sendo o dono do registro.
create policy "Usuarios apagam seu proprio historico"
  on historico for delete
  using (auth.uid() = user_id);

create policy "Usuarios atualizam seu proprio historico"
  on historico for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
