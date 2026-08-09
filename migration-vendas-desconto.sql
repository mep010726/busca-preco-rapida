-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

-- Guarda o valor antes do desconto (subtotal) e o desconto aplicado
-- (em R$ e em %), separado do total final (que ja existia e continua
-- sendo o valor realmente cobrado do cliente).
alter table vendas add column subtotal numeric not null default 0;
alter table vendas add column desconto_valor numeric not null default 0;
alter table vendas add column desconto_percentual numeric not null default 0;
