-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Hoje qualquer usuario logado pode escrever nas tabelas abaixo sem nenhum
-- limite de quantidade - alguem com uma conta valida poderia escrever um
-- script simples mandando milhares de requisicoes por minuto direto pra
-- API do Supabase (sem passar pela tela do app), enchendo o banco de lixo
-- ou consumindo a cota de uso do projeto. Isso adiciona um "freio": cada
-- usuario so pode inserir/atualizar um numero razoavel de linhas por
-- minuto em cada tabela - bem acima do que um humano usando o app
-- normalmente geraria, mas baixo o suficiente pra travar um script.

create table limite_requisicoes (
  id bigserial primary key,
  user_id uuid not null,
  tabela text not null,
  criado_em timestamptz not null default now()
);

create index limite_requisicoes_user_tabela_idx on limite_requisicoes (user_id, tabela, criado_em);

-- Sem policy nenhuma = ninguem consegue ler/escrever essa tabela direto
-- pela API. So a funcao abaixo (security definer) mexe nela.
alter table limite_requisicoes enable row level security;

-- Funcao generica: recebe o limite e a janela de tempo como argumentos do
-- trigger, conta quantas requisicoes esse usuario ja fez nessa tabela
-- dentro da janela, e bloqueia se passou do limite. Tambem limpa sozinha
-- os registros antigos desse usuario/tabela a cada chamada (sem precisar
-- de um job agendado separado).
create or replace function aplicar_limite_requisicoes()
returns trigger as $$
declare
  limite integer := TG_ARGV[0]::integer;
  janela interval := TG_ARGV[1]::interval;
  contagem integer;
  usuario uuid := auth.uid();
begin
  if usuario is null then
    return NEW;
  end if;

  delete from limite_requisicoes
    where user_id = usuario and tabela = TG_TABLE_NAME and criado_em < now() - janela;

  select count(*) into contagem
    from limite_requisicoes
    where user_id = usuario and tabela = TG_TABLE_NAME and criado_em >= now() - janela;

  if contagem >= limite then
    raise exception 'Muitas requisições em pouco tempo — aguarde um instante e tente de novo.';
  end if;

  insert into limite_requisicoes (user_id, tabela) values (usuario, TG_TABLE_NAME);

  return NEW;
end;
$$ language plpgsql security definer set search_path = public;

-- referencias_index recebe 1 escrita a cada busca por codigo de barras
-- (novo produto = insert, ja conhecido = update), entao o limite cobre
-- os dois eventos.
drop trigger if exists trg_limite_referencias_index on referencias_index;
create trigger trg_limite_referencias_index
  before insert or update on referencias_index
  for each row execute function aplicar_limite_requisicoes('100', '1 minute');

drop trigger if exists trg_limite_historico on historico;
create trigger trg_limite_historico
  before insert on historico
  for each row execute function aplicar_limite_requisicoes('100', '1 minute');

drop trigger if exists trg_limite_promo_fotos on promo_fotos;
create trigger trg_limite_promo_fotos
  before insert on promo_fotos
  for each row execute function aplicar_limite_requisicoes('30', '1 minute');

drop trigger if exists trg_limite_sugestoes on sugestoes;
create trigger trg_limite_sugestoes
  before insert on sugestoes
  for each row execute function aplicar_limite_requisicoes('10', '1 minute');

drop trigger if exists trg_limite_mais_procurados on mais_procurados;
create trigger trg_limite_mais_procurados
  before insert on mais_procurados
  for each row execute function aplicar_limite_requisicoes('20', '1 minute');

drop trigger if exists trg_limite_vendas on vendas;
create trigger trg_limite_vendas
  before insert on vendas
  for each row execute function aplicar_limite_requisicoes('40', '1 minute');
