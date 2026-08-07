-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Guarda ate onde a varredura automatica de SKUs novos ja chegou, pra cada
-- execucao continuar de onde parou (em vez de refazer tudo toda vez).
create table indice_estado (
  chave text primary key,
  valor bigint not null,
  atualizado_em timestamptz not null default now()
);

alter table indice_estado enable row level security;

create policy "Admin gerencia estado do indice"
  on indice_estado for all
  using (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com')
  with check (auth.jwt() ->> 'email' = 'lucasfsa1998@hotmail.com');

-- SKU inicial: o maior que ja veio no CSV importado (2026-08-06). A partir
-- daqui, a varredura automatica so testa numeros ACIMA deste.
insert into indice_estado (chave, valor) values ('maior_sku_escaneado', 13003542);
