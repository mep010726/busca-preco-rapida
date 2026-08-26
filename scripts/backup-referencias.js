// Exporta a tabela referencias_index (o indice de produtos que a
// varredura de SKUs vem alimentando ha dias) pra um arquivo CSV local.
// Hoje esse trabalho todo so existe dentro do Supabase - sem isso, um
// problema no projeto (exclusao acidental, bug de migration, etc.)
// perderia tudo sem nenhuma copia de seguranca em outro lugar.
//
// Uso: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/backup-referencias.js

const fs = require("fs");
const path = require("path");

const SUPABASE_URL = "https://izjymicfgxtqafhlceyf.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TAMANHO_PAGINA = 1000;

if (!SERVICE_ROLE_KEY) {
  console.error("Uso: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/backup-referencias.js");
  process.exit(1);
}

function headersSupabase() {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  };
}

function csvEscape(valor) {
  if (valor === null || valor === undefined) return "";
  const texto = String(valor);
  if (/[",\n]/.test(texto)) return `"${texto.replace(/"/g, '""')}"`;
  return texto;
}

async function buscarPagina(from, to) {
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/referencias_index?select=codigo_barras,cd_referencia,produto,atualizado_em&order=codigo_barras.asc`,
    { headers: { ...headersSupabase(), Range: `${from}-${to}` } }
  );
  if (!resp.ok && resp.status !== 206) throw new Error(`Supabase respondeu HTTP ${resp.status}`);
  return resp.json();
}

async function main() {
  const colunas = ["codigo_barras", "cd_referencia", "produto", "atualizado_em"];
  const linhas = [colunas.join(",")];

  let from = 0;
  let total = 0;
  while (true) {
    const to = from + TAMANHO_PAGINA - 1;
    const pagina = await buscarPagina(from, to);
    if (!pagina || pagina.length === 0) break;

    for (const linha of pagina) {
      linhas.push(colunas.map(c => csvEscape(linha[c])).join(","));
    }
    total += pagina.length;
    console.log(`Exportado: ${total} linhas...`);

    if (pagina.length < TAMANHO_PAGINA) break;
    from += TAMANHO_PAGINA;
  }

  const dataHoje = new Date().toISOString().slice(0, 10);
  const nomeArquivo = path.join(__dirname, "..", "backups", `referencias_index_${dataHoje}.csv`);
  fs.mkdirSync(path.dirname(nomeArquivo), { recursive: true });
  fs.writeFileSync(nomeArquivo, linhas.join("\n"), "utf8");

  console.log(`\n=== FIM ===`);
  console.log(`${total} produtos exportados pra: ${nomeArquivo}`);
}

main().catch(e => {
  console.error("Falha no backup:", e);
  process.exit(1);
});
