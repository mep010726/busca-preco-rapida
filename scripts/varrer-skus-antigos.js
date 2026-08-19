// Varredura de produtos ANTIGOS: complementa a varredura semanal (que so
// anda pra frente a partir do maior SKU ja visto). Produtos que ficaram de
// fora do CSV original e tem SKU MENOR que o inicio dele nunca seriam
// pegos pela varredura normal, entao este script anda pra tras a partir
// do ponteiro "menor_sku_escaneado" (comeca no inicio do CSV, na primeira
// vez) e vai descendo em janelas, igual a varredura semanal so que ao
// contrario. Nao roda sozinho/agendado - e pra rodar manualmente em
// pedacos, ja que voltar ate o SKU 1 seria impraticavel de uma vez.
//
// Uso: SUPABASE_SERVICE_ROLE_KEY=xxx node varrer-skus-antigos.js

const SUPABASE_URL = "https://izjymicfgxtqafhlceyf.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MERSAN_API = "https://credito.mersan.co/api/v1/buscapreco";
const LOJA_PARA_CONSULTA = 1;
const CONCORRENCIA = Number(process.env.CONCORRENCIA || 8);
const PAUSA_ENTRE_REQUISICOES_MS = 450;
const TAMANHO_JANELA = Number(process.env.TAMANHO_JANELA || 20000);
// Ponto de partida na primeira execucao (o menor SKU que ja veio no CSV
// importado em 2026-08-06). So e usado se ainda nao existir um ponteiro
// reverso salvo no banco.
const INICIO_PADRAO = 13003542;
// Abaixo desse SKU nao vale mais a pena continuar. 1 = varrer ate o comeco
// de verdade (a parada automatica por "janelas vazias" no loop.sh normalmente
// encerra antes disso, quando os SKUs ficam antigos demais pra existir).
const META_FINAL = 1;

if (!SERVICE_ROLE_KEY) {
  console.error("Uso: SUPABASE_SERVICE_ROLE_KEY=xxx node varrer-skus-antigos.js");
  process.exit(1);
}

function dormir(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function headersSupabase() {
  return {
    "Content-Type": "application/json",
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  };
}

async function lerEstadoReverso() {
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/indice_estado?chave=eq.menor_sku_escaneado&select=valor`,
    { headers: headersSupabase() }
  );
  const data = await resp.json();
  if (data && data.length > 0) return Number(data[0].valor);

  // Primeira vez rodando: cria o ponteiro reverso comecando no inicio do CSV.
  await fetch(`${SUPABASE_URL}/rest/v1/indice_estado`, {
    method: "POST",
    headers: { ...headersSupabase(), Prefer: "return=minimal" },
    body: JSON.stringify({ chave: "menor_sku_escaneado", valor: INICIO_PADRAO }),
  });
  return INICIO_PADRAO;
}

async function salvarEstadoReverso(novoValor) {
  await fetch(`${SUPABASE_URL}/rest/v1/indice_estado?chave=eq.menor_sku_escaneado`, {
    method: "PATCH",
    headers: { ...headersSupabase(), Prefer: "return=minimal" },
    body: JSON.stringify({ valor: novoValor, atualizado_em: new Date().toISOString() }),
  });
}

async function buscarProduto(sku, tentativas = 8) {
  for (let i = 0; i < tentativas; i++) {
    const resp = await fetch(`${MERSAN_API}/${sku}/${LOJA_PARA_CONSULTA}`);
    if (resp.status === 429) {
      await dormir(2000 * (i + 1));
      continue;
    }
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const item = (data.precos || []).find(p => p.cdSKU && p.cdSKU !== 0 && p.cdProduto);
    return item || null;
  }
  throw new Error("HTTP 429 mesmo apos varias tentativas");
}

async function upsertLote(linhas) {
  if (linhas.length === 0) return;
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/referencias_index?on_conflict=codigo_barras`, {
    method: "POST",
    headers: { ...headersSupabase(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(linhas),
  });
  if (!resp.ok) {
    const texto = await resp.text().catch(() => "");
    throw new Error(`Supabase upsert falhou: HTTP ${resp.status} ${texto.slice(0, 300)}`);
  }
}

async function main() {
  const menorSkuAnterior = await lerEstadoReverso();
  if (menorSkuAnterior <= META_FINAL) {
    console.log(`Meta ja atingida (ponteiro=${menorSkuAnterior}, meta=${META_FINAL}). Nada a fazer.`);
    return;
  }
  const inicio = menorSkuAnterior - 1;
  const fim = Math.max(META_FINAL, inicio - TAMANHO_JANELA + 1);
  console.log(`Testando SKUs de ${inicio} ate ${fim} (janela de ${TAMANHO_JANELA}, andando pra tras)`);

  let processados = 0;
  let encontrados = 0;
  let erros = 0;
  let bufferUpsert = [];
  const TAMANHO_LOTE_UPSERT = 200;

  async function flushBuffer() {
    if (bufferUpsert.length === 0) return;
    const lote = bufferUpsert;
    bufferUpsert = [];
    try {
      await upsertLote(lote);
    } catch (e) {
      console.error("Erro no upsert em lote:", e.message);
      erros += lote.length;
    }
  }

  let atual = inicio;
  async function worker() {
    while (atual >= fim) {
      const sku = atual--;
      try {
        const item = await buscarProduto(sku);
        if (item) {
          encontrados++;
          console.log(`Produto antigo encontrado: SKU ${sku} - ${item.dsProduto}`);
          bufferUpsert.push({
            codigo_barras: item.cdProduto,
            cd_referencia: item.cdReferencia,
            produto: item.dsProduto,
            atualizado_em: new Date().toISOString(),
          });
          if (bufferUpsert.length >= TAMANHO_LOTE_UPSERT) await flushBuffer();
        }
      } catch (e) {
        erros++;
      }
      processados++;
      if (processados % 500 === 0) {
        console.log(`Progresso: ${processados}/${TAMANHO_JANELA} | encontrados=${encontrados} erros=${erros}`);
      }
      // Salva o ponteiro periodicamente: se o job for interrompido (ex: timeout
      // do GitHub Actions), a proxima execucao retoma daqui em vez de repetir
      // a janela inteira do zero.
      if (processados % 200 === 0) {
        await flushBuffer();
        try {
          await salvarEstadoReverso(atual + 1);
        } catch (e) {
          console.error("Falha ao salvar checkpoint (tenta de novo no proximo):", e.message);
        }
      }
      await dormir(PAUSA_ENTRE_REQUISICOES_MS);
    }
  }

  const workers = Array.from({ length: CONCORRENCIA }, () => worker());
  await Promise.all(workers);
  await flushBuffer();

  await salvarEstadoReverso(fim);

  console.log("=== FIM ===");
  console.log(`Faixa escaneada: ${inicio} ate ${fim}`);
  console.log(`Produtos antigos encontrados: ${encontrados}`);
  console.log(`Erros: ${erros}`);
  // Linha em formato fixo pro loop.sh conseguir ler quantos foram achados
  // nesta janela, pra decidir se para por "nao encontrou mais nada".
  console.log(`ENCONTRADOS_NESTA_JANELA=${encontrados}`);
}

main().catch(e => {
  console.error("Falha geral:", e);
  process.exit(1);
});
