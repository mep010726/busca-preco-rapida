-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Troca: registra o(s) produto(s) devolvido(s) e o(s) produto(s) novo(s) que
-- o cliente leva no lugar. "subtotal" continua sendo a soma dos produtos
-- novos, "valor_devolvido" a soma dos devolvidos, e "total" (ja existente)
-- passa a ser subtotal - desconto_valor - valor_devolvido — ou seja, o
-- valor real que entra (ou sai, se negativo) naquela troca.
alter table vendas add column tipo text not null default 'venda' check (tipo in ('venda', 'troca'));
alter table vendas add column valor_devolvido numeric not null default 0;

-- Marca se aquela linha de item é um produto devolvido (troca) ou não.
alter table venda_itens add column devolvido boolean not null default false;
