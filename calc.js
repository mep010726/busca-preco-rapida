// Funções puras (sem DOM, sem rede) das contas de dinheiro do app — preço
// com máscara, desconto/total de venda, comissão por quinzena. Separadas
// aqui pra dar pra testar isoladas (veja calc.test.js) sem precisar
// simular um navegador inteiro. Carregado como <script> normal no
// index.html (antes do app.js) e também via require() nos testes em Node.

// Converte dígitos crus (ex: "3999") no valor mascarado tipo calculadora
// (ex: "39,99" — os 2 últimos dígitos são sempre os centavos).
function formatarCentavosDigitados(digitos) {
  const num = (Number(digitos) || 0) / 100;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Calcula subtotal/desconto/total de uma venda a partir do modo de
// desconto escolhido: "percentual" (desconto em %) ou "valor" (digita
// direto o valor final da compra — útil quando a porcentagem não fecha um
// número redondo). valorFinalDigitado é `null`/`undefined` quando o campo
// está vazio (usa o subtotal inteiro, sem desconto).
function calcularTotaisVenda(subtotal, modoDesconto, descontoPctInput, valorFinalDigitado) {
  let totalFinal = subtotal;
  let descontoValor = 0;
  let descontoPct = 0;

  if (modoDesconto === "percentual") {
    descontoPct = Math.min(100, Math.max(0, Number(descontoPctInput) || 0));
    descontoValor = subtotal * (descontoPct / 100);
    totalFinal = subtotal - descontoValor;
  } else {
    const digitado = valorFinalDigitado == null ? subtotal : Number(valorFinalDigitado) || 0;
    totalFinal = Math.max(0, Math.min(subtotal, digitado));
    descontoValor = subtotal - totalFinal;
    descontoPct = subtotal > 0 ? (descontoValor / subtotal) * 100 : 0;
  }

  return { subtotal, totalFinal, descontoValor, descontoPct };
}

// Comissão de uma quinzena: só libera o percentual "meta batida" se a meta
// estiver definida (> 0) e o total vendido tiver alcançado ela.
function calcularComissaoQuinzena(totalVendido, meta, pctMetaBatida, pctMetaNaoBatida) {
  const bateu = meta > 0 && totalVendido >= meta;
  const pct = bateu ? Number(pctMetaBatida) : Number(pctMetaNaoBatida);
  const comissao = totalVendido * (pct / 100);
  return { bateu, pct, comissao };
}

// Parcelamento sem juros pra arte de promoção: o número de parcelas nunca
// deixa a parcela ficar abaixo do mínimo (padrão R$ 40), até um teto (10x).
// Se o preço não permitir nem 2x dentro da regra, cai pra 1 parcela — quem
// chama decide se vale a pena mostrar "1x" (geralmente não).
function calcularParcelamento(preco, parcelaMinima = 40, maxParcelas = 10) {
  const parcelas = Math.max(1, Math.min(maxParcelas, Math.floor(preco / parcelaMinima)));
  return { parcelas, valorParcela: preco / parcelas };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { formatarCentavosDigitados, calcularTotaisVenda, calcularComissaoQuinzena, calcularParcelamento };
}
