-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Guarda o tema visual customizado (cor de destaque, cor de fundo,
-- formato de botao, tamanho de fonte) escolhido pelo admin, pra aplicar
-- pra todo mundo que abrir o app. E uma linha so (id fixo = 1).
create table config_layout (
  id int primary key default 1,
  cor_destaque text not null default '#ff7a45',
  cor_fundo text not null default '#0b1120',
  formato_botao text not null default 'pilula' check (formato_botao in ('pilula', 'arredondado', 'quadrado')),
  tamanho_fonte text not null default 'normal' check (tamanho_fonte in ('normal', 'grande')),
  atualizado_em timestamptz not null default now(),
  constraint config_layout_singleton check (id = 1)
);

insert into config_layout (id) values (1);

alter table config_layout enable row level security;

-- Todo usuario logado precisa ler pra aplicar o tema na tela dele.
create policy "Todos logados leem o layout"
  on config_layout for select
  to authenticated
  using (true);

-- So o admin pode mudar o layout de todo mundo.
create policy "Somente admin atualiza o layout"
  on config_layout for update
  using (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com')
  with check (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');
