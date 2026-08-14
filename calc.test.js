// Testes das contas de dinheiro (calc.js). Roda com Node 18+, sem precisar
// instalar nada:
//
//   node --test calc.test.js
//
// (ou `node --test` pra rodar todo arquivo *.test.js da pasta)

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { formatarCentavosDigitados, calcularTotaisVenda, calcularComissaoQuinzena } = require("./calc.js");

describe("formatarCentavosDigitados", () => {
  test("string vazia/zero vira 0,00", () => {
    assert.equal(formatarCentavosDigitados(""), "0,00");
    assert.equal(formatarCentavosDigitados("0"), "0,00");
  });

  test("os 2 últimos dígitos são sempre os centavos", () => {
    assert.equal(formatarCentavosDigitados("3999"), "39,99");
    assert.equal(formatarCentavosDigitados("5"), "0,05");
    assert.equal(formatarCentavosDigitados("50"), "0,50");
  });

  test("usa separador de milhar no padrão brasileiro", () => {
    assert.equal(formatarCentavosDigitados("100000"), "1.000,00");
  });
});

describe("calcularTotaisVenda — modo percentual", () => {
  test("0% não muda o total", () => {
    const r = calcularTotaisVenda(100, "percentual", 0, null);
    assert.equal(r.totalFinal, 100);
    assert.equal(r.descontoValor, 0);
  });

  test("10% de desconto sobre 100", () => {
    const r = calcularTotaisVenda(100, "percentual", 10, null);
    assert.equal(r.descontoValor, 10);
    assert.equal(r.totalFinal, 90);
  });

  test("percentual acima de 100 é limitado a 100 (não fica negativo)", () => {
    const r = calcularTotaisVenda(100, "percentual", 150, null);
    assert.equal(r.descontoPct, 100);
    assert.equal(r.totalFinal, 0);
  });

  test("percentual negativo é limitado a 0", () => {
    const r = calcularTotaisVenda(100, "percentual", -20, null);
    assert.equal(r.descontoPct, 0);
    assert.equal(r.totalFinal, 100);
  });

  test("percentual não-numérico é tratado como 0", () => {
    const r = calcularTotaisVenda(100, "percentual", "abc", null);
    assert.equal(r.descontoPct, 0);
    assert.equal(r.totalFinal, 100);
  });
});

describe("calcularTotaisVenda — modo valor final", () => {
  test("campo vazio (null) não aplica desconto", () => {
    const r = calcularTotaisVenda(100, "valor", null, null);
    assert.equal(r.totalFinal, 100);
    assert.equal(r.descontoValor, 0);
  });

  test("valor final digitado menor que o subtotal calcula o desconto certo", () => {
    const r = calcularTotaisVenda(100, "valor", null, 80);
    assert.equal(r.totalFinal, 80);
    assert.equal(r.descontoValor, 20);
    assert.equal(r.descontoPct, 20);
  });

  test("valor final maior que o subtotal é limitado ao subtotal (sem desconto negativo)", () => {
    const r = calcularTotaisVenda(100, "valor", null, 500);
    assert.equal(r.totalFinal, 100);
    assert.equal(r.descontoValor, 0);
  });

  test("valor final negativo é limitado a 0", () => {
    const r = calcularTotaisVenda(100, "valor", null, -50);
    assert.equal(r.totalFinal, 0);
    assert.equal(r.descontoValor, 100);
  });

  test("subtotal 0 não gera divisão por zero (NaN) no percentual", () => {
    const r = calcularTotaisVenda(0, "valor", null, 0);
    assert.equal(r.descontoPct, 0);
    assert.equal(Number.isNaN(r.descontoPct), false);
  });
});

describe("calcularComissaoQuinzena", () => {
  test("meta não definida (0) sempre usa o percentual de meta não batida", () => {
    const r = calcularComissaoQuinzena(999999, 0, 10, 3);
    assert.equal(r.bateu, false);
    assert.equal(r.pct, 3);
  });

  test("bateu a meta usa o percentual maior", () => {
    const r = calcularComissaoQuinzena(1000, 1000, 10, 3);
    assert.equal(r.bateu, true);
    assert.equal(r.pct, 10);
    assert.equal(r.comissao, 100);
  });

  test("ficou abaixo da meta usa o percentual menor", () => {
    const r = calcularComissaoQuinzena(999, 1000, 10, 3);
    assert.equal(r.bateu, false);
    assert.equal(r.pct, 3);
    assert.equal(Math.round(r.comissao * 100) / 100, 29.97);
  });

  test("bater a meta exatamente no limite conta como batida", () => {
    const r = calcularComissaoQuinzena(1000, 1000, 10, 3);
    assert.equal(r.bateu, true);
  });
});
