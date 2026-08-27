// Confere os avisos de estoque criados pelos usuarios (tabela
// estoque_alertas): pra cada um ainda nao encontrado, procura o nome do
// produto no indice local (referencias_index), e checa ao vivo na Mersan
// se alguma das referencias encontradas ja tem estoque na loja pedida. Se
// tiver, marca o aviso como notificado - o app mostra isso no sininho.
//
// Nao roda sozinho: use scripts/loop-checar-alertas.sh pra rodar em loop.
//
// Uso: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/checar-alertas-estoque.js

const SUPABASE_URL = "https://izjymicfgxtqafhlceyf.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MERSAN_API = "https://credito.mersan.co/api/v1/buscapreco";
const PAUSA_ENTRE_REQUISICOES_MS = 450;
const LIMITE_REFERENCIAS_POR_ALERTA = 20;

if (!SERVICE_ROLE_KEY) {
  console.error("Uso: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/checar-alertas-estoque.js");
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

async function buscarAlertasPendentes() {
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/estoque_alertas?ativo=eq.true&notificado_em=is.null&select=*`,
    { headers: headersSupabase() }
  );
  if (!resp.ok) throw new Error(`Supabase respondeu HTTP ${resp.status}`);
  return resp.json();
}

async function buscarReferenciasPorNome(termo) {
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/referencias_index?produto=ilike.*${encodeURIComponent(termo)}*&select=cd_referencia,produto&order=atualizado_em.desc&limit=200`,
    { headers: headersSupabase() }
  );
  if (!resp.ok) throw new Error(`Supabase respondeu HTTP ${resp.status}`);
  const data = await resp.json();

  const vistas = new Set();
  const unicas = [];
  for (const r of data) {
    if (vistas.has(r.cd_referencia)) continue;
    vistas.add(r.cd_referencia);
    unicas.push(r);
    if (unicas.length >= LIMITE_REFERENCIAS_POR_ALERTA) break;
  }
  return unicas;
}

async function checarEstoque(cdReferencia, loja, signal) {
  const resp = await fetch(`${MERSAN_API}/estoque/${encodeURIComponent(cdReferencia)}/${encodeURIComponent(loja)}`, { signal });
  if (!resp.ok) throw new Error(`Mersan respondeu HTTP ${resp.status}`);
  const data = await resp.json();
  const lojaNum = Number(loja);
  return (data || []).filter(r => r.cd_empresa === lojaNum).reduce((soma, r) => soma + r.qt_stock, 0);
}

async function marcarNotificado(id, produto, referencia, qtd) {
  await fetch(`${SUPABASE_URL}/rest/v1/estoque_alertas?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...headersSupabase(), Prefer: "return=minimal" },
    body: JSON.stringify({
      notificado_em: new Date().toISOString(),
      encontrado_produto: produto,
      encontrado_referencia: referencia,
      encontrado_qtd: qtd,
    }),
  });
}

async function main() {
  const alertas = await buscarAlertasPendentes();
  console.log(`${alertas.length} aviso(s) pendente(s) pra checar.`);

  for (const alerta of alertas) {
    let referencias;
    try {
      referencias = await buscarReferenciasPorNome(alerta.termo);
    } catch (e) {
      console.error(`Falha ao buscar referências pro alerta ${alerta.id} (${alerta.termo}):`, e.message);
      continue;
    }

    for (const ref of referencias) {
      try {
        const qtd = await checarEstoque(ref.cd_referencia, alerta.loja);
        if (qtd > 0) {
          console.log(`Encontrado! ${ref.produto} (ref ${ref.cd_referencia}) com ${qtd} un. na loja ${alerta.loja} — alerta ${alerta.id}`);
          await marcarNotificado(alerta.id, ref.produto, ref.cd_referencia, qtd);
          break;
        }
      } catch (e) {
        // Ignora falha pontual numa referência e segue checando as outras.
      }
      await dormir(PAUSA_ENTRE_REQUISICOES_MS);
    }
  }

  console.log("=== FIM ===");
}

main().catch(e => {
  console.error("Falha geral:", e);
  process.exit(1);
});
