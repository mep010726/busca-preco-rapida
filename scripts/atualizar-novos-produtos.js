// Varredura automatica de produtos novos: os SKUs da Mersan sao numeros
// sequenciais, entao produtos novos sempre entram com numero maior que os
// que ja conhecemos. Este script testa uma faixa de SKUs acima do maior ja
// escaneado, salva os que existirem no indice compartilhado, e avanca o
// ponteiro pro proximo run continuar dali (sem precisar de CSV nem bipar).
//
// Uso: SUPABASE_SERVICE_ROLE_KEY=xxx node atualizar-novos-produtos.js

const SUPABASE_URL = "https://izjymicfgxtqafhlceyf.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MERSAN_API = "https://credito.mersan.co/api/v1/buscapreco";
const LOJA_PARA_CONSULTA = 1;
const CONCORRENCIA = 2;
const PAUSA_ENTRE_REQUISICOES_MS = 450;
const TAMANHO_JANELA = Number(process.env.TAMANHO_JANELA || 8000);

if (!SERVICE_ROLE_KEY) {
  console.error("Uso: SUPABASE_SERVICE_ROLE_KEY=xxx node atualizar-novos-produtos.js");
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

async function lerEstado() {
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/indice_estado?chave=eq.maior_sku_escaneado&select=valor`,
    { headers: headersSupabase() }
  );
  const data = await resp.json();
  if (!data || data.length === 0) throw new Error("Estado inicial nao encontrado - rode a migration primeiro.");
  return Number(data[0].valor);
}

async function salvarEstado(novoValor) {
  await fetch(`${SUPABASE_URL}/rest/v1/indice_estado?chave=eq.maior_sku_escaneado`, {
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
  const maiorSkuAnterior = await lerEstado();
  const inicio = maiorSkuAnterior + 1;
  const fim = inicio + TAMANHO_JANELA - 1;
  console.log(`Testando SKUs de ${inicio} ate ${fim} (janela de ${TAMANHO_JANELA})`);

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
    while (atual <= fim) {
      const sku = atual++;
      try {
        const item = await buscarProduto(sku);
        if (item) {
          encontrados++;
          console.log(`Novo produto encontrado: SKU ${sku} - ${item.dsProduto}`);
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
      await dormir(PAUSA_ENTRE_REQUISICOES_MS);
    }
  }

  const workers = Array.from({ length: CONCORRENCIA }, () => worker());
  await Promise.all(workers);
  await flushBuffer();

  await salvarEstado(fim);

  console.log("=== FIM ===");
  console.log(`Faixa escaneada: ${inicio} - ${fim}`);
  console.log(`Produtos novos encontrados: ${encontrados}`);
  console.log(`Erros: ${erros}`);
}

main().catch(e => {
  console.error("Falha geral:", e);
  process.exit(1);
});
