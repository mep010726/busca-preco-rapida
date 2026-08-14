-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Qualquer usuario logado pode escrever no catalogo compartilhado
-- (referencias_index) - isso e' necessario, pois e' assim que o catalogo se
-- alimenta sozinho a cada busca por codigo de barras. O problema: a policy
-- de update de hoje deixa TROCAR a referencia (cd_referencia) de um codigo
-- de barras ja cadastrado pra qualquer outra coisa - o pior tipo de dado
-- errado, ja que e' esse campo que a busca por referencia usa pra achar o
-- produto certo. Um codigo de barras real da Mersan sempre aponta pra
-- mesma referencia, entao travar isso nao atrapalha o uso normal (buscas
-- legitimas sempre reenviam a mesma referencia), so impede alguem de
-- "sequestrar" uma entrada existente.
create or replace function bloquear_troca_referencia()
returns trigger as $$
begin
  if NEW.cd_referencia is distinct from OLD.cd_referencia then
    raise exception 'Não é permitido trocar a referência de um código de barras já cadastrado.';
  end if;
  return NEW;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_bloquear_troca_referencia on referencias_index;
create trigger trg_bloquear_troca_referencia
  before update on referencias_index
  for each row
  execute function bloquear_troca_referencia();
