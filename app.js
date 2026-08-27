// ====== CONFIGURE AQUI (Supabase > Settings > API) ======
const SUPABASE_URL = "https://izjymicfgxtqafhlceyf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mRNqGL9jboRCjHfnq1kG0Q_paalFq0C";
// Cloudflare Turnstile > Site Key (dashboard.cloudflare.com > Turnstile)
const TURNSTILE_SITE_KEY = "0x4AAAAAAEGYOswRL545WBG-";
// ==========================================================

// Escapa texto antes de inserir em innerHTML — essencial pra qualquer campo
// que vem de fonte não-confiável (nome de produto digitado à mão, texto de
// sugestão, referência escrita por qualquer usuário logado no índice
// compartilhado, etc.). Sem isso, alguém poderia salvar um "produto" com
// HTML/script no nome e ele rodaria na tela de quem visse a lista depois
// (inclusive o admin, que vê os dados de todo mundo).
function escapeHtml(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Cadastro de lojas da rede: nome, endereço e cidade de cada uma, pra
// mostrar onde fica quando o estoque de uma loja aparece na tela.
const LOJAS_INFO = {
  1:   { nome: "Mersan",          endereco: "R Sales Barbosa, 130 – Centro",              cidade: "Feira de Santana - BA" },
  3:   { nome: "Mersan",          endereco: "R Sales Barbosa, 186 – Centro",              cidade: "Feira de Santana - BA" },
  4:   { nome: "Mersan",          endereco: "Av. Sr. dos Passos, 1236 – Centro",          cidade: "Feira de Santana - BA" },
  11:  { nome: "Mersan",          endereco: "Rua Marechal Deodoro, 47",                   cidade: "Feira de Santana - BA" },
  12:  { nome: "Mersan",          endereco: "Av. Sr. dos Passos, 1073",                   cidade: "Feira de Santana - BA" },
  22:  { nome: "Mersan",          endereco: "Av Senhor dos Passos, 1164",                 cidade: "Feira de Santana - BA" },
  31:  { nome: "Mersan",          endereco: "Av João Durval Carneiro, 3665",              cidade: "Feira de Santana - BA" },
  32:  { nome: "Mersan",          endereco: "Av João Durval Carneiro, 3665",              cidade: "Feira de Santana - BA" },
  41:  { nome: "Arezzo",          endereco: "Av João Durval Carneiro, 3665",              cidade: "Feira de Santana - BA" },
  51:  { nome: "Levi's",          endereco: "Av João Durval Carneiro, 3665",              cidade: "Feira de Santana - BA" },
  91:  { nome: "Levi's",          endereco: "Av Tancredo Neves, 148",                     cidade: "Salvador - BA" },
  105: { nome: "Credmais",        endereco: "Av Governador João Durval Ca.",              cidade: "Feira de Santana - BA" },
  111: { nome: "Mersan",          endereco: "Pça. da Bandeira, 27",                       cidade: "Alagoinhas - BA" },
  121: { nome: "Mersan",          endereco: "Pç João Pedreira, 66 – Centro",              cidade: "Feira de Santana - BA" },
  141: { nome: "Mersan",          endereco: "Av. Antonio Nogueira, 63",                   cidade: "Serrinha - BA" },
  142: { nome: "Mersan",          endereco: "Pça Luis Nogueira, 547",                     cidade: "Serrinha - BA" },
  151: { nome: "Mersan",          endereco: "R Juracy Magalhães, 487 – Ponto Central",    cidade: "Feira de Santana - BA" },
  161: { nome: "Mersan",          endereco: "R Sales Barbosa, 90 – Centro",               cidade: "Feira de Santana - BA" },
  171: { nome: "Mersan Sport",    endereco: "Av João Durval Carneiro, 3665",              cidade: "Feira de Santana - BA" },
  181: { nome: "Mersan",          endereco: "Pça da Bandeira, 17",                        cidade: "Alagoinhas - BA" },
  191: { nome: "Schutz",          endereco: "Av João Durval Carneiro, 3665",              cidade: "Feira de Santana - BA" },
  211: { nome: "Mersan",          endereco: "Rua Floriano Peixoto, 88",                   cidade: "Conceição do Coité - BA" },
  221: { nome: "Mersan",          endereco: "R Francisco Batista, 94",                    cidade: "Alagoinhas - BA" },
  231: { nome: "Levi's",          endereco: "Av Tancredo Neves, 2915",                    cidade: "Salvador - BA" },
  241: { nome: "Mersan Criança",  endereco: "Av João Durval Carneiro, 3665",              cidade: "Feira de Santana - BA" },
  251: { nome: "Mersan",          endereco: "Avenida Aziz Maron, S/N",                    cidade: "Itabuna - BA" },
  261: { nome: "Mersan",          endereco: "Rua Ramiro Pimentel, 65",                    cidade: "Itaberaba - BA" },
  271: { nome: "M Martan",        endereco: "Av João Durval Carneiro, 3665",              cidade: "Feira de Santana - BA" },
  281: { nome: "Arezzo",          endereco: "Pç Rui Barbosa, 152",                        cidade: "Alagoinhas - BA" },
  291: { nome: "Usaflex",         endereco: "Av João Durval Carneiro, 3665",              cidade: "Feira de Santana - BA" },
  311: { nome: "Mersan",          endereco: "R Sales Barbosa, 138",                       cidade: "Feira de Santana - BA" },
  312: { nome: "Mersan",          endereco: "R Marechal Deodoro, 41",                     cidade: "Feira de Santana - BA" },
  321: { nome: "Mersan",          endereco: "Av Tancredo Neves, 2915",                    cidade: "Salvador - BA" },
  361: { nome: "Arezzo",          endereco: "R. Roberto Santos, 96",                      cidade: "Santo Antônio de Jesus - BA" },
};

function infoLoja(loja) {
  const info = LOJAS_INFO[Number(loja)];
  return info ? `${info.nome} · ${info.endereco}, ${info.cidade}` : "";
}

// Todas as lojas da rede (usadas pela opção "ver em toda rede")
const TODAS_AS_LOJAS = Object.keys(LOJAS_INFO).map(Number);

const API_BASE = "https://credito.mersan.co/api/v1/buscapreco";

// Ícones em SVG (flat, sem emoji) usados nos botões de ação das listas
const ICONE_ESTRELA_CHEIA = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const ICONE_ESTRELA_VAZIA = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const ICONE_PIN = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 6.5-9 12-9 12s-9-5.5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const ICONE_LIXEIRA = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;
const ICONE_CHECK = `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICONE_X = `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICONE_LAPIS = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>`;
const ICONE_COMPROVANTE = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2H7a2 2 0 0 0-2 2v16l3-2 2 2 2-2 2 2 2-2 3 2V4a2 2 0 0 0-2-2z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  localStorage.setItem("tema", tema);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", tema === "light" ? "#f1f5f9" : "#0f172a");
}

const $telaCarregando = document.getElementById("telaCarregando");
const $authCard = document.getElementById("authCard");
const $authEmail = document.getElementById("authEmail");
const $authSenha = document.getElementById("authSenha");
const $authMsg = document.getElementById("authMsg");
const $btnEntrar = document.getElementById("btnEntrar");
const $linkEsqueciSenha = document.getElementById("linkEsqueciSenha");
const $linkIrCadastro = document.getElementById("linkIrCadastro");
const $cadastroCard = document.getElementById("cadastroCard");
const $cadastroEmail = document.getElementById("cadastroEmail");
const $cadastroSenha = document.getElementById("cadastroSenha");
const $cadastroEmpresaWeb = document.getElementById("cadastroEmpresaWeb");
const $cadastroMsg = document.getElementById("cadastroMsg");
const $btnCriarConta = document.getElementById("btnCriarConta");
const $linkIrLogin = document.getElementById("linkIrLogin");

const $recuperarCard = document.getElementById("recuperarCard");
const $recuperarEmail = document.getElementById("recuperarEmail");
const $recuperarMsg = document.getElementById("recuperarMsg");
const $btnEnviarRecuperacao = document.getElementById("btnEnviarRecuperacao");
const $btnCancelarRecuperacao = document.getElementById("btnCancelarRecuperacao");

const $novaSenhaCard = document.getElementById("novaSenhaCard");
const $novaSenha1 = document.getElementById("novaSenha1");
const $novaSenha2 = document.getElementById("novaSenha2");
const $novaSenhaMsg = document.getElementById("novaSenhaMsg");
const $btnSalvarNovaSenha = document.getElementById("btnSalvarNovaSenha");

const $app = document.getElementById("app");
const $userEmail = document.getElementById("userEmail");
const $btnSair = document.getElementById("btnSair");

const $btnAlertasEstoque = document.getElementById("btnAlertasEstoque");
const $alertasBadge = document.getElementById("alertasBadge");
const $alertasEstoqueModal = document.getElementById("alertasEstoqueModal");
const $alertaTermo = document.getElementById("alertaTermo");
const $alertaLoja = document.getElementById("alertaLoja");
const $alertaMsg = document.getElementById("alertaMsg");
const $btnCriarAlerta = document.getElementById("btnCriarAlerta");
const $alertasLista = document.getElementById("alertasLista");
const $btnFecharAlertasEstoque = document.getElementById("btnFecharAlertasEstoque");
const $btnConfig = document.getElementById("btnConfig");
const $configModal = document.getElementById("configModal");
const $btnFecharConfig = document.getElementById("btnFecharConfig");
const $cfgNome = document.getElementById("cfgNome");
const $cfgCodigo = document.getElementById("cfgCodigo");
const $cfgLoja = document.getElementById("cfgLoja");
const $cfgMsg = document.getElementById("cfgMsg");
const $btnSalvarConfig = document.getElementById("btnSalvarConfig");
const $cfgSenha1 = document.getElementById("cfgSenha1");
const $cfgSenha2 = document.getElementById("cfgSenha2");
const $cfgSenhaMsg = document.getElementById("cfgSenhaMsg");
const $btnSalvarSenhaConfig = document.getElementById("btnSalvarSenhaConfig");
const $cfgBipador = document.getElementById("cfgBipador");
const $cfgTemaClaro = document.getElementById("cfgTemaClaro");

const $tabBusca = document.getElementById("tabBusca");
const $tabHistorico = document.getElementById("tabHistorico");
const $tabFavoritos = document.getElementById("tabFavoritos");
const $tabMaisProcurados = document.getElementById("tabMaisProcurados");
const $tabVendas = document.getElementById("tabVendas");
const $tabAdmin = document.getElementById("tabAdmin");
const $ajudaBadge = document.getElementById("ajudaBadge");
const $tabAjuda = document.getElementById("tabAjuda");
const $painelBusca = document.getElementById("painelBusca");
const $painelHistorico = document.getElementById("painelHistorico");
const $painelFavoritos = document.getElementById("painelFavoritos");
const $painelMaisProcurados = document.getElementById("painelMaisProcurados");
const $painelVendas = document.getElementById("painelVendas");
const $tabPromocao = document.getElementById("tabPromocao");
const $painelPromocao = document.getElementById("painelPromocao");
const $promoLoja = document.getElementById("promoLoja");
const $promoCodigoInput = document.getElementById("promoCodigoInput");
const $btnPromoCamera = document.getElementById("btnPromoCamera");
const $btnPromoBuscar = document.getElementById("btnPromoBuscar");
const $promoMsg = document.getElementById("promoMsg");
const $promoInfo = document.getElementById("promoInfo");
const $promoProdutoNome = document.getElementById("promoProdutoNome");
const $promoPrecoOriginal = document.getElementById("promoPrecoOriginal");
const $promoPrecoFinal = document.getElementById("promoPrecoFinal");
const $promoGradeTitulo = document.getElementById("promoGradeTitulo");
const $promoGradeLista = document.getElementById("promoGradeLista");
const $promoMostrarGrade = document.getElementById("promoMostrarGrade");
const $promoMostrarParcelamento = document.getElementById("promoMostrarParcelamento");
const $promoMostrarLogoMersan = document.getElementById("promoMostrarLogoMersan");
const $promoMostrarSeloMep = document.getElementById("promoMostrarSeloMep");
const $promoEfeitoRetrato = document.getElementById("promoEfeitoRetrato");
const $promoRetratoIntensidadeWrap = document.getElementById("promoRetratoIntensidadeWrap");
const $promoRetratoIntensidade = document.getElementById("promoRetratoIntensidade");
$promoEfeitoRetrato.addEventListener("change", () => {
  $promoRetratoIntensidadeWrap.classList.toggle("hidden", !$promoEfeitoRetrato.checked);
});
const $promoFotoInput = document.getElementById("promoFotoInput");
const $btnPromoTirarFoto = document.getElementById("btnPromoTirarFoto");
const $promoUploadInput = document.getElementById("promoUploadInput");
const $btnPromoEnviarFoto = document.getElementById("btnPromoEnviarFoto");
const $promoEditorWrap = document.getElementById("promoEditorWrap");
const $promoEditorStage = document.getElementById("promoEditorStage");
const $promoEditorImg = document.getElementById("promoEditorImg");
const $promoChipPrecoConteudo = document.getElementById("promoChipPrecoConteudo");
const $promoChipLojaConteudo = document.getElementById("promoChipLojaConteudo");
const $promoElementoSelecionado = document.getElementById("promoElementoSelecionado");
const $btnPromoMenor = document.getElementById("btnPromoMenor");
const $btnPromoMaior = document.getElementById("btnPromoMaior");
const $btnPromoRemoverElemento = document.getElementById("btnPromoRemoverElemento");
const $btnPromoSalvarPadrao = document.getElementById("btnPromoSalvarPadrao");
const $promoSalvarPadraoMsg = document.getElementById("promoSalvarPadraoMsg");
const $btnPromoConfirmarLayout = document.getElementById("btnPromoConfirmarLayout");
const $btnPromoCancelarEdicao = document.getElementById("btnPromoCancelarEdicao");
const $promoResultadoWrap = document.getElementById("promoResultadoWrap");
const $promoCanvas = document.getElementById("promoCanvas");
const $btnPromoEditarPosicao = document.getElementById("btnPromoEditarPosicao");
const $btnPromoBaixar = document.getElementById("btnPromoBaixar");
const $btnPromoCompartilhar = document.getElementById("btnPromoCompartilhar");
const $btnPromoNovaFoto = document.getElementById("btnPromoNovaFoto");
const $painelComissao = document.getElementById("painelComissao");
const $painelAdmin = document.getElementById("painelAdmin");
const $tabComissao = document.getElementById("tabComissao");
const $comissaoResumo = document.getElementById("comissaoResumo");
const $comissaoConfigCard = document.getElementById("comissaoConfigCard");
const $comissaoSimulacao = document.getElementById("comissaoSimulacao");
const $pctPrimeiro = document.getElementById("pctPrimeiro");
const $pctSegundo = document.getElementById("pctSegundo");
const $pctTerceiro = document.getElementById("pctTerceiro");
const $pctMetaBatida = document.getElementById("pctMetaBatida");
const $pctMetaNaoBatida = document.getElementById("pctMetaNaoBatida");
const $btnSalvarComissaoConfig = document.getElementById("btnSalvarComissaoConfig");
const $comissaoConfigMsg = document.getElementById("comissaoConfigMsg");
const $painelAjuda = document.getElementById("painelAjuda");
const $resumoVendedoresLista = document.getElementById("resumoVendedoresLista");
const $usuariosAtivosLista = document.getElementById("usuariosAtivosLista");
const $btnModoVenda = document.getElementById("btnModoVenda");
const $btnModoTroca = document.getElementById("btnModoTroca");
const $tituloNovaVenda = document.getElementById("tituloNovaVenda");
const $ladoTrocaWrap = document.getElementById("ladoTrocaWrap");
const $btnLadoDevolvido = document.getElementById("btnLadoDevolvido");
const $btnLadoNovo = document.getElementById("btnLadoNovo");
const $trocaListasWrap = document.getElementById("trocaListasWrap");
const $trocaDevolvidosLista = document.getElementById("trocaDevolvidosLista");
const $trocaNovosLista = document.getElementById("trocaNovosLista");
const $descontoWrap = document.getElementById("descontoWrap");
const $rotuloSubtotal = document.getElementById("rotuloSubtotal");
const $rotuloTotal = document.getElementById("rotuloTotal");
const $vendaLoja = document.getElementById("vendaLoja");
const $vendaProdutoInput = document.getElementById("vendaProdutoInput");
const $btnVendaCamera = document.getElementById("btnVendaCamera");
const $btnVendaHistorico = document.getElementById("btnVendaHistorico");
const $btnVendaManualToggle = document.getElementById("btnVendaManualToggle");
const $vendaManualForm = document.getElementById("vendaManualForm");
const $vendaManualNome = document.getElementById("vendaManualNome");
const $vendaManualPreco = document.getElementById("vendaManualPreco");
aplicarMascaraMoeda($vendaManualPreco);
const $btnVendaManualAdicionar = document.getElementById("btnVendaManualAdicionar");
const $vendaMsgAdd = document.getElementById("vendaMsgAdd");
const $vendaItensLista = document.getElementById("vendaItensLista");
const $btnDescontoPct = document.getElementById("btnDescontoPct");
const $btnDescontoValor = document.getElementById("btnDescontoValor");
const $descontoPctWrap = document.getElementById("descontoPctWrap");
const $descontoValorWrap = document.getElementById("descontoValorWrap");
const $vendaDescontoPct = document.getElementById("vendaDescontoPct");
const $vendaValorFinal = document.getElementById("vendaValorFinal");
aplicarMascaraMoeda($vendaValorFinal);
const $vendaSubtotal = document.getElementById("vendaSubtotal");
const $vendaDescontoInfo = document.getElementById("vendaDescontoInfo");
const $vendaTotal = document.getElementById("vendaTotal");
const $vendaObservacao = document.getElementById("vendaObservacao");
const $btnFinalizarVenda = document.getElementById("btnFinalizarVenda");
const $vendaMsg = document.getElementById("vendaMsg");
const $vendasLista = document.getElementById("vendasLista");
const $vendasDataFiltro = document.getElementById("vendasDataFiltro");
const $btnExportarVendasCsv = document.getElementById("btnExportarVendasCsv");
const $vendaHistoricoModal = document.getElementById("vendaHistoricoModal");
const $vendaHistoricoLista = document.getElementById("vendaHistoricoLista");
const $btnFecharVendaHistorico = document.getElementById("btnFecharVendaHistorico");
const $editarVendaModal = document.getElementById("editarVendaModal");
const $editarVendaProdutoInput = document.getElementById("editarVendaProdutoInput");
const $btnEditarVendaAdicionar = document.getElementById("btnEditarVendaAdicionar");
const $btnEditarVendaManualToggle = document.getElementById("btnEditarVendaManualToggle");
const $editarVendaManualForm = document.getElementById("editarVendaManualForm");
const $editarVendaManualNome = document.getElementById("editarVendaManualNome");
const $editarVendaManualPreco = document.getElementById("editarVendaManualPreco");
aplicarMascaraMoeda($editarVendaManualPreco);
const $btnEditarVendaManualAdicionar = document.getElementById("btnEditarVendaManualAdicionar");
const $editarVendaMsg = document.getElementById("editarVendaMsg");
const $editarVendaItensLista = document.getElementById("editarVendaItensLista");
const $btnFecharEditarVenda = document.getElementById("btnFecharEditarVenda");
const $mensagemMotivacional = document.getElementById("mensagemMotivacional");
const $metaBarra = document.getElementById("metaBarra");
const $metaResumo = document.getElementById("metaResumo");
const $btnConfigMetas = document.getElementById("btnConfigMetas");
const $totalDiaTitulo = document.getElementById("totalDiaTitulo");
const $totalHoje = document.getElementById("totalHoje");
const $vendasHojeCount = document.getElementById("vendasHojeCount");
const $totalMes = document.getElementById("totalMes");
const $vendasMesCount = document.getElementById("vendasMesCount");
const $metasModal = document.getElementById("metasModal");
const $metaQuinzena1 = document.getElementById("metaQuinzena1");
aplicarMascaraMoeda($metaQuinzena1);
const $metaQuinzena2 = document.getElementById("metaQuinzena2");
aplicarMascaraMoeda($metaQuinzena2);
const $btnSalvarMetas = document.getElementById("btnSalvarMetas");
const $metasMsg = document.getElementById("metasMsg");
const $folgasMesNome = document.getElementById("folgasMesNome");
const $folgasCalendario = document.getElementById("folgasCalendario");
const $btnFecharMetas = document.getElementById("btnFecharMetas");
const $historicoLista = document.getElementById("historicoLista");
const $favoritosLista = document.getElementById("favoritosLista");
const $mpPendentesCard = document.getElementById("mpPendentesCard");
const $mpPendentesLista = document.getElementById("mpPendentesLista");
const $mpAprovadosLista = document.getElementById("mpAprovadosLista");
const $sugestaoTexto = document.getElementById("sugestaoTexto");
const $sugestaoMsg = document.getElementById("sugestaoMsg");
const $btnEnviarSugestao = document.getElementById("btnEnviarSugestao");
const $statsAdminLista = document.getElementById("statsAdminLista");
const $tentativasBotLista = document.getElementById("tentativasBotLista");
const $migrationsLista = document.getElementById("migrationsLista");
const $sugestoesLista = document.getElementById("sugestoesLista");
const $layoutCorDestaque = document.getElementById("layoutCorDestaque");
const $layoutCorDestaqueHex = document.getElementById("layoutCorDestaqueHex");
const $layoutContrasteAviso = document.getElementById("layoutContrasteAviso");
const $layoutCorFundo = document.getElementById("layoutCorFundo");
const $layoutCorFundoHex = document.getElementById("layoutCorFundoHex");
const $layoutFormatoBotao = document.getElementById("layoutFormatoBotao");
const $layoutTamanhoFonte = document.getElementById("layoutTamanhoFonte");
const $layoutMsg = document.getElementById("layoutMsg");
const $btnSalvarLayout = document.getElementById("btnSalvarLayout");
const $btnRestaurarLayout = document.getElementById("btnRestaurarLayout");

const $codigo = document.getElementById("codigo");
const $lojas = document.getElementById("lojas");
const $btnRedeToda = document.getElementById("btnRedeToda");
const $buscar = document.getElementById("buscar");
const $btnLimparBusca = document.getElementById("btnLimparBusca");
const $status = document.getElementById("status");
const $resumoCard = document.getElementById("resumoCard");
const $resumoProduto = document.getElementById("resumoProduto");
const $resumoPreco = document.getElementById("resumoPreco");
const $resumoPrecoOriginal = document.getElementById("resumoPrecoOriginal");
const $resultados = document.getElementById("resultados");
const $modoMultiplo = document.getElementById("modoMultiplo");
const $buscasMultiplas = document.getElementById("buscasMultiplas");
const $referenciaBusca = document.getElementById("referenciaBusca");
const $btnBuscarReferencia = document.getElementById("btnBuscarReferencia");
const $referenciaMsg = document.getElementById("referenciaMsg");
const $referenciaResultados = document.getElementById("referenciaResultados");
const $btnLimparReferencia = document.getElementById("btnLimparReferencia");

const $btnCamera = document.getElementById("btnCamera");
const $camModal = document.getElementById("camModal");
const $btnFecharCam = document.getElementById("btnFecharCam");
const $btnTorch = document.getElementById("btnTorch");
const $camDebug = document.getElementById("camDebug");
const $nativeVideoWrap = document.getElementById("nativeVideoWrap");
const $nativeVideo = document.getElementById("nativeVideo");

let currentUser = null;
let html5Qrcode = null;

// ---------- AUTENTICAÇÃO ----------

function setAuthMsg(txt, isErr) {
  $authMsg.textContent = txt || "";
  $authMsg.className = "msg " + (isErr ? "err" : "");
}

function setCadastroMsg(txt, isErr) {
  $cadastroMsg.textContent = txt || "";
  $cadastroMsg.className = "msg " + (isErr ? "err" : "");
}

// ---------- Turnstile (verificação anti-robô) ----------
// Login e cadastro agora são telas separadas, cada uma com seu próprio
// widget — essa fábrica evita duplicar a lógica de render/reset/token.
function criarControleTurnstile(containerId) {
  let token = null;
  let widgetId = null;

  function render() {
    if (widgetId !== null) return;
    if (typeof turnstile === "undefined") {
      setTimeout(render, 200); // script do Turnstile ainda carregando
      return;
    }
    widgetId = turnstile.render(`#${containerId}`, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (t) => { token = t; },
      "expired-callback": () => { token = null; },
    });
  }

  function reset() {
    token = null;
    if (typeof turnstile !== "undefined" && widgetId !== null) {
      turnstile.reset(widgetId);
    }
  }

  // Lê o token direto do widget na hora do clique, em vez de confiar só no
  // valor setado pelo callback (mais confiável contra corridas de timing).
  function getToken() {
    if (typeof turnstile !== "undefined" && widgetId !== null) {
      const t = turnstile.getResponse(widgetId);
      if (t) return t;
    }
    return token;
  }

  return { render, reset, getToken };
}

const turnstileLogin = criarControleTurnstile("turnstileWidget");
const turnstileCadastro = criarControleTurnstile("turnstileWidgetCadastro");

$btnEntrar.addEventListener("click", async () => {
  const token = turnstileLogin.getToken();
  if (!token) {
    setAuthMsg("Complete a verificação de segurança antes de continuar.", true);
    return;
  }
  setAuthMsg("Entrando...");
  const { error } = await sb.auth.signInWithPassword({
    email: $authEmail.value.trim(),
    password: $authSenha.value,
    options: { captchaToken: token },
  });
  turnstileLogin.reset();
  if (error) setAuthMsg(error.message, true);
});

$btnCriarConta.addEventListener("click", async () => {
  // Honeypot: campo invisível que só um bot preencheria. Se veio
  // preenchido, finge que deu certo (não avisa o bot que foi barrado) e
  // não gasta o e-mail/senha nem a cota de cadastro de verdade.
  if ($cadastroEmpresaWeb.value.trim() !== "") {
    setCadastroMsg("Conta criada! Verifique seu e-mail e clique no link de confirmação antes de entrar.");
    // Registra a tentativa pro admin acompanhar - dispara sem travar a
    // resposta falsa de "sucesso" pro bot, e sem quebrar nada se falhar.
    sb.from("tentativas_bot").insert({}).then(() => {}, () => {});
    return;
  }

  const token = turnstileCadastro.getToken();
  if (!token) {
    setCadastroMsg("Complete a verificação de segurança antes de continuar.", true);
    return;
  }
  setCadastroMsg("Criando conta...");
  const { error } = await sb.auth.signUp({
    email: $cadastroEmail.value.trim(),
    password: $cadastroSenha.value,
    options: { captchaToken: token },
  });
  turnstileCadastro.reset();
  if (error) {
    setCadastroMsg(error.message, true);
  } else {
    setCadastroMsg("Conta criada! Verifique seu e-mail e clique no link de confirmação antes de entrar.");
  }
});

$linkIrCadastro.addEventListener("click", () => {
  $authCard.classList.add("hidden");
  $cadastroCard.classList.remove("hidden");
  $cadastroEmail.value = $authEmail.value;
  setCadastroMsg("");
  turnstileCadastro.render();
});

$linkIrLogin.addEventListener("click", () => {
  $cadastroCard.classList.add("hidden");
  $authCard.classList.remove("hidden");
  $authEmail.value = $cadastroEmail.value;
  setAuthMsg("");
  turnstileLogin.render();
});

$btnSair.addEventListener("click", () => sb.auth.signOut());

// ---------- CONFIGURAÇÕES DO VENDEDOR ----------

// Preferência do APARELHO (não da conta): se marcado, o campo de código de
// barras fica sempre em foco pronto pra receber leitura de um bipador físico
// (USB/Bluetooth). Fica salva no navegador, não no login — cada tablet/PC
// guarda a própria escolha.
function bipadorAtivo() {
  return localStorage.getItem("bp_bipador") === "1";
}

function talvezFocarCodigo() {
  if (bipadorAtivo()) $codigo.focus();
}

$btnConfig.addEventListener("click", () => {
  const meta = (currentUser && currentUser.user_metadata) || {};
  $cfgNome.value = meta.nome_vendedor || "";
  $cfgCodigo.value = meta.codigo_vendedor || "";
  $cfgLoja.value = meta.loja_vendedor || "";
  $cfgMsg.textContent = "";
  $cfgSenha1.value = "";
  $cfgSenha2.value = "";
  $cfgSenhaMsg.textContent = "";
  $cfgBipador.checked = bipadorAtivo();
  $cfgTemaClaro.checked = document.documentElement.getAttribute("data-theme") === "light";
  $configModal.classList.remove("hidden");
});

$cfgBipador.addEventListener("change", () => {
  localStorage.setItem("bp_bipador", $cfgBipador.checked ? "1" : "0");
  talvezFocarCodigo();
});

$cfgTemaClaro.addEventListener("change", () => {
  aplicarTema($cfgTemaClaro.checked ? "light" : "dark");
});

$btnFecharConfig.addEventListener("click", () => $configModal.classList.add("hidden"));

$btnSalvarConfig.addEventListener("click", async () => {
  $btnSalvarConfig.disabled = true;
  $cfgMsg.textContent = "Salvando...";
  $cfgMsg.className = "msg";

  const { data, error } = await sb.auth.updateUser({
    data: {
      nome_vendedor: $cfgNome.value.trim(),
      codigo_vendedor: $cfgCodigo.value.trim(),
      loja_vendedor: $cfgLoja.value.trim(),
    },
  });

  $btnSalvarConfig.disabled = false;
  if (error) {
    $cfgMsg.textContent = error.message;
    $cfgMsg.className = "msg err";
  } else {
    currentUser = data.user;
    $cfgMsg.textContent = "Salvo!";
    $cfgMsg.className = "msg";
  }
});

$btnSalvarSenhaConfig.addEventListener("click", async () => {
  const s1 = $cfgSenha1.value;
  const s2 = $cfgSenha2.value;
  if (!s1 || s1.length < 6) {
    $cfgSenhaMsg.textContent = "A senha precisa ter pelo menos 6 caracteres.";
    $cfgSenhaMsg.className = "msg err";
    return;
  }
  if (s1 !== s2) {
    $cfgSenhaMsg.textContent = "As senhas não são iguais.";
    $cfgSenhaMsg.className = "msg err";
    return;
  }

  $btnSalvarSenhaConfig.disabled = true;
  $cfgSenhaMsg.textContent = "Salvando...";
  $cfgSenhaMsg.className = "msg";

  const { error } = await sb.auth.updateUser({ password: s1 });

  $btnSalvarSenhaConfig.disabled = false;
  if (error) {
    $cfgSenhaMsg.textContent = error.message;
    $cfgSenhaMsg.className = "msg err";
  } else {
    $cfgSenha1.value = "";
    $cfgSenha2.value = "";
    $cfgSenhaMsg.textContent = "Senha alterada!";
    $cfgSenhaMsg.className = "msg";
  }
});

// ---------- RECUPERAÇÃO DE SENHA ----------

$linkEsqueciSenha.addEventListener("click", () => {
  $authCard.classList.add("hidden");
  $recuperarCard.classList.remove("hidden");
  $recuperarEmail.value = $authEmail.value;
  $recuperarMsg.textContent = "";
});

$btnCancelarRecuperacao.addEventListener("click", () => {
  $recuperarCard.classList.add("hidden");
  $authCard.classList.remove("hidden");
});

$btnEnviarRecuperacao.addEventListener("click", async () => {
  const email = $recuperarEmail.value.trim();
  if (!email) return;

  $btnEnviarRecuperacao.disabled = true;
  $recuperarMsg.textContent = "Enviando...";
  $recuperarMsg.className = "msg";

  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });

  $btnEnviarRecuperacao.disabled = false;
  if (error) {
    $recuperarMsg.textContent = error.message;
    $recuperarMsg.className = "msg err";
  } else {
    $recuperarMsg.textContent = "Link enviado! Verifique seu e-mail e clique no link pra criar uma nova senha.";
    $recuperarMsg.className = "msg";
  }
});

$btnSalvarNovaSenha.addEventListener("click", async () => {
  const s1 = $novaSenha1.value;
  const s2 = $novaSenha2.value;
  if (!s1 || s1.length < 6) {
    $novaSenhaMsg.textContent = "A senha precisa ter pelo menos 6 caracteres.";
    $novaSenhaMsg.className = "msg err";
    return;
  }
  if (s1 !== s2) {
    $novaSenhaMsg.textContent = "As senhas não são iguais.";
    $novaSenhaMsg.className = "msg err";
    return;
  }

  $btnSalvarNovaSenha.disabled = true;
  $novaSenhaMsg.textContent = "Salvando...";
  $novaSenhaMsg.className = "msg";

  const { error } = await sb.auth.updateUser({ password: s1 });

  $btnSalvarNovaSenha.disabled = false;
  if (error) {
    $novaSenhaMsg.textContent = error.message;
    $novaSenhaMsg.className = "msg err";
    return;
  }

  $novaSenhaCard.classList.add("hidden");
  $novaSenha1.value = "";
  $novaSenha2.value = "";
  emRecuperacaoDeSenha = false;

  // A troca de senha não dispara um novo evento de login sozinha — usamos a
  // sessão que já temos (criada quando o usuário clicou no link do e-mail)
  // pra já deixar ele logado direto no app.
  const { data } = await sb.auth.getSession();
  if (data.session) mostrarAppLogado(data.session.user);
});

async function mostrarAppLogado(user) {
  currentUser = user;
  $telaCarregando.classList.add("hidden");
  $authCard.classList.add("hidden");
  $cadastroCard.classList.add("hidden");
  $recuperarCard.classList.add("hidden");
  $novaSenhaCard.classList.add("hidden");
  $app.classList.remove("hidden");
  $userEmail.textContent = currentUser.email;

  // Lojas favoritas ficam salvas no perfil do usuário (user_metadata),
  // então acompanham o funcionário em qualquer dispositivo/login.
  const lojasSalvas = currentUser.user_metadata && currentUser.user_metadata.lojas_favoritas;
  if (lojasSalvas) $lojas.value = lojasSalvas;

  const { data: souAdmin } = await sb.rpc("sou_admin");
  souAdminCache = !!souAdmin;
  $tabAdmin.classList.toggle("hidden", !ehAdmin());

  carregarHistorico();
  atualizarBadgeAdmin();
  atualizarBadgeAlertas();
  talvezFocarCodigo();
  aplicarTemaCustomSalvo();
}

function mostrarTelaLogin() {
  currentUser = null;
  souAdminCache = false;
  $telaCarregando.classList.add("hidden");
  $authCard.classList.remove("hidden");
  $cadastroCard.classList.add("hidden");
  $recuperarCard.classList.add("hidden");
  $novaSenhaCard.classList.add("hidden");
  $app.classList.add("hidden");
  turnstileLogin.render();
}

// Enquanto o usuário está no meio da troca de senha, o app ignora eventos de
// login automático (a sessão temporária de recuperação não deve abrir o app).
let emRecuperacaoDeSenha = false;

sb.auth.onAuthStateChange((event, session) => {
  // Ao clicar no link de recuperação por e-mail, o Supabase cria uma sessão
  // temporária e dispara esse evento — mostramos o formulário de nova senha
  // em vez de deixar entrar direto no app.
  if (event === "PASSWORD_RECOVERY") {
    emRecuperacaoDeSenha = true;
    $telaCarregando.classList.add("hidden");
    $authCard.classList.add("hidden");
    $cadastroCard.classList.add("hidden");
    $recuperarCard.classList.add("hidden");
    $app.classList.add("hidden");
    $novaSenhaCard.classList.remove("hidden");
    return;
  }

  if (emRecuperacaoDeSenha) return;

  if (session) {
    mostrarAppLogado(session.user);
  } else {
    mostrarTelaLogin();
  }
});

// Segurança: se por algum motivo o Supabase nunca responder (ex: rede
// bloqueada), não deixa a tela de "Carregando..." presa pra sempre.
setTimeout(() => {
  if (!$telaCarregando.classList.contains("hidden")) mostrarTelaLogin();
}, 5000);

// ---------- ABAS ----------

const ABAS = [
  { tab: $tabBusca, painel: $painelBusca },
  { tab: $tabHistorico, painel: $painelHistorico },
  { tab: $tabFavoritos, painel: $painelFavoritos },
  { tab: $tabMaisProcurados, painel: $painelMaisProcurados },
  { tab: $tabVendas, painel: $painelVendas },
  { tab: $tabPromocao, painel: $painelPromocao },
  { tab: $tabComissao, painel: $painelComissao },
  { tab: $tabAdmin, painel: $painelAdmin },
  { tab: $tabAjuda, painel: $painelAjuda },
];

function mostrarAba(tabAlvo) {
  ABAS.forEach(({ tab, painel }) => {
    const ativa = tab === tabAlvo;
    tab.classList.toggle("active", ativa);
    painel.classList.toggle("hidden", !ativa);
  });
}

$tabBusca.addEventListener("click", () => {
  mostrarAba($tabBusca);
  talvezFocarCodigo();
});
$tabHistorico.addEventListener("click", () => {
  mostrarAba($tabHistorico);
  carregarHistorico();
});
$tabFavoritos.addEventListener("click", () => {
  mostrarAba($tabFavoritos);
  carregarFavoritos();
});
$tabMaisProcurados.addEventListener("click", () => {
  mostrarAba($tabMaisProcurados);
  carregarMaisProcurados();
});
$tabVendas.addEventListener("click", () => {
  mostrarAba($tabVendas);
  popularLojasVenda();
  if (modoVenda === "troca") renderTrocaListas(); else renderItensVenda();
  carregarVendas();
  carregarMetaEFolgas();
});
$tabPromocao.addEventListener("click", () => {
  mostrarAba($tabPromocao);
  popularLojasPromo();
});
$tabComissao.addEventListener("click", () => {
  mostrarAba($tabComissao);
  carregarComissao();
});
$tabAdmin.addEventListener("click", () => {
  if (!ehAdmin()) return;
  mostrarAba($tabAdmin);
  carregarStatsAdmin();
  carregarResumoVendedores();
  carregarUsuariosAtivos();
  carregarPendentesMP();
  carregarSugestoes();
  carregarLayoutAdmin();
  carregarTentativasBot();
  carregarStatusMigrations();
});

async function carregarStatusMigrations() {
  if (!ehAdmin()) return;
  $migrationsLista.innerHTML = `<div class="msg">Carregando...</div>`;

  const { data, error } = await sb.rpc("status_migrations");
  if (error) {
    $migrationsLista.innerHTML = `<div class="msg">Ainda não rodou a migration do rastreador (migration-rastreador-migrations.sql) — rode ela primeiro pra essa lista funcionar.</div>`;
    return;
  }

  const pendentes = (data || []).filter(m => !m.aplicada);

  $migrationsLista.innerHTML = `
    ${pendentes.length > 0 ? `<div class="msg err" style="margin-bottom:8px;">${pendentes.length} migration(s) pendente(s).</div>` : `<div class="msg" style="margin-bottom:8px;">Tudo em dia!</div>`}
    <table style="width:100%;">
      <tbody>
        ${(data || []).map(m => `
          <tr>
            <td style="padding:6px 0; color:var(--muted); font-family:monospace; font-size:0.78rem;">${escapeHtml(m.nome)}</td>
            <td style="padding:6px 0; text-align:right; font-weight:700; color:${m.aplicada ? "var(--accent)" : "var(--danger)"};">${m.aplicada ? "✓ aplicada" : "✗ pendente"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
$tabAjuda.addEventListener("click", () => {
  mostrarAba($tabAjuda);
  checarMutePropio();
});

// ---------- HISTÓRICO / FAVORITOS ----------

const PAGINA_TAMANHO = 30;

function renderListaItens(container, data, { vazio, mostrarSugerir }) {
  if (!data || data.length === 0) {
    container.innerHTML = `<div class="msg">${vazio}</div>`;
    return;
  }

  container.innerHTML = data.map(h => `
    <div class="historico-item" data-id="${h.id}" data-codigo="${escapeHtml(h.codigo_barras)}" data-lojas="${escapeHtml(h.lojas || "")}" data-produto="${escapeHtml(h.produto || "")}" data-preco="${h.preco != null ? h.preco : ""}">
      <div class="h-conteudo">
        <div class="h-produto">${escapeHtml(h.produto || h.codigo_barras)}</div>
        <div class="h-meta">Lojas ${escapeHtml(h.lojas || "-")} · ${new Date(h.criado_em).toLocaleString("pt-BR")}</div>
      </div>
      <div class="h-acoes">
        <span>${h.preco != null ? fmtMoeda(h.preco) : ""}</span>
        <button class="h-btn favorito ${h.favorito ? "ativo" : ""}" title="Favoritar">${h.favorito ? ICONE_ESTRELA_CHEIA : ICONE_ESTRELA_VAZIA}</button>
        ${mostrarSugerir ? `<button class="h-btn sugerir" title="Sugerir para Mais Procurados">${ICONE_PIN}</button>` : ""}
        <button class="h-btn apagar" title="Apagar">${ICONE_LIXEIRA}</button>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".historico-item").forEach(el => {
    const id = el.dataset.id;

    el.querySelector(".h-conteudo").addEventListener("click", () => {
      $codigo.value = el.dataset.codigo;
      $lojas.value = el.dataset.lojas;
      $tabBusca.click();
      buscar();
    });

    el.querySelector(".favorito").addEventListener("click", (e) => {
      e.stopPropagation();
      alternarFavorito(id, !el.querySelector(".favorito").classList.contains("ativo"));
    });

    el.querySelector(".apagar").addEventListener("click", (e) => {
      e.stopPropagation();
      apagarHistorico(id);
    });

    const $sugerir = el.querySelector(".sugerir");
    if ($sugerir) {
      $sugerir.addEventListener("click", (e) => {
        e.stopPropagation();
        sugerirMaisProcurado({
          codigo_barras: el.dataset.codigo,
          produto: el.dataset.produto,
          preco: el.dataset.preco ? Number(el.dataset.preco) : null,
          lojas: el.dataset.lojas,
        }, $sugerir);
      });
    }
  });
}

function renderPaginacao(container, paginaAtual, totalPaginas, aoMudar) {
  const antiga = container.parentElement.querySelector(".h-paginacao");
  if (antiga) antiga.remove();
  if (totalPaginas <= 1) return;

  const div = document.createElement("div");
  div.className = "h-paginacao";
  div.style.cssText = "display:flex;align-items:center;justify-content:center;gap:14px;margin-top:12px;";
  div.innerHTML = `
    <button class="secondary h-pg-ant" ${paginaAtual === 0 ? "disabled" : ""}>‹ Anterior</button>
    <span style="white-space:nowrap;">Página ${paginaAtual + 1} de ${totalPaginas}</span>
    <button class="secondary h-pg-prox" ${paginaAtual >= totalPaginas - 1 ? "disabled" : ""}>Próxima ›</button>
  `;
  container.insertAdjacentElement("afterend", div);
  div.querySelector(".h-pg-ant").addEventListener("click", () => aoMudar(paginaAtual - 1));
  div.querySelector(".h-pg-prox").addEventListener("click", () => aoMudar(paginaAtual + 1));
}

async function carregarHistorico(pagina = 0) {
  if (!currentUser) return;
  $historicoLista.innerHTML = `<div class="msg">Carregando histórico...</div>`;
  const antiga = $historicoLista.parentElement.querySelector(".h-paginacao");
  if (antiga) antiga.remove();

  const from = pagina * PAGINA_TAMANHO;
  const to = from + PAGINA_TAMANHO - 1;

  // Filtra pelo próprio usuário explicitamente — o admin tem permissão no
  // banco pra ver o histórico de todo mundo (usado só no painel de
  // estatísticas), mas essa tela pessoal deve mostrar sempre só o dele.
  const { data, error, count } = await sb
    .from("historico")
    .select("*", { count: "exact" })
    .eq("user_id", currentUser.id)
    .order("criado_em", { ascending: false })
    .range(from, to);

  if (error) {
    $historicoLista.innerHTML = `<div class="msg err">Erro ao carregar histórico: ${error.message}</div>`;
    return;
  }

  renderListaItens($historicoLista, data, { vazio: "Nenhuma busca ainda.", mostrarSugerir: true });
  const totalPaginas = Math.max(1, Math.ceil((count || 0) / PAGINA_TAMANHO));
  renderPaginacao($historicoLista, pagina, totalPaginas, (novaPagina) => carregarHistorico(novaPagina));
}

async function carregarFavoritos(pagina = 0) {
  if (!currentUser) return;
  $favoritosLista.innerHTML = `<div class="msg">Carregando favoritos...</div>`;
  const antiga = $favoritosLista.parentElement.querySelector(".h-paginacao");
  if (antiga) antiga.remove();

  const from = pagina * PAGINA_TAMANHO;
  const to = from + PAGINA_TAMANHO - 1;

  const { data, error, count } = await sb
    .from("historico")
    .select("*", { count: "exact" })
    .eq("user_id", currentUser.id)
    .eq("favorito", true)
    .order("criado_em", { ascending: false })
    .range(from, to);

  if (error) {
    $favoritosLista.innerHTML = `<div class="msg err">Erro ao carregar favoritos: ${error.message}</div>`;
    return;
  }

  renderListaItens($favoritosLista, data, { vazio: "Nenhum favorito ainda. Toque na estrela no histórico pra favoritar." });
  const totalPaginas = Math.max(1, Math.ceil((count || 0) / PAGINA_TAMANHO));
  renderPaginacao($favoritosLista, pagina, totalPaginas, (novaPagina) => carregarFavoritos(novaPagina));
}

async function alternarFavorito(id, novoValor) {
  await sb.from("historico").update({ favorito: novoValor }).eq("id", id);
  if (!$painelHistorico.classList.contains("hidden")) carregarHistorico();
  if (!$painelFavoritos.classList.contains("hidden")) carregarFavoritos();
}

async function apagarHistorico(id) {
  await sb.from("historico").delete().eq("id", id);
  if (!$painelHistorico.classList.contains("hidden")) carregarHistorico();
  if (!$painelFavoritos.classList.contains("hidden")) carregarFavoritos();
}

async function salvarHistorico(item, lojasStr) {
  if (!currentUser) return;
  await sb.from("historico").insert({
    user_id: currentUser.id,
    email: currentUser.email,
    codigo_barras: item.cdProduto,
    produto: item.dsProduto,
    preco: item.vlPrecoPromocao > 0 ? item.vlPrecoPromocao : item.vlPreco,
    lojas: lojasStr,
  });
}

// ---------- BUSCA POR REFERÊNCIA ----------

// Toda busca por código de barras alimenta esse índice compartilhado entre
// todos os usuários — assim, com o tempo, produtos já vistos por qualquer
// pessoa ficam disponíveis pra encontrar direto pela referência.
async function salvarNoIndiceReferencias(item) {
  if (!currentUser || !item.cdReferencia) return;
  await sb.from("referencias_index").upsert({
    codigo_barras: item.cdProduto,
    cd_referencia: item.cdReferencia,
    produto: item.dsProduto,
    atualizado_em: new Date().toISOString(),
  }, { onConflict: "codigo_barras" });
}

let referenciaTermoAtual = "";

async function buscarReferencia(pagina = 0) {
  const termo = referenciaTermoAtual;
  if (!termo) return;

  $btnBuscarReferencia.disabled = true;
  $referenciaMsg.textContent = "Buscando...";
  $referenciaMsg.className = "msg";

  const from = pagina * PAGINA_TAMANHO;
  const to = from + PAGINA_TAMANHO - 1;

  const { data, error, count } = await sb
    .from("referencias_index")
    .select("*", { count: "exact" })
    .or(`cd_referencia.ilike.%${termo}%,produto.ilike.%${termo}%`)
    .order("atualizado_em", { ascending: false })
    .range(from, to);

  $btnBuscarReferencia.disabled = false;

  if (error) {
    $referenciaMsg.textContent = error.message;
    $referenciaMsg.className = "msg err";
    return;
  }

  if (!data || data.length === 0) {
    $referenciaResultados.innerHTML = "";
    renderPaginacao($referenciaResultados, 0, 1, () => {});
    $referenciaMsg.textContent = "Nenhum produto com essa referência foi escaneado ainda. Bipe o código de barras dele uma vez pra ele entrar no índice.";
    $referenciaMsg.className = "msg";
    return;
  }

  $referenciaMsg.textContent = "";
  $referenciaResultados.innerHTML = data.map(r => `
    <div class="historico-item" data-codigo="${escapeHtml(r.codigo_barras)}">
      <div class="h-conteudo">
        <div class="h-produto">${escapeHtml(r.produto || r.codigo_barras)}</div>
        <div class="h-meta">Ref: ${escapeHtml(r.cd_referencia)}</div>
      </div>
    </div>
  `).join("");

  $referenciaResultados.querySelectorAll(".historico-item").forEach(el => {
    el.addEventListener("click", () => {
      $codigo.value = el.dataset.codigo;
      $referenciaResultados.innerHTML = "";
      renderPaginacao($referenciaResultados, 0, 1, () => {});
      $referenciaBusca.value = "";
      referenciaTermoAtual = "";
      buscar();
    });
  });

  const totalPaginas = Math.max(1, Math.ceil((count || 0) / PAGINA_TAMANHO));
  renderPaginacao($referenciaResultados, pagina, totalPaginas, (novaPagina) => buscarReferencia(novaPagina));
}

$btnBuscarReferencia.addEventListener("click", () => {
  const termo = $referenciaBusca.value.trim();
  if (!termo) return;
  referenciaTermoAtual = termo;
  buscarReferencia(0);
});

$referenciaBusca.addEventListener("keydown", e => {
  if (e.key === "Enter") $btnBuscarReferencia.click();
});

// ---------- MAIS PROCURADOS ----------

// A checagem de verdade roda no banco (função sou_admin(), via RPC) — o
// cliente nunca fica sabendo qual é o e-mail do admin, só recebe um
// true/false. O resultado é cacheado aqui (atualizado no login) porque
// ehAdmin() é chamada de forma síncrona em vários lugares da tela.
let souAdminCache = false;
function ehAdmin() {
  return souAdminCache;
}

async function sugerirMaisProcurado(item, $botao) {
  if (!currentUser) return;
  $botao.disabled = true;
  const { error } = await sb.from("mais_procurados").insert({
    sugerido_por: currentUser.id,
    codigo_barras: item.codigo_barras,
    produto: item.produto,
    preco: item.preco,
    lojas: item.lojas,
  });
  if (error) {
    alert("Erro ao sugerir: " + error.message);
    $botao.disabled = false;
  } else {
    $botao.innerHTML = ICONE_CHECK;
    $botao.classList.add("ativo");
  }
}

function renderListaMaisProcurados(container, data, { vazio, comRevisao }) {
  if (!data || data.length === 0) {
    container.innerHTML = `<div class="msg">${vazio}</div>`;
    return;
  }

  container.innerHTML = data.map(h => `
    <div class="historico-item" data-id="${h.id}" data-codigo="${escapeHtml(h.codigo_barras)}" data-lojas="${escapeHtml(h.lojas || "")}">
      <div class="h-conteudo">
        <div class="h-produto">${escapeHtml(h.produto || h.codigo_barras)}</div>
        <div class="h-meta">Lojas ${escapeHtml(h.lojas || "-")} · sugerido em ${new Date(h.criado_em).toLocaleString("pt-BR")}</div>
      </div>
      <div class="h-acoes">
        <span>${h.preco != null ? fmtMoeda(h.preco) : ""}</span>
        ${comRevisao ? `
          <button class="h-btn aprovar" title="Aprovar">${ICONE_CHECK}</button>
          <button class="h-btn rejeitar" title="Rejeitar">${ICONE_X}</button>
        ` : ""}
        ${!comRevisao && ehAdmin() ? `<button class="h-btn apagar-mp" title="Apagar">${ICONE_LIXEIRA}</button>` : ""}
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".historico-item").forEach(el => {
    const id = el.dataset.id;

    if (!comRevisao) {
      el.querySelector(".h-conteudo").addEventListener("click", () => {
        $codigo.value = el.dataset.codigo;
        $lojas.value = el.dataset.lojas;
        $tabBusca.click();
        buscar();
      });
      const $apagar = el.querySelector(".apagar-mp");
      if ($apagar) {
        $apagar.addEventListener("click", (e) => {
          e.stopPropagation();
          apagarMaisProcurado(id);
        });
      }
    }

    if (comRevisao) {
      el.querySelector(".aprovar").addEventListener("click", () => revisarMaisProcurado(id, "aprovado"));
      el.querySelector(".rejeitar").addEventListener("click", () => revisarMaisProcurado(id, "rejeitado"));
    }
  });
}

async function carregarPendentesMP() {
  if (!ehAdmin()) return;
  $mpPendentesCard.classList.remove("hidden");
  $mpPendentesLista.innerHTML = `<div class="msg">Carregando pendentes...</div>`;
  const { data: pendentes, error: errPend } = await sb
    .from("mais_procurados")
    .select("*")
    .eq("status", "pendente")
    .order("criado_em", { ascending: false });
  if (errPend) {
    $mpPendentesLista.innerHTML = `<div class="msg err">Erro: ${errPend.message}</div>`;
  } else {
    renderListaMaisProcurados($mpPendentesLista, pendentes, { vazio: "Nenhuma sugestão pendente.", comRevisao: true });
  }
}

async function carregarMaisProcurados() {
  if (!currentUser) return;

  $mpAprovadosLista.innerHTML = `<div class="msg">Carregando...</div>`;
  const { data: aprovados, error } = await sb
    .from("mais_procurados")
    .select("*")
    .eq("status", "aprovado")
    .order("criado_em", { ascending: false });

  if (error) {
    $mpAprovadosLista.innerHTML = `<div class="msg err">Erro ao carregar: ${error.message}</div>`;
    return;
  }
  renderListaMaisProcurados($mpAprovadosLista, aprovados, { vazio: "Nenhum item aprovado ainda." });
}

async function revisarMaisProcurado(id, status) {
  await sb.from("mais_procurados").update({ status, revisado_em: new Date().toISOString() }).eq("id", id);
  carregarPendentesMP();
  atualizarBadgeAdmin();
}

async function apagarMaisProcurado(id) {
  await sb.from("mais_procurados").delete().eq("id", id);
  carregarMaisProcurados();
}

// ---------- ESTATÍSTICAS E NOTIFICAÇÃO DO ADMIN ----------

async function atualizarBadgeAdmin() {
  if (!ehAdmin()) {
    $ajudaBadge.classList.add("hidden");
    return;
  }

  const [{ count: pendMP }, { count: sugCount }] = await Promise.all([
    sb.from("mais_procurados").select("*", { count: "exact", head: true }).eq("status", "pendente"),
    sb.from("sugestoes").select("*", { count: "exact", head: true }),
  ]);

  const total = (pendMP || 0) + (sugCount || 0);
  if (total > 0) {
    $ajudaBadge.textContent = total > 99 ? "99+" : String(total);
    $ajudaBadge.classList.remove("hidden");
  } else {
    $ajudaBadge.classList.add("hidden");
  }
}

// ---------- AVISOS DE ESTOQUE ----------
// Um script separado (scripts/checar-alertas-estoque.js), rodando em loop,
// confere periodicamente se o produto observado apareceu com estoque na
// loja escolhida. Aqui só criamos o pedido de observação e mostramos os
// que já foram encontrados (sininho no topbar).

async function atualizarBadgeAlertas() {
  if (!currentUser) return;
  const { count } = await sb
    .from("estoque_alertas")
    .select("*", { count: "exact", head: true })
    .eq("user_id", currentUser.id)
    .not("notificado_em", "is", null)
    .eq("visto", false);

  if (count > 0) {
    $alertasBadge.textContent = count > 99 ? "99+" : String(count);
    $alertasBadge.classList.remove("hidden");
  } else {
    $alertasBadge.classList.add("hidden");
  }
}

async function carregarAlertas() {
  $alertasLista.innerHTML = `<div class="msg">Carregando...</div>`;
  const { data, error } = await sb
    .from("estoque_alertas")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("criado_em", { ascending: false });

  if (error) {
    $alertasLista.innerHTML = `<div class="msg err">Erro ao carregar: ${error.message}</div>`;
    return;
  }

  if (!data || data.length === 0) {
    $alertasLista.innerHTML = `<div class="msg">Nenhum aviso criado ainda.</div>`;
    return;
  }

  $alertasLista.innerHTML = data.map(a => {
    const status = a.notificado_em
      ? `<span style="color:var(--accent); font-weight:700;">🔔 Chegou: ${escapeHtml(a.encontrado_produto || "")} (${a.encontrado_qtd} un.)</span>`
      : `<span style="color:var(--muted);">Observando...</span>`;
    return `
    <div class="historico-item" data-id="${a.id}" style="cursor:default;">
      <div class="h-conteudo">
        <div class="h-produto">${escapeHtml(a.termo)} · loja ${escapeHtml(a.loja)}</div>
        <div class="h-meta">${status}</div>
      </div>
      <div class="h-acoes">
        <button class="h-btn apagar-alerta" title="Apagar">${ICONE_LIXEIRA}</button>
      </div>
    </div>
  `;
  }).join("");

  $alertasLista.querySelectorAll(".apagar-alerta").forEach(el => {
    el.addEventListener("click", async () => {
      const id = el.closest(".historico-item").dataset.id;
      await sb.from("estoque_alertas").delete().eq("id", id);
      carregarAlertas();
      atualizarBadgeAlertas();
    });
  });

  // Marca os que já foram notificados como "vistos" ao abrir a lista,
  // pra sumir do contador do sino.
  const idsNaoVistos = data.filter(a => a.notificado_em && !a.visto).map(a => a.id);
  if (idsNaoVistos.length > 0) {
    await sb.from("estoque_alertas").update({ visto: true }).in("id", idsNaoVistos);
    atualizarBadgeAlertas();
  }
}

$btnAlertasEstoque.addEventListener("click", () => {
  $alertasEstoqueModal.classList.remove("hidden");
  $alertaTermo.value = "";
  $alertaMsg.textContent = "";
  carregarAlertas();
});

$btnFecharAlertasEstoque.addEventListener("click", () => $alertasEstoqueModal.classList.add("hidden"));

$btnCriarAlerta.addEventListener("click", async () => {
  const termo = $alertaTermo.value.trim();
  const loja = $alertaLoja.value.trim();
  if (!termo || !loja) {
    $alertaMsg.textContent = "Preencha o nome do produto e a loja.";
    $alertaMsg.className = "msg err";
    return;
  }

  $alertaMsg.textContent = "Criando...";
  $alertaMsg.className = "msg";

  const { error } = await sb.from("estoque_alertas").insert({ user_id: currentUser.id, termo, loja });
  if (error) {
    $alertaMsg.textContent = "Erro: " + error.message;
    $alertaMsg.className = "msg err";
    return;
  }

  $alertaTermo.value = "";
  $alertaMsg.textContent = "Aviso criado! Você vai ver aqui quando o estoque aparecer.";
  $alertaMsg.className = "msg";
  carregarAlertas();
});

async function carregarStatsAdmin() {
  if (!ehAdmin()) return;
  $statsAdminLista.innerHTML = `<div class="msg">Carregando estatísticas...</div>`;

  const contar = (tabela, filtros) => {
    let q = sb.from(tabela).select("*", { count: "exact", head: true });
    if (filtros) q = filtros(q);
    return q;
  };

  const [
    totalBuscas,
    totalFavoritos,
    totalReferencias,
    mpPendentes,
    mpAprovados,
    mpRejeitados,
    totalSugestoes,
  ] = await Promise.all([
    contar("historico"),
    contar("historico", q => q.eq("favorito", true)),
    contar("referencias_index"),
    contar("mais_procurados", q => q.eq("status", "pendente")),
    contar("mais_procurados", q => q.eq("status", "aprovado")),
    contar("mais_procurados", q => q.eq("status", "rejeitado")),
    contar("sugestoes"),
  ]);

  const linhas = [
    ["Buscas registradas (todos os usuários)", totalBuscas.count],
    ["Itens favoritados", totalFavoritos.count],
    ["Produtos no catálogo de referências", totalReferencias.count],
    ["Mais Procurados pendentes", mpPendentes.count],
    ["Mais Procurados aprovados", mpAprovados.count],
    ["Mais Procurados rejeitados", mpRejeitados.count],
    ["Sugestões recebidas", totalSugestoes.count],
  ];

  $statsAdminLista.innerHTML = `
    <table style="width:100%;">
      <tbody>
        ${linhas.map(([nome, valor]) => `
          <tr>
            <td style="padding:6px 0; color:var(--muted);">${nome}</td>
            <td style="padding:6px 0; text-align:right; font-weight:700;">${valor != null ? valor : "-"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

async function carregarTentativasBot() {
  if (!ehAdmin()) return;
  $tentativasBotLista.innerHTML = `<div class="msg">Carregando...</div>`;

  const ha24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [totalGeral, total24h] = await Promise.all([
    sb.from("tentativas_bot").select("*", { count: "exact", head: true }),
    sb.from("tentativas_bot").select("*", { count: "exact", head: true }).gte("criado_em", ha24h),
  ]);

  if (totalGeral.error) {
    $tentativasBotLista.innerHTML = `<div class="msg err">Erro ao carregar: ${totalGeral.error.message}</div>`;
    return;
  }

  const linhas = [
    ["Últimas 24h", total24h.count],
    ["Total desde sempre", totalGeral.count],
  ];

  $tentativasBotLista.innerHTML = `
    <table style="width:100%;">
      <tbody>
        ${linhas.map(([nome, valor]) => `
          <tr>
            <td style="padding:6px 0; color:var(--muted);">${nome}</td>
            <td style="padding:6px 0; text-align:right; font-weight:700;">${valor != null ? valor : "-"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

async function carregarResumoVendedores() {
  if (!ehAdmin()) return;
  $resumoVendedoresLista.innerHTML = `<div class="msg">Carregando...</div>`;

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const { data, error } = await sb
    .from("vendas")
    .select("vendedor_email, total")
    .gte("criado_em", inicioMes.toISOString());

  if (error) {
    $resumoVendedoresLista.innerHTML = `<div class="msg err">Erro ao carregar: ${error.message}</div>`;
    return;
  }

  if (!data || data.length === 0) {
    $resumoVendedoresLista.innerHTML = `<div class="msg">Nenhuma venda registrada este mês ainda.</div>`;
    return;
  }

  const porVendedor = {};
  data.forEach(v => {
    const chave = v.vendedor_email || "desconhecido";
    if (!porVendedor[chave]) porVendedor[chave] = { total: 0, vendas: 0 };
    porVendedor[chave].total += Number(v.total);
    porVendedor[chave].vendas += 1;
  });

  const ranking = Object.entries(porVendedor).sort((a, b) => b[1].total - a[1].total);

  $resumoVendedoresLista.innerHTML = `
    <table style="width:100%;">
      <thead><tr><th>Vendedor</th><th style="text-align:right;">Vendas</th><th style="text-align:right;">Total</th></tr></thead>
      <tbody>
        ${ranking.map(([email, r]) => `
          <tr>
            <td style="padding:6px 0;">${escapeHtml(email)}</td>
            <td style="padding:6px 0; text-align:right;">${r.vendas}</td>
            <td style="padding:6px 0; text-align:right; font-weight:700; color:var(--accent);">${fmtMoeda(r.total)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// ---------- LAYOUT CUSTOM (TEMA CONFIGURAVEL PELO ADMIN) ----------

const RAIO_POR_FORMATO = { pilula: "999px", arredondado: "14px", quadrado: "6px" };

// Escurece um hex tipo #ff7a45 em ~15%, pra derivar a cor do botao no
// estado "pressionado" sem precisar de um segundo seletor de cor.
function escurecerHex(hex, pct = 0.15) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.round(((n >> 16) & 255) * (1 - pct)));
  const g = Math.max(0, Math.round(((n >> 8) & 255) * (1 - pct)));
  const b = Math.max(0, Math.round((n & 255) * (1 - pct)));
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

function hexValido(hex) {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

// Luminância relativa e contraste seguindo a fórmula do WCAG 2.x, pra
// conseguir escolher automaticamente texto preto ou branco em cima de
// qualquer cor de destaque que o admin escolher (e avisar se nenhuma das
// duas opções ficar legível o suficiente).
function luminanciaRelativa(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const canais = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * canais[0] + 0.7152 * canais[1] + 0.0722 * canais[2];
}

function contraste(hexA, hexB) {
  const lA = luminanciaRelativa(hexA);
  const lB = luminanciaRelativa(hexB);
  const clara = Math.max(lA, lB), escura = Math.min(lA, lB);
  return (clara + 0.05) / (escura + 0.05);
}

const PRETO_TEXTO = "#1a0f08";
const BRANCO_TEXTO = "#ffffff";

// Escolhe preto ou branco pro texto em cima da cor de fundo dada, o que
// tiver o contraste maior — não sempre acerta o mínimo do WCAG (algumas
// cores de destaque simplesmente não têm nenhuma opção boa), mas sempre
// acerta a MELHOR opção disponível entre as duas.
function melhorCorDeTexto(corFundo) {
  return contraste(corFundo, PRETO_TEXTO) >= contraste(corFundo, BRANCO_TEXTO) ? PRETO_TEXTO : BRANCO_TEXTO;
}

// Nome diferente de aplicarTema() (que já existe pra claro/escuro) de
// propósito — tinha uma função com o mesmo nome aqui antes, que sobrescrevia
// silenciosamente a de claro/escuro e quebrava o botão de tema.
function aplicarTemaCustom(config) {
  const { cor_destaque, cor_fundo, formato_botao, tamanho_fonte } = config;
  const raiz = document.documentElement.style;
  if (cor_destaque && hexValido(cor_destaque)) {
    raiz.setProperty("--accent", cor_destaque);
    raiz.setProperty("--accent-dim", escurecerHex(cor_destaque));
    raiz.setProperty("--accent-text", melhorCorDeTexto(cor_destaque));
  }
  if (cor_fundo && hexValido(cor_fundo)) raiz.setProperty("--bg", cor_fundo);
  if (formato_botao && RAIO_POR_FORMATO[formato_botao]) raiz.setProperty("--radius-btn", RAIO_POR_FORMATO[formato_botao]);
  document.documentElement.style.fontSize = tamanho_fonte === "grande" ? "112%" : "100%";

  // Guarda a última versão aplicada num cache local: o script no <head>
  // do index.html lê isso ANTES da página renderizar, pra já nascer com a
  // cor certa em vez de mostrar o padrão do CSS e só depois trocar.
  const cacheAtual = JSON.parse(localStorage.getItem("temaCustom") || "{}");
  localStorage.setItem("temaCustom", JSON.stringify({ ...cacheAtual, ...config }));
}

// Chamado no login de qualquer usuario (nao so admin), pra todo mundo ver
// o mesmo tema que o admin configurou.
async function aplicarTemaCustomSalvo() {
  const { data, error } = await sb.from("config_layout").select("*").eq("id", 1).single();
  if (error || !data) return;
  aplicarTemaCustom(data);
}

async function carregarLayoutAdmin() {
  const { data, error } = await sb.from("config_layout").select("*").eq("id", 1).single();
  if (error || !data) return;
  $layoutCorDestaque.value = data.cor_destaque;
  $layoutCorDestaqueHex.value = data.cor_destaque;
  $layoutCorFundo.value = data.cor_fundo;
  $layoutCorFundoHex.value = data.cor_fundo;
  $layoutFormatoBotao.value = data.formato_botao;
  $layoutTamanhoFonte.value = data.tamanho_fonte;
  mostrarAvisoContraste();
}

// Mostra o contraste (WCAG) que o texto vai ter em cima da cor de destaque
// escolhida, com a melhor opção de preto/branco já calculada — assim o
// admin não precisa saber o que é "contraste 3:1" pra evitar escolher uma
// cor em que ninguém consegue ler o texto dos botões.
function mostrarAvisoContraste() {
  if (!hexValido($layoutCorDestaqueHex.value)) return;
  const razao = contraste($layoutCorDestaqueHex.value, melhorCorDeTexto($layoutCorDestaqueHex.value));
  const razaoFmt = razao.toFixed(1);
  if (razao >= 4.5) {
    $layoutContrasteAviso.textContent = `Contraste do texto: ${razaoFmt}:1 — ótimo (passa até pra texto pequeno).`;
    $layoutContrasteAviso.className = "msg";
  } else if (razao >= 3) {
    $layoutContrasteAviso.textContent = `Contraste do texto: ${razaoFmt}:1 — ok pra botões/texto grande, mas apertado.`;
    $layoutContrasteAviso.className = "msg";
  } else {
    $layoutContrasteAviso.textContent = `Contraste do texto: ${razaoFmt}:1 — baixo demais, vai ficar difícil de ler pra muita gente. Tente uma cor mais escura ou mais saturada.`;
    $layoutContrasteAviso.className = "msg err";
  }
}

// Mantem o picker de cor e o campo de texto hexadecimal sincronizados, e
// ja aplica na hora (preview ao vivo) antes mesmo de salvar.
function sincronizarCorEPreview(picker, textoHex, chave) {
  picker.addEventListener("input", () => {
    textoHex.value = picker.value;
    aplicarTemaCustom({ [chave]: picker.value });
  });
  textoHex.addEventListener("input", () => {
    if (!hexValido(textoHex.value)) return;
    picker.value = textoHex.value;
    aplicarTemaCustom({ [chave]: textoHex.value });
  });
}
sincronizarCorEPreview($layoutCorDestaque, $layoutCorDestaqueHex, "cor_destaque");
sincronizarCorEPreview($layoutCorFundo, $layoutCorFundoHex, "cor_fundo");
$layoutCorDestaque.addEventListener("input", mostrarAvisoContraste);
$layoutCorDestaqueHex.addEventListener("input", mostrarAvisoContraste);

$layoutFormatoBotao.addEventListener("change", () => aplicarTemaCustom({ formato_botao: $layoutFormatoBotao.value }));
$layoutTamanhoFonte.addEventListener("change", () => aplicarTemaCustom({ tamanho_fonte: $layoutTamanhoFonte.value }));

$btnSalvarLayout.addEventListener("click", async () => {
  if (!hexValido($layoutCorDestaqueHex.value) || !hexValido($layoutCorFundoHex.value)) {
    $layoutMsg.textContent = "Cor inválida — use o formato #rrggbb.";
    $layoutMsg.className = "msg err";
    return;
  }
  $layoutMsg.textContent = "Salvando...";
  $layoutMsg.className = "msg";
  const config = {
    cor_destaque: $layoutCorDestaqueHex.value,
    cor_fundo: $layoutCorFundoHex.value,
    formato_botao: $layoutFormatoBotao.value,
    tamanho_fonte: $layoutTamanhoFonte.value,
    atualizado_em: new Date().toISOString(),
  };
  const { error } = await sb.from("config_layout").update(config).eq("id", 1);
  if (error) {
    $layoutMsg.textContent = "Erro ao salvar: " + error.message;
    $layoutMsg.className = "msg err";
  } else {
    aplicarTemaCustom(config);
    $layoutMsg.textContent = "Layout salvo! Todo mundo vai ver o novo tema no próximo login.";
    $layoutMsg.className = "msg";
  }
});

$btnRestaurarLayout.addEventListener("click", async () => {
  const padrao = { cor_destaque: "#ff7a45", cor_fundo: "#0b1120", formato_botao: "pilula", tamanho_fonte: "normal" };
  $layoutCorDestaque.value = padrao.cor_destaque;
  $layoutCorDestaqueHex.value = padrao.cor_destaque;
  $layoutCorFundo.value = padrao.cor_fundo;
  $layoutCorFundoHex.value = padrao.cor_fundo;
  $layoutFormatoBotao.value = padrao.formato_botao;
  $layoutTamanhoFonte.value = padrao.tamanho_fonte;
  aplicarTemaCustom(padrao);
  $layoutMsg.textContent = "Padrão aplicado na tela. Toque em \"Salvar layout\" pra valer pra todo mundo.";
  $layoutMsg.className = "msg";
});

async function carregarUsuariosAtivos() {
  if (!ehAdmin()) return;
  $usuariosAtivosLista.innerHTML = `<div class="msg">Carregando...</div>`;

  // Junta busca (historico), vendas e fotos de promoção, pra dar uma ideia
  // geral de quem usa o app e o quanto — não é só quem vende.
  const [resHistorico, resVendas, resFotos] = await Promise.all([
    sb.from("historico").select("email"),
    sb.from("vendas").select("vendedor_email"),
    sb.from("promo_fotos").select("email"),
  ]);

  const erro = resHistorico.error || resVendas.error || resFotos.error;
  if (erro) {
    $usuariosAtivosLista.innerHTML = `<div class="msg err">Erro ao carregar: ${erro.message}</div>`;
    return;
  }

  const porUsuario = {};
  const garantirUsuario = (email) => {
    if (!porUsuario[email]) porUsuario[email] = { buscas: 0, vendas: 0, fotos: 0 };
    return porUsuario[email];
  };

  (resHistorico.data || []).forEach(h => {
    if (h.email) garantirUsuario(h.email).buscas++;
  });
  (resVendas.data || []).forEach(v => {
    if (v.vendedor_email) garantirUsuario(v.vendedor_email).vendas++;
  });
  (resFotos.data || []).forEach(f => {
    if (f.email) garantirUsuario(f.email).fotos++;
  });

  const ranking = Object.entries(porUsuario).sort((a, b) =>
    (b[1].buscas + b[1].vendas + b[1].fotos) - (a[1].buscas + a[1].vendas + a[1].fotos)
  );

  if (ranking.length === 0) {
    $usuariosAtivosLista.innerHTML = `<div class="msg">Nenhuma atividade registrada ainda. Atividade de antes dessa atualização não aparece aqui (não tinha o e-mail salvo).</div>`;
    return;
  }

  $usuariosAtivosLista.innerHTML = `
    <table style="width:100%;">
      <thead><tr><th>Usuário</th><th style="text-align:right;">Buscas</th><th style="text-align:right;">Vendas</th><th style="text-align:right;">Fotos promo</th></tr></thead>
      <tbody>
        ${ranking.map(([email, r]) => `
          <tr>
            <td style="padding:6px 0;">${escapeHtml(email)}</td>
            <td style="padding:6px 0; text-align:right;">${r.buscas}</td>
            <td style="padding:6px 0; text-align:right; font-weight:700; color:var(--accent);">${r.vendas}</td>
            <td style="padding:6px 0; text-align:right;">${r.fotos}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// ---------- SUGESTÕES ----------

const DURACOES_MUTE = [
  { label: "1 hora", horas: 1 },
  { label: "6 horas", horas: 6 },
  { label: "1 dia", horas: 24 },
  { label: "3 dias", horas: 72 },
  { label: "1 semana", horas: 24 * 7 },
  { label: "1 mês", horas: 24 * 30 },
];

async function checarMutePropio() {
  if (!currentUser) return;

  const { data } = await sb
    .from("sugestoes_mute")
    .select("mutado_ate")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  const mutado = data && new Date(data.mutado_ate) > new Date();
  $sugestaoTexto.disabled = !!mutado;
  $btnEnviarSugestao.disabled = !!mutado;

  if (mutado) {
    $sugestaoMsg.textContent = `Você está impedido de enviar sugestões até ${new Date(data.mutado_ate).toLocaleString("pt-BR")}.`;
    $sugestaoMsg.className = "msg err";
  } else {
    $sugestaoMsg.textContent = "";
    $sugestaoMsg.className = "msg";
  }
}

$btnEnviarSugestao.addEventListener("click", async () => {
  const texto = $sugestaoTexto.value.trim();
  if (!texto || !currentUser) return;

  $btnEnviarSugestao.disabled = true;
  $sugestaoMsg.textContent = "Enviando...";
  $sugestaoMsg.className = "msg";

  const { error } = await sb.from("sugestoes").insert({
    user_id: currentUser.id,
    email: currentUser.email,
    texto,
  });

  $btnEnviarSugestao.disabled = false;
  if (error) {
    $sugestaoMsg.textContent = error.message;
    $sugestaoMsg.className = "msg err";
  } else {
    $sugestaoTexto.value = "";
    $sugestaoMsg.textContent = "Sugestão enviada, obrigado!";
    $sugestaoMsg.className = "msg";
  }
});

async function mutarUsuario(userId, horas) {
  const mutadoAte = new Date(Date.now() + horas * 60 * 60 * 1000).toISOString();
  await sb.from("sugestoes_mute").upsert({
    user_id: userId,
    mutado_ate: mutadoAte,
    mutado_por: currentUser.id,
  });
  carregarSugestoes();
}

async function desmutarUsuario(userId) {
  await sb.from("sugestoes_mute").delete().eq("user_id", userId);
  carregarSugestoes();
}

async function carregarSugestoes() {
  $sugestoesLista.innerHTML = `<div class="msg">Carregando...</div>`;

  const { data, error } = await sb
    .from("sugestoes")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    $sugestoesLista.innerHTML = `<div class="msg err">Erro ao carregar: ${error.message}</div>`;
    return;
  }
  if (!data || data.length === 0) {
    $sugestoesLista.innerHTML = `<div class="msg">Nenhuma sugestão recebida ainda.</div>`;
    return;
  }

  const userIds = [...new Set(data.map(s => s.user_id))];
  const { data: mutes } = await sb
    .from("sugestoes_mute")
    .select("user_id, mutado_ate")
    .in("user_id", userIds);
  const mutesPorUsuario = {};
  (mutes || []).forEach(m => { mutesPorUsuario[m.user_id] = m.mutado_ate; });

  const opcoesDuracao = DURACOES_MUTE.map((d, i) => `<option value="${i}">${d.label}</option>`).join("");

  $sugestoesLista.innerHTML = data.map(s => {
    const mutadoAte = mutesPorUsuario[s.user_id];
    const mutado = mutadoAte && new Date(mutadoAte) > new Date();
    return `
    <div class="historico-item" style="cursor:default; align-items:flex-start; flex-wrap:wrap;">
      <div class="h-conteudo">
        <div class="h-produto">${escapeHtml(s.email)}</div>
        <div class="h-meta">${new Date(s.criado_em).toLocaleString("pt-BR")}</div>
        <div style="margin-top:6px; font-size:0.9rem;">${escapeHtml(s.texto)}</div>
        ${mutado ? `<div class="h-meta" style="color:var(--danger); margin-top:6px;">Mutado até ${new Date(mutadoAte).toLocaleString("pt-BR")}</div>` : ""}
        <div class="row" style="margin-top:8px; margin-bottom:0;">
          ${mutado
            ? `<button class="secondary btn-desmutar" data-user="${s.user_id}" style="width:auto; padding:6px 10px; font-size:0.8rem;">Desmutar</button>`
            : `<select class="duracao-mute" style="width:auto; margin-bottom:0; padding:6px; font-size:0.8rem;">${opcoesDuracao}</select>
               <button class="secondary btn-mutar" data-user="${s.user_id}" style="width:auto; padding:6px 10px; font-size:0.8rem;">Mutar sugestões</button>`
          }
        </div>
      </div>
      <div class="h-acoes">
        <button class="h-btn apagar-sugestao" title="Apagar">${ICONE_LIXEIRA}</button>
      </div>
    </div>
  `;
  }).join("");

  $sugestoesLista.querySelectorAll(".apagar-sugestao").forEach((btn, i) => {
    btn.addEventListener("click", async () => {
      await sb.from("sugestoes").delete().eq("id", data[i].id);
      carregarSugestoes();
      atualizarBadgeAdmin();
    });
  });

  $sugestoesLista.querySelectorAll(".btn-mutar").forEach(btn => {
    btn.addEventListener("click", () => {
      const select = btn.parentElement.querySelector(".duracao-mute");
      const horas = DURACOES_MUTE[Number(select.value)].horas;
      mutarUsuario(btn.dataset.user, horas);
    });
  });

  $sugestoesLista.querySelectorAll(".btn-desmutar").forEach(btn => {
    btn.addEventListener("click", () => desmutarUsuario(btn.dataset.user));
  });
}

// ---------- CÂMERA (QR / código de barras) ----------

let torchLigada = false;

// Formatos de código de barras que o app precisa reconhecer, além de QR.
// Sem isso, alguns navegadores (principalmente iOS) ficam menos confiáveis
// pra pegar código de barras 1D (EAN/UPC/Code128), só QR.
const FORMATOS_CODIGO = (typeof Html5QrcodeSupportedFormats !== "undefined")
  ? [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.CODABAR,
      Html5QrcodeSupportedFormats.ITF,
    ]
  : undefined;

async function iniciarCamera(cameraIdOuConfig, videoConstraints) {
  html5Qrcode = new Html5Qrcode("camReader", {
    formatsToSupport: FORMATOS_CODIGO,
    verbose: false,
  });
  torchLigada = false;
  $btnTorch.classList.add("hidden");

  const configuracao = {
    fps: 15,
    // Sem aspectRatio fixo: forçar 16:9 (paisagem) numa câmera de iPhone
    // segurada em retrato (ex: vídeo 719x1280, bem mais alto que largo)
    // faz a biblioteca cortar/distorcer o quadro antes de tentar ler,
    // o que pode ser a causa de nunca conseguir ler nada nesse aparelho.
    // Deixando undefined, usa a proporção real do stream de vídeo.
    disableFlip: false,
    // Sem qrbox: escaneia o quadro inteiro em vez de exigir que o código
    // fique alinhado numa caixinha pequena — mais tolerante, principalmente
    // no iPhone onde a pré-visualização da câmera pode vir com outro corte.
    qrbox: undefined,
    videoConstraints,
  };
  const aoLer = (decodedText) => aoDetectarCodigo(decodedText);

  // Diagnóstico visível na tela: mostra quantos quadros já foram processados
  // e o último erro de leitura, pra sabermos se o problema é a câmera não
  // capturar imagem nenhuma, ou capturar mas nunca reconhecer o código.
  let tentativas = 0;
  let ultimoErro = "";
  const aoFalharFrame = (msg) => {
    tentativas++;
    ultimoErro = String(msg).slice(0, 80);
  };
  const atualizarDebug = () => {
    const video = document.querySelector("#camReader video");
    const dimensoes = video ? `${video.videoWidth}x${video.videoHeight}` : "sem vídeo";
    $camDebug.textContent = `quadros: ${tentativas} | vídeo: ${dimensoes} | último: ${ultimoErro}`;
  };
  const intervaloDebug = setInterval(atualizarDebug, 500);
  fecharCameraDebugCleanup = () => clearInterval(intervaloDebug);

  await html5Qrcode.start(cameraIdOuConfig, configuracao, aoLer, aoFalharFrame);

  // Reforça o foco contínuo direto na track de vídeo (além do que já foi
  // pedido em videoConstraints) — sem isso, em alguns iPhones a câmera foca
  // uma vez ao abrir e nunca reajusta, deixando tudo borrado de perto.
  try {
    await html5Qrcode.applyVideoConstraints({ advanced: [{ focusMode: "continuous" }] });
  } catch (e) {
    // Aparelho não suporta controlar o foco manualmente — sem problema.
  }

  // Mostra o botão de lanterna só se o dispositivo/lente atual suportar.
  try {
    const capacidades = html5Qrcode.getRunningTrackCameraCapabilities();
    const torch = capacidades.torchFeature();
    if (torch.isSupported()) $btnTorch.classList.remove("hidden");
  } catch (e) {
    // API de torch não suportada nesse navegador — mantém o botão escondido.
  }
}

let fecharCameraDebugCleanup = null;
let pararScanNativo = null;

// Caminho preferencial: usa a API nativa do navegador (BarcodeDetector) em
// vez de decodificar em JavaScript. Quando disponível, costuma ser bem mais
// rápida e confiável do que a biblioteca — é o que outros apps que
// funcionam bem no iPhone usam como primeira opção.
async function iniciarCameraNativa() {
  const formatos = await BarcodeDetector.getSupportedFormats().catch(() => [
    "qr_code", "ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "codabar", "itf",
  ]);
  const detector = new BarcodeDetector({ formats: formatos });

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false,
  });

  $nativeVideo.srcObject = stream;
  await $nativeVideo.play();
  $nativeVideoWrap.classList.remove("hidden");

  const track = stream.getVideoTracks()[0];
  if (track) {
    track.applyConstraints({ advanced: [{ focusMode: "continuous" }] }).catch(() => {});
    try {
      if (track.getCapabilities && track.getCapabilities().torch) {
        $btnTorch.classList.remove("hidden");
        $btnTorch.onclick = async () => {
          torchLigada = !torchLigada;
          await track.applyConstraints({ advanced: [{ torch: torchLigada }] }).catch(() => {});
          $btnTorch.classList.toggle("ativo", torchLigada);
        };
      }
    } catch (e) {}
  }

  let tentativasNativo = 0;
  let ultimoErroNativo = "";
  const intervaloDebugNativo = setInterval(() => {
    $camDebug.textContent = `(nativo) quadros: ${tentativasNativo} | vídeo: ${$nativeVideo.videoWidth}x${$nativeVideo.videoHeight} | último: ${ultimoErroNativo}`;
  }, 500);

  let ativo = true;
  pararScanNativo = () => {
    ativo = false;
    clearInterval(intervaloDebugNativo);
    stream.getTracks().forEach(t => t.stop());
    $nativeVideoWrap.classList.add("hidden");
    $nativeVideo.srcObject = null;
  };

  (async function loop() {
    while (ativo) {
      try {
        const codes = await detector.detect($nativeVideo);
        tentativasNativo++;
        if (codes.length > 0) {
          aoDetectarCodigo(codes[0].rawValue);
          return;
        }
      } catch (e) {
        ultimoErroNativo = String(e).slice(0, 80);
      }
      await new Promise(r => setTimeout(r, 80));
    }
  })();
}

// Pra onde vai o código lido pela câmera: "busca" (padrão, campo de código
// da aba Buscar) ou "venda" (campo de adicionar produto na aba Vendas).
let alvoScanCamera = "busca";

function aoDetectarCodigo(codigo) {
  fecharCamera();
  if (alvoScanCamera === "venda") {
    adicionarProdutoNaVenda(codigo);
  } else if (alvoScanCamera === "promo") {
    $promoCodigoInput.value = codigo;
    buscarProdutoPromo(codigo);
  } else {
    $codigo.value = codigo;
    buscar();
  }
}

async function abrirCameraModal() {
  $camModal.classList.remove("hidden");

  if ("BarcodeDetector" in window) {
    try {
      await iniciarCameraNativa();
      return;
    } catch (e) {
      console.error("Scanner nativo falhou, usando biblioteca de leitura:", e);
      // Mostra o motivo na tela por alguns segundos — sem isso, o erro só
      // ia pro console do navegador, invisível em celular sem um Mac
      // conectado pra inspecionar. Assim dá pra ver o motivo real no print.
      $camDebug.textContent = `Scanner nativo falhou: ${String(e && e.message || e).slice(0, 150)} — usando leitor alternativo...`;
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  // Monta uma lista de tentativas, da melhor pra mais simples, e usa a
  // primeira que funcionar. O ponto principal é o "focusMode: continuous":
  // sem isso, em vários iPhones a câmera foca uma vez ao abrir e nunca
  // reajusta, deixando tudo borrado quando o celular chega perto do código.
  const comFocoContinuo = (base) => ({
    ...base,
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 15 },
    advanced: [{ focusMode: "continuous" }],
  });

  const tentativas = [];

  try {
    const cameras = await Html5Qrcode.getCameras();
    if (cameras && cameras.length > 0) {
      // No iPhone, a lente principal normalmente aparece PRIMEIRO na lista
      // de câmeras traseiras — as seguintes costumam ser ultra-wide/telefoto,
      // que focam mal de perto e atrapalham a leitura do código de barras.
      const traseiras = cameras.filter(c => /back|tras|rear/i.test(c.label || ""));
      const principal = (traseiras[0] || cameras[0]).id;
      tentativas.push([{ deviceId: { exact: principal } }, comFocoContinuo({ deviceId: { exact: principal } })]);
      tentativas.push([{ deviceId: { exact: principal } }, undefined]);
    }
  } catch (e) {
    console.error("Não consegui listar câmeras, seguindo com facingMode:", e);
  }

  tentativas.push([{ facingMode: "environment" }, comFocoContinuo({ facingMode: { ideal: "environment" } })]);
  tentativas.push([{ facingMode: "environment" }, undefined]);

  let sucesso = false;
  for (const [cameraId, videoConstraints] of tentativas) {
    try {
      await iniciarCamera(cameraId, videoConstraints);
      sucesso = true;
      break;
    } catch (e) {
      console.error("Tentativa de câmera falhou:", cameraId, videoConstraints, e);
    }
  }

  if (!sucesso) {
    $camModal.classList.add("hidden");
    setStatus("Não foi possível acessar a câmera.", true);
  }
}

$btnCamera.addEventListener("click", () => {
  alvoScanCamera = "busca";
  abrirCameraModal();
});

$btnVendaCamera.addEventListener("click", () => {
  alvoScanCamera = "venda";
  abrirCameraModal();
});

$btnPromoCamera.addEventListener("click", () => {
  alvoScanCamera = "promo";
  abrirCameraModal();
});

$btnTorch.addEventListener("click", async () => {
  if (!html5Qrcode) return;
  try {
    const capacidades = html5Qrcode.getRunningTrackCameraCapabilities();
    torchLigada = !torchLigada;
    await capacidades.torchFeature().apply(torchLigada);
    $btnTorch.classList.toggle("ativo", torchLigada);
  } catch (e) {
    console.error(e);
  }
});

$btnFecharCam.addEventListener("click", fecharCamera);

function fecharCamera() {
  if (html5Qrcode) {
    html5Qrcode.stop().then(() => html5Qrcode.clear()).catch(() => {});
    html5Qrcode = null;
  }
  if (fecharCameraDebugCleanup) {
    fecharCameraDebugCleanup();
    fecharCameraDebugCleanup = null;
  }
  if (pararScanNativo) {
    pararScanNativo();
    pararScanNativo = null;
  }
  $btnTorch.onclick = null;
  torchLigada = false;
  $btnTorch.classList.remove("ativo");
  $camModal.classList.add("hidden");
}

// ---------- BUSCA DE PREÇO / ESTOQUE ----------

function fmtMoeda(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Máscara de valor "tipo calculadora": os dígitos digitados entram pela
// direita e os 2 últimos sempre são os centavos — digitar "3999" mostra
// "39,99", não "3.999,00". Usada em todo campo que representa dinheiro.
// (formatarCentavosDigitados vem do calc.js, carregado antes deste script)
function aplicarMascaraMoeda(input) {
  input.setAttribute("inputmode", "numeric");
  input.addEventListener("input", () => {
    const digitos = input.value.replace(/\D/g, "");
    input.value = digitos ? formatarCentavosDigitados(digitos) : "";
  });
}

function valorMascarado(input) {
  if (!input.value) return 0;
  return Number(input.value.replace(/\./g, "").replace(",", ".")) || 0;
}

function definirValorMascarado(input, numero) {
  const centavos = Math.round((Number(numero) || 0) * 100);
  input.value = centavos ? formatarCentavosDigitados(String(centavos)) : "";
}

function setStatus(html, isErr) {
  $status.innerHTML = html ? `<div class="msg ${isErr ? "err" : ""}">${html}</div>` : "";
}

function parseLojas(raw) {
  return [...new Set(
    raw.split(/[,\s]+/).map(s => s.trim()).filter(Boolean).map(Number)
  )].filter(n => !Number.isNaN(n));
}

function cardEstoqueLoadingInner(loja) {
  const info = infoLoja(loja);
  return `
    <div class="loja-titulo">Loja ${loja}</div>
    ${info ? `<div class="loja-endereco">${info}</div>` : ""}
    <div class="estoque-badge">
      <span>Estoque</span>
      <span class="estoque-qtd"><span class="loading-dots"><span></span><span></span><span></span></span></span>
    </div>
    <div class="tabela-wrap"></div>`;
}

function criarLojaCardEl(loja) {
  const div = document.createElement("div");
  div.className = "loja-card";
  div.innerHTML = cardEstoqueLoadingInner(loja);
  return div;
}

// Cache local (no aparelho, não no banco) do último preço visto de cada
// código, pra mostrar algo quando não tiver internet — nunca é usado se a
// busca ao vivo funcionar, só entra como último recurso offline.
function chaveCachePreco(codigo) {
  return "bp_cache_preco_" + codigo;
}

function salvarCachePreco(codigo, item) {
  try {
    localStorage.setItem(chaveCachePreco(codigo), JSON.stringify({
      cdSKU: item.cdSKU,
      dsProduto: item.dsProduto,
      vlPreco: item.vlPreco,
      vlPrecoPromocao: item.vlPrecoPromocao,
      ts: Date.now(),
    }));
  } catch (e) {
    // localStorage cheio ou indisponível: não é crítico, ignora.
  }
}

function lerCachePreco(codigo) {
  try {
    const raw = localStorage.getItem(chaveCachePreco(codigo));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// O site da Mersan às vezes fica instável (demora, erro 5xx, ou devolve uma
// página de erro HTML em vez do JSON esperado) — tenta de novo uma vez
// antes de desistir, e marca o erro final como "mersanIndisponivel" pra
// quem chama poder mostrar uma mensagem diferente de "sem internet" (o
// problema é do lado deles, não da conexão do usuário).
async function buscarPreco(codigo, primeiraLoja, signal, tentativas = 2) {
  let ultimoErro;
  for (let i = 0; i < tentativas; i++) {
    try {
      const resp = await fetch(`${API_BASE}/${encodeURIComponent(codigo)}/${encodeURIComponent(primeiraLoja)}`, { signal });
      if (!resp.ok) throw new Error(`Mersan respondeu HTTP ${resp.status}`);
      const data = await resp.json();
      return (data.precos || []).find(p => p.cdSKU && p.cdSKU !== 0) || null;
    } catch (e) {
      if (e.name === "AbortError") throw e;
      // TypeError normalmente é falta de conexão do próprio usuário — não
      // adianta tentar de novo na hora, deixa subir pro tratamento de "sem
      // internet" que já existe em quem chama.
      if (e instanceof TypeError) throw e;
      ultimoErro = e;
    }
  }
  ultimoErro.mersanIndisponivel = true;
  throw ultimoErro;
}

// O site da Mersan às vezes demora muito ou devolve uma página de erro (HTML)
// em vez do JSON de estoque, principalmente sob carga. Aqui a gente valida a
// resposta e tenta de novo uma vez antes de desistir, pra reduzir os "Erro ao
// buscar estoque" causados por instabilidade do lado deles.
async function fetchEstoqueComRetry(url, signal, tentativas = 2) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const resp = await fetch(url, { signal });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (!Array.isArray(data)) throw new Error("Resposta de estoque inesperada");
      return data;
    } catch (e) {
      if (e.name === "AbortError" || i === tentativas - 1) throw e;
    }
  }
}

async function buscarEstoqueLoja(item, loja, estoqueCache, cardEl, signal) {
  const $qtd = cardEl.querySelector(".estoque-qtd");
  const $tabela = cardEl.querySelector(".tabela-wrap");

  if (!estoqueCache.has(item.cdReferencia)) {
    estoqueCache.set(
      item.cdReferencia,
      fetchEstoqueComRetry(`${API_BASE}/estoque/${encodeURIComponent(item.cdReferencia)}/${encodeURIComponent(loja)}`, signal)
    );
  }
  const estData = await estoqueCache.get(item.cdReferencia);

  const lojaNum = Number(loja);
  const linhasLoja = estData.filter(r => r.cd_empresa === lojaNum);

  const qtdTotal = linhasLoja.reduce((soma, r) => soma + r.qt_stock, 0);
  $qtd.textContent = qtdTotal;
  $qtd.className = "estoque-qtd " + (qtdTotal > 0 ? "pos" : "zero");

  const comEstoque = linhasLoja.filter(r => r.qt_stock > 0);
  if (comEstoque.length > 0) {
    let rows = comEstoque
      .sort((a, b) => a.ds_cor.localeCompare(b.ds_cor) || a.ds_tamanho.localeCompare(b.ds_tamanho))
      .map(r => {
        const bipado = r.cd_produto === item.cdSKU;
        const classeAtual = bipado ? ' class="linha-bipada"' : "";
        const marca = bipado ? " ●" : "";
        return `<tr${classeAtual}><td>${r.ds_cor}${marca}</td><td>${r.ds_tamanho}</td><td class="pos">${r.qt_stock}</td></tr>`;
      })
      .join("");
    $tabela.innerHTML = `
      <table>
        <thead><tr><th>Cor</th><th>Tam</th><th>Qtd</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  } else {
    $tabela.innerHTML = `<div class="msg">Nenhuma outra numeração com estoque nesta loja.</div>`;
  }

  return qtdTotal;
}

async function tentarBuscarEstoque(item, loja, cache, cardEl, signal) {
  try {
    return await buscarEstoqueLoja(item, loja, cache, cardEl, signal);
  } catch (e) {
    console.error(e);
    const info = infoLoja(loja);

    if (e.name === "AbortError") {
      cardEl.innerHTML = `
        <div class="loja-titulo">Loja ${loja}</div>
        ${info ? `<div class="loja-endereco">${info}</div>` : ""}
        <div class="msg">Busca interrompida.</div>`;
      return -1;
    }

    if (!navigator.onLine || e instanceof TypeError) {
      cardEl.innerHTML = `
        <div class="loja-titulo">Loja ${loja}</div>
        ${info ? `<div class="loja-endereco">${info}</div>` : ""}
        <div class="msg err">Sem conexão — vai tentar de novo sozinho quando a internet voltar.</div>`;
      window.addEventListener("online", () => {
        cardEl.innerHTML = cardEstoqueLoadingInner(loja);
        tentarBuscarEstoque(item, loja, new Map(), cardEl);
      }, { once: true });
      return -1;
    }

    cardEl.innerHTML = `
      <div class="loja-titulo">Loja ${loja}</div>
      ${info ? `<div class="loja-endereco">${info}</div>` : ""}
      <div class="msg err">Erro ao buscar estoque (a Mersan pode estar lenta ou instável).</div>
      <button class="secondary full btn-tentar-de-novo">Tentar de novo</button>`;
    cardEl.querySelector(".btn-tentar-de-novo").addEventListener("click", () => {
      cardEl.innerHTML = cardEstoqueLoadingInner(loja);
      tentarBuscarEstoque(item, loja, new Map(), cardEl);
    });
    return -1;
  }
}

// Enquanto uma busca do botão principal está em andamento, guarda o
// controlador aqui pra dar pra cancelar clicando de novo no botão (que vira
// vermelho e escrito "Parar busca").
let controladorBuscaAtual = null;

function setBotaoBuscarParar(parar) {
  $buscar.textContent = parar ? "Parar busca" : "Buscar";
  $buscar.classList.toggle("btn-parar", parar);
}

// No modo padrão, reaproveita a área fixa de resultado (resumoCard/resultados).
// No modo "múltiplos itens", cria um bloco novo e independente pra cada busca,
// sem travar o campo/botão — assim dá pra já buscar o próximo item enquanto
// o anterior ainda está carregando.
async function executarBusca(codigo, lojasStrRaw, multiplo) {
  const lojas = parseLojas(lojasStrRaw);
  if (!codigo || lojas.length === 0) return;

  const controller = new AbortController();
  const signal = controller.signal;

  let produtoEl, precoEl, precoOriginalEl, gridEl;
  let setBuscaStatus = () => {};

  if (multiplo) {
    const bloco = document.createElement("div");
    bloco.className = "card result show busca-multipla";
    bloco.innerHTML = `
      <div class="resumo">
        <div class="resumo-produto"></div>
        <div style="text-align:right;">
          <div class="resumo-preco-original"></div>
          <div class="resumo-preco"></div>
        </div>
      </div>
      <div class="msg busca-status">Buscando preço...</div>
      <div class="lojas-grid" style="margin-top:16px;"></div>
      <button class="secondary full btn-parar-busca">Parar busca</button>`;
    $buscasMultiplas.prepend(bloco);

    produtoEl = bloco.querySelector(".resumo-produto");
    precoEl = bloco.querySelector(".resumo-preco");
    precoOriginalEl = bloco.querySelector(".resumo-preco-original");
    gridEl = bloco.querySelector(".lojas-grid");
    const statusEl = bloco.querySelector(".busca-status");
    setBuscaStatus = (texto, isErr) => {
      if (!texto) { statusEl.remove(); return; }
      statusEl.textContent = texto;
      statusEl.className = "msg busca-status" + (isErr ? " err" : "");
    };
    const $btnParar = bloco.querySelector(".btn-parar-busca");
    $btnParar.addEventListener("click", () => {
      if ($btnParar.textContent === "Remover") { bloco.remove(); return; }
      controller.abort();
    });
  } else {
    controladorBuscaAtual = controller;
    setBotaoBuscarParar(true);
    $resumoCard.classList.remove("show");
    $resultados.innerHTML = "";
    produtoEl = $resumoProduto;
    precoEl = $resumoPreco;
    precoOriginalEl = $resumoPrecoOriginal;
    gridEl = $resultados;
    setBuscaStatus = setStatus;
  }

  setBuscaStatus("Buscando preço...");

  try {
    const item = await buscarPreco(codigo, lojas[0], signal);
    if (!item) {
      setBuscaStatus("Produto não encontrado.", true);
      return;
    }

    produtoEl.textContent = `${item.cdSKU} - ${item.dsProduto}`;
    if (item.vlPrecoPromocao && item.vlPrecoPromocao > 0 && item.vlPrecoPromocao !== item.vlPreco) {
      precoOriginalEl.textContent = fmtMoeda(item.vlPreco);
      precoEl.textContent = fmtMoeda(item.vlPrecoPromocao);
    } else {
      precoOriginalEl.textContent = "";
      precoEl.textContent = fmtMoeda(item.vlPreco);
    }
    if (!multiplo) $resumoCard.classList.add("show");

    salvarHistorico(item, lojasStrRaw.trim());
    salvarNoIndiceReferencias(item);
    salvarCachePreco(codigo, item);

    setBuscaStatus("Consultando estoque...");

    const cardEls = lojas.map(loja => {
      const el = criarLojaCardEl(loja);
      gridEl.appendChild(el);
      return { loja, el };
    });

    const estoqueCache = new Map();
    const resultados = await Promise.all(
      cardEls.map(({ loja, el }) => tentarBuscarEstoque(item, loja, estoqueCache, el, signal).then(qtd => ({ el, qtd: qtd ?? -1 })))
    );

    // Reordena os cards: lojas com estoque primeiro (mais peças no topo),
    // depois as zeradas, depois as que deram erro.
    resultados
      .slice()
      .sort((a, b) => b.qtd - a.qtd)
      .forEach(({ el }) => gridEl.appendChild(el));

    setBuscaStatus("");
  } catch (e) {
    if (e.name === "AbortError") {
      setBuscaStatus("Busca interrompida.");
    } else if (!navigator.onLine || e instanceof TypeError) {
      // Sem internet: se já vimos esse código antes, mostra o último preço
      // salvo no aparelho (sem estoque, que é sempre dado ao vivo).
      const cache = lerCachePreco(codigo);
      if (cache) {
        produtoEl.textContent = `${cache.cdSKU} - ${cache.dsProduto}`;
        if (cache.vlPrecoPromocao && cache.vlPrecoPromocao > 0 && cache.vlPrecoPromocao !== cache.vlPreco) {
          precoOriginalEl.textContent = fmtMoeda(cache.vlPreco);
          precoEl.textContent = fmtMoeda(cache.vlPrecoPromocao);
        } else {
          precoOriginalEl.textContent = "";
          precoEl.textContent = fmtMoeda(cache.vlPreco);
        }
        if (!multiplo) $resumoCard.classList.add("show");
        setBuscaStatus(`Sem conexão — mostrando o último preço visto (${new Date(cache.ts).toLocaleString("pt-BR")}). Pode estar desatualizado, e o estoque não está disponível offline.`, true);
      } else {
        setBuscaStatus("Sem conexão e nenhum preço salvo desse produto ainda.", true);
      }

      // No modo múltiplos itens, tenta de novo sozinho quando a conexão
      // voltar, pra trazer o dado ao vivo (com estoque) assim que possível.
      if (multiplo) {
        window.addEventListener("online", () => {
          executarBusca(codigo, lojasStrRaw, true);
        }, { once: true });
      }
    } else if (e.mersanIndisponivel) {
      setBuscaStatus("A Mersan está instável no momento (não é um problema da sua conexão) — tente de novo em alguns instantes.", true);
      console.error(e);
    } else {
      setBuscaStatus("Erro ao buscar. Verifique a conexão.", true);
      console.error(e);
    }
  } finally {
    if (multiplo) {
      const bloco = gridEl.closest(".busca-multipla");
      const $btnParar = bloco && bloco.querySelector(".btn-parar-busca");
      if ($btnParar) $btnParar.textContent = "Remover";
    } else {
      controladorBuscaAtual = null;
      setBotaoBuscarParar(false);
    }
    talvezFocarCodigo();
  }
}

function buscar() {
  if (controladorBuscaAtual) {
    controladorBuscaAtual.abort();
    return;
  }

  const codigo = $codigo.value.trim();
  const lojasStr = $lojas.value;
  const multiplo = $modoMultiplo.checked;
  if (!codigo) return;

  if (multiplo) $codigo.value = ""; // libera o campo na hora pro próximo item

  executarBusca(codigo, lojasStr, multiplo);
}

$buscar.addEventListener("click", buscar);
$codigo.addEventListener("keydown", e => { if (e.key === "Enter") buscar(); });

// Limpa tudo da busca por código de barras, sem precisar recarregar a
// página: código digitado, resumo de preço, cards de estoque e status.
$btnLimparBusca.addEventListener("click", () => {
  if (controladorBuscaAtual) controladorBuscaAtual.abort();
  $codigo.value = "";
  $resumoCard.classList.remove("show");
  $resumoProduto.textContent = "";
  $resumoPreco.textContent = "";
  $resumoPrecoOriginal.textContent = "";
  $resultados.innerHTML = "";
  $buscasMultiplas.innerHTML = "";
  setStatus("");
  talvezFocarCodigo();
});

$btnLimparReferencia.addEventListener("click", () => {
  $referenciaBusca.value = "";
  $referenciaResultados.innerHTML = "";
  renderPaginacao($referenciaResultados, 0, 1, () => {});
  $referenciaMsg.textContent = "";
  $referenciaMsg.className = "msg";
  referenciaTermoAtual = "";
});

// ---------- VENDAS ----------

let itensVendaAtual = []; // { codigo_barras, produto, preco_unit, quantidade }
let modoVenda = "venda"; // "venda" | "troca"
let ladoTroca = "devolvido"; // "devolvido" | "novo" — pra onde vai o próximo produto adicionado, na troca
let itensDevolvidosAtual = [];
let itensNovosTrocaAtual = [];

function popularLojasVenda() {
  if ($vendaLoja.options.length > 0) return; // já populado, não refaz toda vez
  const salva = localStorage.getItem("bp_venda_loja");
  $vendaLoja.innerHTML = TODAS_AS_LOJAS
    .slice()
    .sort((a, b) => a - b)
    .map(n => {
      const info = LOJAS_INFO[n];
      const label = info ? `${n} - ${info.nome}` : String(n);
      return `<option value="${n}">${label}</option>`;
    })
    .join("");
  if (salva && TODAS_AS_LOJAS.includes(Number(salva))) {
    $vendaLoja.value = salva;
  }
}

$vendaLoja.addEventListener("change", () => {
  localStorage.setItem("bp_venda_loja", $vendaLoja.value);
});

function renderItensVenda() {
  if (itensVendaAtual.length === 0) {
    $vendaItensLista.innerHTML = `<div class="msg">Nenhum produto adicionado ainda.</div>`;
  } else {
    $vendaItensLista.innerHTML = itensVendaAtual.map((item, i) => `
      <div class="venda-item" data-i="${i}">
        <div class="vi-info">
          <div class="vi-produto">${escapeHtml(item.produto || item.codigo_barras)}</div>
          <div class="vi-preco">${fmtMoeda(item.preco_unit)} cada</div>
        </div>
        <div class="vi-qtd-stepper">
          <button type="button" class="vi-menos">−</button>
          <span>${item.quantidade}</span>
          <button type="button" class="vi-mais">+</button>
        </div>
        <div class="vi-subtotal">${fmtMoeda(item.preco_unit * item.quantidade)}</div>
        <button type="button" class="h-btn apagar vi-remover" title="Remover">${ICONE_LIXEIRA}</button>
      </div>
    `).join("");
  }

  $btnFinalizarVenda.disabled = itensVendaAtual.length === 0;
  atualizarTotaisVenda();
}

let modoDesconto = "percentual"; // "percentual" | "valor"

function calcularSubtotalVenda() {
  return itensVendaAtual.reduce((soma, item) => soma + item.preco_unit * item.quantidade, 0);
}

// Calcula subtotal/desconto/total a partir dos itens + do modo de desconto
// escolhido (por %, ou digitando direto o valor final da compra — útil
// quando a porcentagem "quebra" e não fecha um número redondo).
function atualizarTotaisVenda() {
  const subtotal = calcularSubtotalVenda();
  $vendaSubtotal.textContent = fmtMoeda(subtotal);

  // A conta em si (calcularTotaisVenda) é testada isolada em calc.test.js —
  // aqui só lê os campos da tela e mostra o resultado.
  const digitado = $vendaValorFinal.value === "" ? null : valorMascarado($vendaValorFinal);
  const { totalFinal, descontoValor, descontoPct } = calcularTotaisVenda(subtotal, modoDesconto, $vendaDescontoPct.value, digitado);

  $vendaDescontoInfo.textContent = descontoValor > 0.001
    ? `Desconto: -${fmtMoeda(descontoValor)} (${descontoPct.toFixed(1)}%)`
    : "";
  $vendaTotal.textContent = fmtMoeda(totalFinal);

  return { subtotal, totalFinal, descontoValor, descontoPct };
}

$btnDescontoPct.addEventListener("click", () => {
  modoDesconto = "percentual";
  $btnDescontoPct.classList.add("desconto-ativo");
  $btnDescontoValor.classList.remove("desconto-ativo");
  $descontoPctWrap.classList.remove("hidden");
  $descontoValorWrap.classList.add("hidden");
  atualizarTotaisVenda();
});

$btnDescontoValor.addEventListener("click", () => {
  modoDesconto = "valor";
  $btnDescontoValor.classList.add("desconto-ativo");
  $btnDescontoPct.classList.remove("desconto-ativo");
  $descontoValorWrap.classList.remove("hidden");
  $descontoPctWrap.classList.add("hidden");
  if (!$vendaValorFinal.value) definirValorMascarado($vendaValorFinal, calcularSubtotalVenda());
  atualizarTotaisVenda();
});

$vendaDescontoPct.addEventListener("input", atualizarTotaisVenda);
$vendaValorFinal.addEventListener("input", atualizarTotaisVenda);

function resetarDescontoVenda() {
  modoDesconto = "percentual";
  $btnDescontoPct.classList.add("desconto-ativo");
  $btnDescontoValor.classList.remove("desconto-ativo");
  $descontoPctWrap.classList.remove("hidden");
  $descontoValorWrap.classList.add("hidden");
  $vendaDescontoPct.value = "";
  $vendaValorFinal.value = "";
}

$vendaItensLista.addEventListener("click", (e) => {
  const el = e.target.closest(".venda-item");
  if (!el) return;
  const i = Number(el.dataset.i);

  if (e.target.closest(".vi-mais")) {
    itensVendaAtual[i].quantidade++;
    renderItensVenda();
  } else if (e.target.closest(".vi-menos")) {
    itensVendaAtual[i].quantidade--;
    if (itensVendaAtual[i].quantidade <= 0) itensVendaAtual.splice(i, 1);
    renderItensVenda();
  } else if (e.target.closest(".vi-remover")) {
    itensVendaAtual.splice(i, 1);
    renderItensVenda();
  }
});

function adicionarEmLista(lista, novoItem) {
  const existente = lista.find(it => {
    if (novoItem.codigo_barras) return it.codigo_barras === novoItem.codigo_barras;
    // Item manual (sem código): só junta se for exatamente o mesmo nome e preço.
    return !it.codigo_barras && it.produto === novoItem.produto && it.preco_unit === novoItem.preco_unit;
  });
  if (existente) {
    existente.quantidade++;
  } else {
    lista.push({ ...novoItem, quantidade: 1 });
  }
}

// Ponto único de entrada usado pelo bip, pela câmera, pelo histórico e pelo
// item manual — decide sozinho pra qual lista o produto vai, dependendo do
// modo (venda normal ou troca) e, na troca, de qual lado está ativo.
function adicionarItemNaListaDeVenda(novoItem) {
  if (modoVenda === "troca") {
    adicionarEmLista(ladoTroca === "devolvido" ? itensDevolvidosAtual : itensNovosTrocaAtual, novoItem);
    renderTrocaListas();
  } else {
    adicionarEmLista(itensVendaAtual, novoItem);
    renderItensVenda();
  }
}

function renderListaDeItens(container, lista) {
  if (lista.length === 0) {
    container.innerHTML = `<div class="msg">Nenhum produto ainda.</div>`;
    return;
  }
  container.innerHTML = lista.map((item, i) => `
    <div class="venda-item" data-i="${i}">
      <div class="vi-info">
        <div class="vi-produto">${escapeHtml(item.produto || item.codigo_barras)}</div>
        <div class="vi-preco">${fmtMoeda(item.preco_unit)} cada</div>
      </div>
      <div class="vi-qtd-stepper">
        <button type="button" class="vi-menos">−</button>
        <span>${item.quantidade}</span>
        <button type="button" class="vi-mais">+</button>
      </div>
      <div class="vi-subtotal">${fmtMoeda(item.preco_unit * item.quantidade)}</div>
      <button type="button" class="h-btn apagar vi-remover" title="Remover">${ICONE_LIXEIRA}</button>
    </div>
  `).join("");
}

function bindListaDeItens(container, lista, aoMudar) {
  container.querySelectorAll(".venda-item").forEach(el => {
    const i = Number(el.dataset.i);
    el.querySelector(".vi-mais").addEventListener("click", () => {
      lista[i].quantidade++;
      aoMudar();
    });
    el.querySelector(".vi-menos").addEventListener("click", () => {
      lista[i].quantidade--;
      if (lista[i].quantidade <= 0) lista.splice(i, 1);
      aoMudar();
    });
    el.querySelector(".vi-remover").addEventListener("click", () => {
      lista.splice(i, 1);
      aoMudar();
    });
  });
}

function somaLista(lista) {
  return lista.reduce((soma, item) => soma + item.preco_unit * item.quantidade, 0);
}

function renderTrocaListas() {
  renderListaDeItens($trocaDevolvidosLista, itensDevolvidosAtual);
  bindListaDeItens($trocaDevolvidosLista, itensDevolvidosAtual, renderTrocaListas);
  renderListaDeItens($trocaNovosLista, itensNovosTrocaAtual);
  bindListaDeItens($trocaNovosLista, itensNovosTrocaAtual, renderTrocaListas);

  const totalDevolvido = somaLista(itensDevolvidosAtual);
  const totalNovo = somaLista(itensNovosTrocaAtual);
  const diferenca = totalNovo - totalDevolvido;

  $vendaSubtotal.textContent = `Devolvido ${fmtMoeda(totalDevolvido)} · Novo ${fmtMoeda(totalNovo)}`;
  $vendaDescontoInfo.textContent = "";
  $vendaTotal.textContent = fmtMoeda(diferenca);
  $vendaTotal.style.color = diferenca < 0 ? "var(--danger)" : "var(--accent)";

  $btnFinalizarVenda.disabled = itensNovosTrocaAtual.length === 0 && itensDevolvidosAtual.length === 0;
}

function alternarModoVenda(novoModo) {
  modoVenda = novoModo;
  const ehTroca = modoVenda === "troca";

  $btnModoVenda.classList.toggle("desconto-ativo", !ehTroca);
  $btnModoTroca.classList.toggle("desconto-ativo", ehTroca);
  $tituloNovaVenda.textContent = ehTroca ? "Nova troca" : "Nova venda";
  $ladoTrocaWrap.classList.toggle("hidden", !ehTroca);
  $vendaItensLista.classList.toggle("hidden", ehTroca);
  $trocaListasWrap.classList.toggle("hidden", !ehTroca);
  $descontoWrap.classList.toggle("hidden", ehTroca);
  $vendaTotal.style.color = "";
  $rotuloSubtotal.textContent = ehTroca ? "Resumo" : "Subtotal";
  $rotuloTotal.textContent = ehTroca ? "Diferença (a favor da loja)" : "Total da venda";
  $btnFinalizarVenda.textContent = ehTroca ? "Finalizar troca" : "Finalizar venda";

  if (ehTroca) renderTrocaListas();
  else renderItensVenda();
}

$btnModoVenda.addEventListener("click", () => alternarModoVenda("venda"));
$btnModoTroca.addEventListener("click", () => alternarModoVenda("troca"));

$btnLadoDevolvido.addEventListener("click", () => {
  ladoTroca = "devolvido";
  $btnLadoDevolvido.classList.add("desconto-ativo");
  $btnLadoNovo.classList.remove("desconto-ativo");
});
$btnLadoNovo.addEventListener("click", () => {
  ladoTroca = "novo";
  $btnLadoNovo.classList.add("desconto-ativo");
  $btnLadoDevolvido.classList.remove("desconto-ativo");
});

async function adicionarProdutoNaVenda(codigo) {
  codigo = (codigo || "").trim();
  if (!codigo) return;
  const loja = $vendaLoja.value;
  if (!loja) return;

  $vendaMsgAdd.textContent = "Buscando produto...";
  $vendaMsgAdd.className = "msg";

  try {
    const item = await buscarPreco(codigo, loja);
    if (!item) {
      $vendaMsgAdd.textContent = "Produto não encontrado.";
      $vendaMsgAdd.className = "msg err";
      return;
    }
    adicionarItemNaListaDeVenda({
      codigo_barras: item.cdProduto,
      produto: item.dsProduto,
      preco_unit: item.vlPrecoPromocao > 0 ? item.vlPrecoPromocao : item.vlPreco,
    });
    salvarCachePreco(codigo, item);
    $vendaMsgAdd.textContent = "";
  } catch (e) {
    $vendaMsgAdd.textContent = e.mersanIndisponivel
      ? "A Mersan está instável no momento — tente de novo em alguns instantes."
      : "Erro ao buscar produto. Verifique a conexão.";
    $vendaMsgAdd.className = "msg err";
  }
}

$vendaProdutoInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const codigo = $vendaProdutoInput.value.trim();
  if (!codigo) return;
  $vendaProdutoInput.value = "";
  adicionarProdutoNaVenda(codigo);
});

$btnVendaManualToggle.addEventListener("click", () => {
  $vendaManualForm.classList.toggle("hidden");
});

$btnVendaManualAdicionar.addEventListener("click", () => {
  const nome = $vendaManualNome.value.trim();
  const preco = valorMascarado($vendaManualPreco);

  if (!nome || !preco || preco <= 0) {
    $vendaMsgAdd.textContent = "Preencha o nome e um preço válido.";
    $vendaMsgAdd.className = "msg err";
    return;
  }

  adicionarItemNaListaDeVenda({
    codigo_barras: null,
    produto: nome,
    preco_unit: preco,
  });

  $vendaManualNome.value = "";
  $vendaManualPreco.value = "";
  $vendaMsgAdd.textContent = "";
});

$btnVendaHistorico.addEventListener("click", async () => {
  $vendaHistoricoModal.classList.remove("hidden");
  $vendaHistoricoLista.innerHTML = `<div class="msg">Carregando histórico...</div>`;

  const { data, error } = await sb
    .from("historico")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("criado_em", { ascending: false })
    .limit(30);

  if (error) {
    $vendaHistoricoLista.innerHTML = `<div class="msg err">Erro ao carregar: ${error.message}</div>`;
    return;
  }
  if (!data || data.length === 0) {
    $vendaHistoricoLista.innerHTML = `<div class="msg">Nenhuma busca no histórico ainda.</div>`;
    return;
  }

  $vendaHistoricoLista.innerHTML = data.map((h, i) => `
    <div class="historico-item" data-i="${i}">
      <div class="h-conteudo">
        <div class="h-produto">${escapeHtml(h.produto || h.codigo_barras)}</div>
        <div class="h-meta">${h.preco != null ? fmtMoeda(h.preco) : "sem preço salvo"} · ${new Date(h.criado_em).toLocaleString("pt-BR")}</div>
      </div>
    </div>
  `).join("");

  $vendaHistoricoLista.querySelectorAll(".historico-item").forEach((el, i) => {
    el.addEventListener("click", () => {
      const h = data[i];
      if (h.preco == null) {
        $vendaMsgAdd.textContent = "Esse item não tem preço salvo — bipe ele direto pra adicionar.";
        $vendaMsgAdd.className = "msg err";
      } else {
        adicionarItemNaListaDeVenda({
          codigo_barras: h.codigo_barras,
          produto: h.produto,
          preco_unit: h.preco,
        });
        $vendaMsgAdd.textContent = "";
      }
      $vendaHistoricoModal.classList.add("hidden");
    });
  });
});

$btnFecharVendaHistorico.addEventListener("click", () => {
  $vendaHistoricoModal.classList.add("hidden");
});

async function salvarLinhasItens(vendaId, itens, devolvido) {
  if (itens.length === 0) return null;
  const linhas = itens.map(item => ({
    venda_id: vendaId,
    codigo_barras: item.codigo_barras,
    produto: item.produto,
    preco_unit: item.preco_unit,
    quantidade: item.quantidade,
    subtotal: item.preco_unit * item.quantidade,
    devolvido,
  }));
  const { error } = await sb.from("venda_itens").insert(linhas);
  return error;
}

$btnFinalizarVenda.addEventListener("click", async () => {
  if (!currentUser) return;
  const ehTroca = modoVenda === "troca";

  if (ehTroca) {
    if (itensDevolvidosAtual.length === 0 && itensNovosTrocaAtual.length === 0) return;
  } else if (itensVendaAtual.length === 0) {
    return;
  }

  $btnFinalizarVenda.disabled = true;
  $vendaMsg.textContent = ehTroca ? "Salvando troca..." : "Salvando venda...";
  $vendaMsg.className = "msg";

  const payload = {
    loja: Number($vendaLoja.value),
    observacao: $vendaObservacao.value.trim() || null,
    vendedor_email: currentUser.email,
  };

  if (ehTroca) {
    const totalDevolvido = somaLista(itensDevolvidosAtual);
    const totalNovo = somaLista(itensNovosTrocaAtual);
    payload.tipo = "troca";
    payload.subtotal = totalNovo;
    payload.valor_devolvido = totalDevolvido;
    payload.desconto_valor = 0;
    payload.desconto_percentual = 0;
    payload.total = totalNovo - totalDevolvido;
  } else {
    const { subtotal, totalFinal, descontoValor, descontoPct } = atualizarTotaisVenda();
    payload.tipo = "venda";
    payload.subtotal = subtotal;
    payload.desconto_valor = descontoValor;
    payload.desconto_percentual = descontoPct;
    payload.total = totalFinal;
  }

  const { data: vendaCriada, error: errVenda } = await sb.from("vendas").insert(payload).select().single();

  if (errVenda) {
    $vendaMsg.textContent = "Erro ao salvar: " + errVenda.message;
    $vendaMsg.className = "msg err";
    $btnFinalizarVenda.disabled = false;
    return;
  }

  let errItens;
  if (ehTroca) {
    errItens = (await salvarLinhasItens(vendaCriada.id, itensDevolvidosAtual, true))
      || (await salvarLinhasItens(vendaCriada.id, itensNovosTrocaAtual, false));
  } else {
    errItens = await salvarLinhasItens(vendaCriada.id, itensVendaAtual, false);
  }

  if (errItens) {
    $vendaMsg.textContent = "Registro salvo, mas houve erro ao salvar os itens: " + errItens.message;
    $vendaMsg.className = "msg err";
  } else {
    $vendaMsg.textContent = ehTroca ? "Troca registrada com sucesso!" : "Venda registrada com sucesso!";
    $vendaMsg.className = "msg";
  }

  itensVendaAtual = [];
  itensDevolvidosAtual = [];
  itensNovosTrocaAtual = [];
  $vendaObservacao.value = "";
  resetarDescontoVenda();
  if (ehTroca) renderTrocaListas(); else renderItensVenda();
  carregarVendas();
  atualizarResumoVendas();
});

let vendasPagina = 0;

// "YYYY-MM-DD" (valor de <input type="date">) -> início/fim daquele dia no
// fuso local, pra filtrar "criado_em" (timestamp UTC) corretamente.
function limitesDoDia(dataStr) {
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  return {
    inicio: new Date(ano, mes - 1, dia),
    fim: new Date(ano, mes - 1, dia + 1),
  };
}

function dataAaaaMmDd(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

async function carregarVendas(pagina = 0) {
  if (!currentUser) return;
  if (!$vendasDataFiltro.value) $vendasDataFiltro.value = dataAaaaMmDd(new Date());

  $vendasLista.innerHTML = `<div class="msg">Carregando vendas...</div>`;
  const antiga = $vendasLista.parentElement.querySelector(".h-paginacao");
  if (antiga) antiga.remove();

  const from = pagina * PAGINA_TAMANHO;
  const to = from + PAGINA_TAMANHO - 1;
  const { inicio, fim } = limitesDoDia($vendasDataFiltro.value);

  const { data, error, count } = await sb
    .from("vendas")
    .select("*", { count: "exact" })
    .gte("criado_em", inicio.toISOString())
    .lt("criado_em", fim.toISOString())
    .order("criado_em", { ascending: false })
    .range(from, to);

  if (error) {
    $vendasLista.innerHTML = `<div class="msg err">Erro ao carregar vendas: ${error.message}</div>`;
    return;
  }

  renderVendasLista(data);
  const totalPaginas = Math.max(1, Math.ceil((count || 0) / PAGINA_TAMANHO));
  renderPaginacao($vendasLista, pagina, totalPaginas, (novaPagina) => carregarVendas(novaPagina));
}

$vendasDataFiltro.addEventListener("change", () => {
  carregarVendas(0);
  atualizarResumoVendas();
});

function csvEscape(valor) {
  const s = String(valor ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Exporta todas as vendas do dia selecionado (não só a página atual da
// tela) num CSV, uma linha por venda, itens resumidos numa coluna só.
$btnExportarVendasCsv.addEventListener("click", async () => {
  if (!currentUser) return;
  const dataFiltro = $vendasDataFiltro.value || dataAaaaMmDd(new Date());
  const { inicio, fim } = limitesDoDia(dataFiltro);

  $btnExportarVendasCsv.disabled = true;
  $btnExportarVendasCsv.textContent = "Exportando...";

  const { data, error } = await sb
    .from("vendas")
    .select("*, venda_itens(*)")
    .gte("criado_em", inicio.toISOString())
    .lt("criado_em", fim.toISOString())
    .order("criado_em", { ascending: true });

  $btnExportarVendasCsv.disabled = false;
  $btnExportarVendasCsv.textContent = "Exportar CSV";

  if (error) {
    alert("Erro ao exportar: " + error.message);
    return;
  }
  if (!data || data.length === 0) {
    alert("Nenhuma venda nesse dia pra exportar.");
    return;
  }

  const cabecalho = ["Data/Hora", "Loja", "Vendedor", "Tipo", "Itens", "Subtotal", "Desconto", "Total", "Observação"];
  const linhas = data.map(v => {
    const info = LOJAS_INFO[v.loja];
    const lojaTexto = info ? `Loja ${v.loja} - ${info.nome}` : `Loja ${v.loja}`;
    const itensTexto = (v.venda_itens || [])
      .map(it => `${it.quantidade}x ${it.produto || it.codigo_barras}`)
      .join("; ");
    return [
      new Date(v.criado_em).toLocaleString("pt-BR"),
      lojaTexto,
      v.vendedor_email || "",
      v.tipo === "troca" ? "Troca" : "Venda",
      itensTexto,
      fmtMoeda(v.subtotal || 0),
      fmtMoeda(v.desconto_valor || 0),
      fmtMoeda(v.total),
      v.observacao || "",
    ];
  });

  const csv = [cabecalho, ...linhas].map(linha => linha.map(csvEscape).join(",")).join("\r\n");
  // BOM no início pra o Excel reconhecer UTF-8 e mostrar acento certinho.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vendas-${dataFiltro}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

// Monta o texto do comprovante — funciona pra venda normal e pra troca.
function gerarTextoComprovante(v, itens) {
  const info = LOJAS_INFO[v.loja];
  const lojaTexto = info ? `Loja ${v.loja} - ${info.nome}` : `Loja ${v.loja}`;
  const dataTexto = new Date(v.criado_em).toLocaleString("pt-BR");
  const linhaItem = it => `${it.quantidade}x ${it.produto || it.codigo_barras} — ${fmtMoeda(it.subtotal)}`;

  if (v.tipo === "troca") {
    const devolvidos = itens.filter(it => it.devolvido);
    const novos = itens.filter(it => !it.devolvido);
    return [
      `🔁 Comprovante de troca — ${lojaTexto}`,
      dataTexto,
      "",
      "Devolvido:",
      devolvidos.length ? devolvidos.map(linhaItem).join("\n") : "Nenhum",
      "",
      "Novo:",
      novos.length ? novos.map(linhaItem).join("\n") : "Nenhum",
      "",
      `Diferença: ${fmtMoeda(v.total)}`,
      "",
      "Obrigado pela preferência!",
    ].join("\n");
  }

  const linhas = [
    `🧾 Comprovante de venda — ${lojaTexto}`,
    dataTexto,
    "",
    itens.map(linhaItem).join("\n"),
  ];
  if (v.desconto_valor > 0) {
    linhas.push("", `Subtotal: ${fmtMoeda(v.subtotal)}`, `Desconto (${Number(v.desconto_percentual).toFixed(1)}%): -${fmtMoeda(v.desconto_valor)}`);
  }
  linhas.push(`Total: ${fmtMoeda(v.total)}`, "", "Obrigado pela preferência!");
  return linhas.join("\n");
}

// Usa o compartilhamento nativo (abre o WhatsApp direto se disponível no
// aparelho); sem suporte (a maioria dos navegadores de desktop), abre o
// wa.me com o texto pronto pra colar num contato.
async function compartilharComprovante(venda) {
  const { data: itens, error } = await sb.from("venda_itens").select("*").eq("venda_id", venda.id);
  if (error) {
    alert("Erro ao carregar itens da venda: " + error.message);
    return;
  }
  const texto = gerarTextoComprovante(venda, itens || []);
  if (navigator.share) {
    try {
      await navigator.share({ text: texto });
    } catch (e) {
      // usuário cancelou o compartilhamento — não é erro
    }
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
  }
}

function renderVendasLista(data) {
  if (!data || data.length === 0) {
    $vendasLista.innerHTML = `<div class="msg">Nenhuma venda registrada nesse dia.</div>`;
    return;
  }

  const souAdmin = ehAdmin();

  $vendasLista.innerHTML = data.map(v => {
    const info = LOJAS_INFO[v.loja];
    const lojaTexto = info ? `Loja ${v.loja} - ${info.nome}` : `Loja ${v.loja}`;
    const vendedorTexto = souAdmin && v.vendedor_email ? ` · ${escapeHtml(v.vendedor_email)}` : "";
    const ehTroca = v.tipo === "troca";
    const tituloLinha = ehTroca ? `🔁 Troca — ${lojaTexto}` : lojaTexto;
    return `
    <div class="historico-item venda-resumo" data-id="${v.id}" style="cursor:pointer;">
      <div class="h-conteudo">
        <div class="h-produto">${tituloLinha}</div>
        <div class="h-meta">${new Date(v.criado_em).toLocaleString("pt-BR")}${vendedorTexto}</div>
        ${v.observacao ? `<div class="h-meta">${escapeHtml(v.observacao)}</div>` : ""}
        <div class="venda-detalhe hidden" style="margin-top:8px;"></div>
      </div>
      <div class="h-acoes">
        <span style="${v.total < 0 ? "color:var(--danger);" : ""}">${fmtMoeda(v.total)}</span>
        <button class="h-btn comprovante" title="Comprovante">${ICONE_COMPROVANTE}</button>
        ${!ehTroca ? `<button class="h-btn editar" title="Adicionar itens">${ICONE_LAPIS}</button>` : ""}
        <button class="h-btn apagar" title="Apagar">${ICONE_LIXEIRA}</button>
      </div>
    </div>
  `;
  }).join("");

  $vendasLista.querySelectorAll(".venda-resumo").forEach(el => {
    const id = el.dataset.id;

    const $btnEditar = el.querySelector(".editar");
    if ($btnEditar) {
      $btnEditar.addEventListener("click", (e) => {
        e.stopPropagation();
        const v = data.find(x => x.id === id);
        if (v) abrirEditorVenda(v);
      });
    }

    el.querySelector(".comprovante").addEventListener("click", (e) => {
      e.stopPropagation();
      const v = data.find(x => x.id === id);
      if (v) compartilharComprovante(v);
    });

    el.querySelector(".h-conteudo").addEventListener("click", async () => {
      const $detalhe = el.querySelector(".venda-detalhe");
      const abrindo = $detalhe.classList.contains("hidden");
      if (!abrindo) {
        $detalhe.classList.add("hidden");
        return;
      }
      $detalhe.classList.remove("hidden");
      if ($detalhe.dataset.carregado) return;
      $detalhe.innerHTML = `<div class="msg">Carregando itens...</div>`;

      const { data: itens, error } = await sb
        .from("venda_itens")
        .select("*")
        .eq("venda_id", id);

      if (error) {
        $detalhe.innerHTML = `<div class="msg err">Erro ao carregar itens.</div>`;
        return;
      }
      $detalhe.dataset.carregado = "1";
      const v = data.find(x => x.id === id);

      const linhaItem = it => `
        <div style="display:flex; justify-content:space-between; font-size:0.82rem; padding:3px 0;">
          <span>${it.quantidade}x ${escapeHtml(it.produto || it.codigo_barras)}</span>
          <span>${fmtMoeda(it.subtotal)}</span>
        </div>`;

      if (v && v.tipo === "troca") {
        const devolvidos = (itens || []).filter(it => it.devolvido);
        const novos = (itens || []).filter(it => !it.devolvido);
        $detalhe.innerHTML = `
          <div style="font-size:0.78rem; color:var(--muted); margin-top:4px;">Devolvido</div>
          ${devolvidos.map(linhaItem).join("") || `<div class="msg">Nenhum</div>`}
          <div style="font-size:0.78rem; color:var(--muted); margin-top:8px;">Novo</div>
          ${novos.map(linhaItem).join("") || `<div class="msg">Nenhum</div>`}
          <div style="display:flex; justify-content:space-between; font-size:0.82rem; padding:6px 0; margin-top:4px; border-top:1px solid var(--border); font-weight:700;">
            <span>Diferença</span><span>${fmtMoeda(v.total)}</span>
          </div>
        `;
        return;
      }

      const linhaDesconto = v && v.desconto_valor > 0
        ? `<div style="display:flex; justify-content:space-between; font-size:0.82rem; padding:3px 0; color:var(--muted);">
             <span>Subtotal</span><span>${fmtMoeda(v.subtotal)}</span>
           </div>
           <div style="display:flex; justify-content:space-between; font-size:0.82rem; padding:3px 0; color:var(--danger);">
             <span>Desconto (${Number(v.desconto_percentual).toFixed(1)}%)</span><span>-${fmtMoeda(v.desconto_valor)}</span>
           </div>`
        : "";
      $detalhe.innerHTML = (itens || []).map(linhaItem).join("") + linhaDesconto;
    });

    el.querySelector(".apagar").addEventListener("click", async (e) => {
      e.stopPropagation();
      await sb.from("vendas").delete().eq("id", id);
      carregarVendas();
    });
  });
}

// ---------- EDITAR VENDA (ADICIONAR ITENS DEPOIS DE FINALIZADA) ----------

let vendaEditando = null;

async function abrirEditorVenda(venda) {
  vendaEditando = venda;
  $editarVendaModal.classList.remove("hidden");
  $editarVendaMsg.textContent = "";
  $editarVendaManualForm.classList.add("hidden");
  $editarVendaProdutoInput.value = "";
  $editarVendaManualNome.value = "";
  $editarVendaManualPreco.value = "";
  await carregarItensEditorVenda();
}

async function carregarItensEditorVenda() {
  $editarVendaItensLista.innerHTML = `<div class="msg">Carregando itens...</div>`;
  const { data: itens, error } = await sb
    .from("venda_itens")
    .select("*")
    .eq("venda_id", vendaEditando.id)
    .eq("devolvido", false);

  if (error) {
    $editarVendaItensLista.innerHTML = `<div class="msg err">Erro ao carregar itens.</div>`;
    return;
  }

  if (!itens || itens.length === 0) {
    $editarVendaItensLista.innerHTML = `<div class="msg">Nenhum item ainda.</div>`;
    return;
  }

  $editarVendaItensLista.innerHTML = itens.map(it => `
    <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.82rem; padding:4px 0; border-bottom:1px solid var(--border);">
      <span>${it.quantidade}x ${escapeHtml(it.produto || it.codigo_barras)}</span>
      <span style="display:flex; align-items:center; gap:8px;">
        ${fmtMoeda(it.subtotal)}
        <button class="h-btn remover-item-editor" data-id="${it.id}" title="Remover">${ICONE_LIXEIRA}</button>
      </span>
    </div>
  `).join("");

  $editarVendaItensLista.querySelectorAll(".remover-item-editor").forEach(btn => {
    btn.addEventListener("click", () => removerItemDoEditorVenda(btn.dataset.id));
  });
}

async function removerItemDoEditorVenda(itemId) {
  if (!vendaEditando) return;
  $editarVendaMsg.textContent = "Removendo...";
  $editarVendaMsg.className = "msg";

  const { data: item, error: errBusca } = await sb
    .from("venda_itens")
    .select("subtotal")
    .eq("id", itemId)
    .single();

  if (errBusca) {
    $editarVendaMsg.textContent = "Erro ao remover item: " + errBusca.message;
    $editarVendaMsg.className = "msg err";
    return;
  }

  const { error: errDelete } = await sb.from("venda_itens").delete().eq("id", itemId);
  if (errDelete) {
    $editarVendaMsg.textContent = "Erro ao remover item: " + errDelete.message;
    $editarVendaMsg.className = "msg err";
    return;
  }

  const novoSubtotal = Math.max(0, Number(vendaEditando.subtotal || 0) - Number(item.subtotal || 0));
  const descontoPct = Number(vendaEditando.desconto_percentual || 0);
  const descontoValor = descontoPct > 0 ? novoSubtotal * (descontoPct / 100) : Number(vendaEditando.desconto_valor || 0);
  const novoTotal = novoSubtotal - descontoValor;

  const { error: errVenda } = await sb.from("vendas").update({
    subtotal: novoSubtotal,
    desconto_valor: descontoValor,
    total: novoTotal,
  }).eq("id", vendaEditando.id);

  if (errVenda) {
    $editarVendaMsg.textContent = "Item removido, mas houve erro ao atualizar o total: " + errVenda.message;
    $editarVendaMsg.className = "msg err";
  } else {
    vendaEditando.subtotal = novoSubtotal;
    vendaEditando.desconto_valor = descontoValor;
    vendaEditando.total = novoTotal;
    $editarVendaMsg.textContent = "Item removido!";
    $editarVendaMsg.className = "msg";
  }

  await carregarItensEditorVenda();
}

async function adicionarItemAEditorVenda({ codigo_barras, produto, preco_unit }) {
  if (!vendaEditando) return;
  $editarVendaMsg.textContent = "Adicionando...";
  $editarVendaMsg.className = "msg";

  const { error: errItem } = await sb.from("venda_itens").insert({
    venda_id: vendaEditando.id,
    codigo_barras: codigo_barras || null,
    produto,
    preco_unit,
    quantidade: 1,
    subtotal: preco_unit,
    devolvido: false,
  });

  if (errItem) {
    $editarVendaMsg.textContent = "Erro ao adicionar item: " + errItem.message;
    $editarVendaMsg.className = "msg err";
    return;
  }

  const novoSubtotal = Number(vendaEditando.subtotal || 0) + preco_unit;
  const descontoPct = Number(vendaEditando.desconto_percentual || 0);
  const descontoValor = descontoPct > 0 ? novoSubtotal * (descontoPct / 100) : Number(vendaEditando.desconto_valor || 0);
  const novoTotal = novoSubtotal - descontoValor;

  const { error: errVenda } = await sb.from("vendas").update({
    subtotal: novoSubtotal,
    desconto_valor: descontoValor,
    total: novoTotal,
  }).eq("id", vendaEditando.id);

  if (errVenda) {
    $editarVendaMsg.textContent = "Item adicionado, mas houve erro ao atualizar o total: " + errVenda.message;
    $editarVendaMsg.className = "msg err";
  } else {
    vendaEditando.subtotal = novoSubtotal;
    vendaEditando.desconto_valor = descontoValor;
    vendaEditando.total = novoTotal;
    $editarVendaMsg.textContent = "Item adicionado!";
    $editarVendaMsg.className = "msg";
  }

  await carregarItensEditorVenda();
}

$btnEditarVendaAdicionar.addEventListener("click", async () => {
  const codigo = $editarVendaProdutoInput.value.trim();
  if (!codigo || !vendaEditando) return;
  $editarVendaProdutoInput.value = "";
  $editarVendaMsg.textContent = "Buscando produto...";
  $editarVendaMsg.className = "msg";
  try {
    const item = await buscarPreco(codigo, vendaEditando.loja);
    if (!item) {
      $editarVendaMsg.textContent = "Produto não encontrado.";
      $editarVendaMsg.className = "msg err";
      return;
    }
    await adicionarItemAEditorVenda({
      codigo_barras: item.cdProduto,
      produto: item.dsProduto,
      preco_unit: item.vlPrecoPromocao > 0 ? item.vlPrecoPromocao : item.vlPreco,
    });
  } catch (e) {
    $editarVendaMsg.textContent = e.mersanIndisponivel
      ? "A Mersan está instável no momento — tente de novo em alguns instantes."
      : "Erro ao buscar produto. Verifique a conexão.";
    $editarVendaMsg.className = "msg err";
  }
});

$editarVendaProdutoInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  $btnEditarVendaAdicionar.click();
});

$btnEditarVendaManualToggle.addEventListener("click", () => {
  $editarVendaManualForm.classList.toggle("hidden");
});

$btnEditarVendaManualAdicionar.addEventListener("click", async () => {
  const nome = $editarVendaManualNome.value.trim();
  const preco = valorMascarado($editarVendaManualPreco);
  if (!nome || !preco || preco <= 0) {
    $editarVendaMsg.textContent = "Preencha o nome e um preço válido.";
    $editarVendaMsg.className = "msg err";
    return;
  }
  await adicionarItemAEditorVenda({ codigo_barras: null, produto: nome, preco_unit: preco });
  $editarVendaManualNome.value = "";
  $editarVendaManualPreco.value = "";
});

$btnFecharEditarVenda.addEventListener("click", () => {
  $editarVendaModal.classList.add("hidden");
  vendaEditando = null;
  carregarVendas();
  atualizarResumoVendas();
});

// ---------- METAS E FOLGAS ----------

function chaveDia(data) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

function anoMesAtual(data = new Date()) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
}

// A "quinzena" de vendas: dia 1 ao 15 é a 1ª, dia 16 ao fim do mês é a 2ª.
function quinzenaAtual(hoje) {
  const dia = hoje.getDate();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  if (dia <= 15) {
    return { numero: 1, inicio: new Date(ano, mes, 1), fim: new Date(ano, mes, 15) };
  }
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  return { numero: 2, inicio: new Date(ano, mes, 16), fim: new Date(ano, mes, ultimoDia) };
}

let folgasDoMes = new Set(); // chaves "YYYY-MM-DD" do mês atual
let metaAtual = { meta_quinzena_1: 0, meta_quinzena_2: 0 };

async function carregarMetaEFolgas() {
  if (!currentUser) return;

  const { data: metaData } = await sb
    .from("metas")
    .select("*")
    .eq("ano_mes", anoMesAtual())
    .maybeSingle();
  metaAtual = metaData || { meta_quinzena_1: 0, meta_quinzena_2: 0 };

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const { data: folgasData } = await sb
    .from("folgas")
    .select("data")
    .gte("data", chaveDia(inicioMes))
    .lte("data", chaveDia(fimMes));
  folgasDoMes = new Set((folgasData || []).map(f => f.data));

  await atualizarResumoVendas();
}

// Mensagem "zoeira" que muda todo dia (mesma mensagem o dia inteiro, troca
// sozinha à meia-noite) — pura brincadeira pra dar uma cutucada.
const MENSAGENS_ZERO_VENDAS = [
  "Bora trabalhar, vagabundo! Ainda não vendeu nada hoje 👀",
  "Cadê as vendas? O caixa não vai se encher sozinho...",
  "Já tomou café, já viu o celular... e as vendas, hein?",
  "Hoje o placar tá 0 a 0. Bora sair na frente!",
  "Levanta dessa cadeira e vai atrás de cliente!",
  "O dia começou e você ainda não vendeu nada. Bora resolver isso.",
  "Suspeito que você esteja mais em pé de loja que vendendo.",
];
const MENSAGENS_VENDA_PARCIAL = [
  "Boa, já quebrou o gelo! Agora não para.",
  "Isso aí, continua nesse ritmo que a meta cai.",
  "Já vendeu, mas ainda falta um pouquinho — não afrouxa!",
  "Show! Só falta o resto da meta agora.",
  "Tá esquentando... bora fechar mais uma.",
  "Metade do caminho andado, vagabundo (com carinho).",
];
const MENSAGENS_META_BATIDA = [
  "Meta batida! Pode ir tomar um café, você mereceu 🎉",
  "Aí sim! Hoje você é o rei/rainha das vendas.",
  "Bateu a meta! Bora bater recorde agora?",
  "Show de bola! Meta do dia: concluída.",
  "Meta na conta! Agora é só sobreviver tranquilo o resto do plantão.",
  "Confirmado: hoje você não é vagabundo nenhum.",
];

function indiceDoDia(tamanho) {
  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 0);
  const diaDoAno = Math.floor((hoje - inicioAno) / 86400000);
  return diaDoAno % tamanho;
}

function atualizarMensagemMotivacional(totalHoje, metaBatida) {
  const pool = metaBatida ? MENSAGENS_META_BATIDA : (totalHoje > 0 ? MENSAGENS_VENDA_PARCIAL : MENSAGENS_ZERO_VENDAS);
  $mensagemMotivacional.textContent = pool[indiceDoDia(pool.length)];
}

async function atualizarResumoVendas() {
  if (!currentUser) return;

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMesExclusivo = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);

  // O card "Hoje" acompanha a data selecionada no histórico (pode ser um
  // dia diferente do real), então busca à parte — o mês/quinzena/mensagem
  // motivacional continuam sempre baseados no dia real de hoje.
  const hojeChave = dataAaaaMmDd(hoje);
  const dataSelecionada = $vendasDataFiltro.value || hojeChave;
  const { inicio: inicioDia, fim: fimDiaExclusivo } = limitesDoDia(dataSelecionada);

  const [resMes, resDia] = await Promise.all([
    sb.from("vendas").select("total, criado_em").gte("criado_em", inicioMes.toISOString()).lt("criado_em", fimMesExclusivo.toISOString()),
    sb.from("vendas").select("total").gte("criado_em", inicioDia.toISOString()).lt("criado_em", fimDiaExclusivo.toISOString()),
  ]);

  if (resMes.error || resDia.error) {
    $metaResumo.textContent = "Erro ao carregar resumo de vendas.";
    $metaResumo.className = "msg err";
    return;
  }

  const quinzena = quinzenaAtual(hoje);
  const fimQuinzenaFimDoDia = new Date(quinzena.fim.getFullYear(), quinzena.fim.getMonth(), quinzena.fim.getDate(), 23, 59, 59);

  let totalHojeReal = 0, totalMes = 0, totalQuinzena = 0, vendasMes = 0;

  (resMes.data || []).forEach(v => {
    const d = new Date(v.criado_em);
    const valor = Number(v.total);
    totalMes += valor;
    vendasMes++;
    if (chaveDia(d) === hojeChave) totalHojeReal += valor;
    if (d >= quinzena.inicio && d <= fimQuinzenaFimDoDia) totalQuinzena += valor;
  });

  const totalDiaSelecionado = (resDia.data || []).reduce((soma, v) => soma + Number(v.total), 0);
  const vendasDiaSelecionado = (resDia.data || []).length;

  $totalDiaTitulo.textContent = dataSelecionada === hojeChave ? "Hoje" : dataSelecionada.split("-").reverse().join("/");
  $totalHoje.textContent = fmtMoeda(totalDiaSelecionado);
  $vendasHojeCount.textContent = `${vendasDiaSelecionado} venda${vendasDiaSelecionado === 1 ? "" : "s"}`;
  $totalMes.textContent = fmtMoeda(totalMes);
  $vendasMesCount.textContent = `${vendasMes} venda${vendasMes === 1 ? "" : "s"}`;

  const metaQuinzena = Number(quinzena.numero === 1 ? metaAtual.meta_quinzena_1 : metaAtual.meta_quinzena_2) || 0;

  if (metaQuinzena <= 0) {
    $metaBarra.style.width = "0%";
    $metaResumo.innerHTML = `Nenhuma meta definida pra ${quinzena.numero}ª quinzena ainda. Toque em "Configurar meta e folgas" pra definir.`;
    $metaResumo.className = "msg";
    atualizarMensagemMotivacional(totalHojeReal, false);
    return;
  }

  const restante = Math.max(0, metaQuinzena - totalQuinzena);
  const pct = Math.min(100, (totalQuinzena / metaQuinzena) * 100);
  $metaBarra.style.width = pct + "%";

  if (restante <= 0) {
    $metaResumo.innerHTML = `<strong style="color:var(--accent);">Meta da ${quinzena.numero}ª quinzena batida! 🎉</strong> ${fmtMoeda(totalQuinzena)} de ${fmtMoeda(metaQuinzena)}.`;
    $metaResumo.className = "msg";
    atualizarMensagemMotivacional(totalHojeReal, true);
    return;
  }

  atualizarMensagemMotivacional(totalHojeReal, false);

  // Dias restantes da quinzena a partir de hoje (inclusive), sem contar folga.
  let diasRestantes = 0;
  const inicioContagem = new Date(Math.max(quinzena.inicio.getTime(), new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime()));
  const cursor = new Date(inicioContagem);
  while (cursor <= quinzena.fim) {
    if (!folgasDoMes.has(chaveDia(cursor))) diasRestantes++;
    cursor.setDate(cursor.getDate() + 1);
  }

  const metaDiaria = diasRestantes > 0 ? restante / diasRestantes : restante;
  $metaResumo.innerHTML = `
    ${fmtMoeda(totalQuinzena)} de ${fmtMoeda(metaQuinzena)} (${quinzena.numero}ª quinzena) · faltam ${fmtMoeda(restante)}<br>
    Meta de hoje: <strong>${fmtMoeda(metaDiaria)}</strong> (${diasRestantes} dia${diasRestantes === 1 ? "" : "s"} restantes, sem contar folga)
  `;
  $metaResumo.className = "msg";
}

function renderFolgasCalendario() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const nomeMes = hoje.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  $folgasMesNome.textContent = nomeMes;

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const hojeChave = chaveDia(hoje);

  const celulas = [];
  for (let i = 0; i < primeiroDiaSemana; i++) celulas.push(`<div></div>`);
  for (let dia = 1; dia <= totalDias; dia++) {
    const chave = chaveDia(new Date(ano, mes, dia));
    const ehFolga = folgasDoMes.has(chave);
    const ehPassado = chave < hojeChave;
    celulas.push(`<div class="folgas-dia ${ehFolga ? "folga" : ""} ${ehPassado ? "passado" : ""}" data-chave="${chave}">${dia}</div>`);
  }

  $folgasCalendario.innerHTML = `
    <div class="folgas-semana-label">D</div><div class="folgas-semana-label">S</div><div class="folgas-semana-label">T</div><div class="folgas-semana-label">Q</div><div class="folgas-semana-label">Q</div><div class="folgas-semana-label">S</div><div class="folgas-semana-label">S</div>
    ${celulas.join("")}
  `;

  $folgasCalendario.querySelectorAll(".folgas-dia:not(.passado)").forEach(el => {
    el.addEventListener("click", () => alternarFolga(el.dataset.chave));
  });
}

async function alternarFolga(chave) {
  if (folgasDoMes.has(chave)) {
    await sb.from("folgas").delete().eq("data", chave);
    folgasDoMes.delete(chave);
  } else {
    await sb.from("folgas").insert({ data: chave });
    folgasDoMes.add(chave);
  }
  renderFolgasCalendario();
  atualizarResumoVendas();
}

$btnConfigMetas.addEventListener("click", () => {
  definirValorMascarado($metaQuinzena1, metaAtual.meta_quinzena_1);
  definirValorMascarado($metaQuinzena2, metaAtual.meta_quinzena_2);
  $metasMsg.textContent = "";
  renderFolgasCalendario();
  $metasModal.classList.remove("hidden");
});

$btnFecharMetas.addEventListener("click", () => $metasModal.classList.add("hidden"));

$btnSalvarMetas.addEventListener("click", async () => {
  const payload = {
    ano_mes: anoMesAtual(),
    meta_quinzena_1: valorMascarado($metaQuinzena1),
    meta_quinzena_2: valorMascarado($metaQuinzena2),
  };
  $metasMsg.textContent = "Salvando...";
  $metasMsg.className = "msg";

  const { error } = await sb.from("metas").upsert(payload, { onConflict: "user_id,ano_mes" });

  if (error) {
    $metasMsg.textContent = "Erro: " + error.message;
    $metasMsg.className = "msg err";
    return;
  }
  metaAtual = payload;
  $metasMsg.textContent = "Metas salvas!";
  $metasMsg.className = "msg";
  atualizarResumoVendas();
});

// As lojas escolhidas ficam salvas no perfil do usuário (sincroniza entre
// dispositivos); enquanto não há login, usa um rascunho local.
$lojas.addEventListener("change", () => {
  localStorage.setItem("bp_lojas", $lojas.value);
  if (currentUser) {
    sb.auth.updateUser({ data: { lojas_favoritas: $lojas.value } });
  }
});
$lojas.value = localStorage.getItem("bp_lojas") || "1";

$btnRedeToda.addEventListener("click", () => {
  $lojas.value = TODAS_AS_LOJAS.join(",");
  $lojas.dispatchEvent(new Event("change"));
});

// ---------- COMISSÃO ----------

let configComissaoAtual = null;
let totalVendidoMesComissao = 0;

async function carregarComissao() {
  if (!currentUser) return;
  $comissaoResumo.innerHTML = `<div class="msg">Carregando...</div>`;
  $comissaoSimulacao.textContent = "";
  document.querySelectorAll(".sim-colocacao").forEach(b => b.classList.remove("desconto-ativo"));
  $comissaoConfigCard.classList.toggle("hidden", !ehAdmin());

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMesExclusivo = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);

  const [{ data: config, error: errConfig }, { data: vendasMes, error: errVendas }, { data: metaData }] = await Promise.all([
    sb.from("config_comissao").select("*").eq("id", 1).maybeSingle(),
    sb.from("vendas").select("total, criado_em").gte("criado_em", inicioMes.toISOString()).lt("criado_em", fimMesExclusivo.toISOString()),
    sb.from("metas").select("*").eq("ano_mes", anoMesAtual()).maybeSingle(),
  ]);

  if (errConfig || errVendas) {
    $comissaoResumo.innerHTML = `<div class="msg err">Erro ao carregar comissão: ${(errConfig || errVendas).message}</div>`;
    return;
  }

  configComissaoAtual = config;

  if (ehAdmin() && config) {
    $pctPrimeiro.value = config.pct_1_lugar;
    $pctSegundo.value = config.pct_2_lugar;
    $pctTerceiro.value = config.pct_3_lugar;
    $pctMetaBatida.value = config.pct_meta_batida;
    $pctMetaNaoBatida.value = config.pct_meta_nao_batida;
  }

  // A meta é por quinzena, então bater ou não a meta — e o percentual que
  // isso libera — é calculado separado pra cada quinzena, não no mês inteiro.
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const q1Inicio = new Date(ano, mes, 1);
  const q1Fim = new Date(ano, mes, 15, 23, 59, 59);
  const q2Inicio = new Date(ano, mes, 16);
  const q2Fim = new Date(ano, mes, ultimoDia, 23, 59, 59);

  let totalQ1 = 0, totalQ2 = 0;
  (vendasMes || []).forEach(v => {
    const d = new Date(v.criado_em);
    const valor = Number(v.total);
    if (d >= q1Inicio && d <= q1Fim) totalQ1 += valor;
    else if (d >= q2Inicio && d <= q2Fim) totalQ2 += valor;
  });

  const metaQ1 = metaData ? Number(metaData.meta_quinzena_1 || 0) : 0;
  const metaQ2 = metaData ? Number(metaData.meta_quinzena_2 || 0) : 0;
  // calcularComissaoQuinzena é testada isolada em calc.test.js.
  const { bateu: bateuQ1, pct: pctQ1, comissao: comissaoQ1 } = calcularComissaoQuinzena(totalQ1, metaQ1, config.pct_meta_batida, config.pct_meta_nao_batida);
  const { bateu: bateuQ2, pct: pctQ2, comissao: comissaoQ2 } = calcularComissaoQuinzena(totalQ2, metaQ2, config.pct_meta_batida, config.pct_meta_nao_batida);
  const comissaoTotal = comissaoQ1 + comissaoQ2;

  // Usado pelo simulador de colocação (que continua olhando o mês inteiro).
  totalVendidoMesComissao = totalQ1 + totalQ2;

  const linhaQuinzena = (titulo, total, meta, bateu, pct, comissao) => {
    const metaTexto = meta > 0 ? `${fmtMoeda(meta)}${bateu ? " · batida ✅" : " · não batida"}` : "não definida";
    return `
      <div class="loja-titulo" style="margin-top:10px; margin-bottom:4px;">${titulo}</div>
      <table style="width:100%;">
        <tbody>
          <tr><td style="padding:4px 0; color:var(--muted);">Vendido</td><td style="padding:4px 0; text-align:right;">${fmtMoeda(total)}</td></tr>
          <tr><td style="padding:4px 0; color:var(--muted);">Meta</td><td style="padding:4px 0; text-align:right;">${metaTexto}</td></tr>
          <tr><td style="padding:4px 0; color:var(--muted);">Percentual</td><td style="padding:4px 0; text-align:right; font-weight:700;">${pct}%</td></tr>
          <tr><td style="padding:4px 0; font-weight:700;">Comissão</td><td style="padding:4px 0; text-align:right; font-weight:700; color:var(--accent);">${fmtMoeda(comissao)}</td></tr>
        </tbody>
      </table>
    `;
  };

  $comissaoResumo.innerHTML =
    linhaQuinzena("1ª quinzena (dia 1 ao 15)", totalQ1, metaQ1, bateuQ1, pctQ1, comissaoQ1) +
    linhaQuinzena("2ª quinzena (dia 16 ao fim do mês)", totalQ2, metaQ2, bateuQ2, pctQ2, comissaoQ2) +
    `<div style="display:flex; justify-content:space-between; padding:10px 0; margin-top:12px; border-top:1px solid var(--border); font-weight:700; font-size:1.05rem;">
       <span>Comissão total do mês</span><span style="color:var(--accent);">${fmtMoeda(comissaoTotal)}</span>
     </div>`;
}

document.querySelectorAll(".sim-colocacao").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!configComissaoAtual) return;
    document.querySelectorAll(".sim-colocacao").forEach(b => b.classList.remove("desconto-ativo"));
    btn.classList.add("desconto-ativo");

    const pos = btn.dataset.pos;
    const pctPorPosicao = { "1": configComissaoAtual.pct_1_lugar, "2": configComissaoAtual.pct_2_lugar, "3": configComissaoAtual.pct_3_lugar };
    const pct = Number(pctPorPosicao[pos]);
    const valor = totalVendidoMesComissao * (pct / 100);

    $comissaoSimulacao.innerHTML = `Se você ficasse em <strong>${pos}º lugar</strong>: ${pct}% sobre ${fmtMoeda(totalVendidoMesComissao)} = <strong style="color:var(--accent);">${fmtMoeda(valor)}</strong>`;
  });
});

$btnSalvarComissaoConfig.addEventListener("click", async () => {
  $comissaoConfigMsg.textContent = "Salvando...";
  $comissaoConfigMsg.className = "msg";

  const { error } = await sb.from("config_comissao").update({
    pct_1_lugar: Number($pctPrimeiro.value) || 0,
    pct_2_lugar: Number($pctSegundo.value) || 0,
    pct_3_lugar: Number($pctTerceiro.value) || 0,
    pct_meta_batida: Number($pctMetaBatida.value) || 0,
    pct_meta_nao_batida: Number($pctMetaNaoBatida.value) || 0,
    atualizado_em: new Date().toISOString(),
  }).eq("id", 1);

  if (error) {
    $comissaoConfigMsg.textContent = "Erro: " + error.message;
    $comissaoConfigMsg.className = "msg err";
    return;
  }
  $comissaoConfigMsg.textContent = "Salvo!";
  $comissaoConfigMsg.className = "msg";
  carregarComissao();
});

// ---------- PROMOÇÃO ----------

function popularLojasPromo() {
  if ($promoLoja.options.length > 0) return;
  $promoLoja.innerHTML = TODAS_AS_LOJAS
    .slice()
    .sort((a, b) => a - b)
    .map(n => {
      const info = LOJAS_INFO[n];
      const label = info ? `${n} - ${info.nome}` : String(n);
      return `<option value="${n}">${label}</option>`;
    })
    .join("");
  const salva = localStorage.getItem("bp_venda_loja"); // reaproveita a loja padrão já usada na aba Vendas
  if (salva && TODAS_AS_LOJAS.includes(Number(salva))) $promoLoja.value = salva;
}

// Selos usados na arte: logo do app, logo da Mersan, e o banner de campanha
// "Liquida Mais" (só entra quando o item tem preço promocional).
function carregarImagemPromo(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Os selos foram mandados com fundo sólido (cor de bloco em vez de PNG
// transparente) — aqui a gente "recorta" isso sozinho: pega a cor do
// canto da imagem como referência do fundo e apaga (alpha 0) todo pixel
// parecido com ela, deixando só o desenho/texto do logo por cima da foto.
function removerFundoSolido(img, tolerancia = 42) {
  return new Promise((resolve) => {
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const cctx = c.getContext("2d");
    cctx.drawImage(img, 0, 0);
    try {
      const imgData = cctx.getImageData(0, 0, c.width, c.height);
      const dados = imgData.data;
      const corFundo = [dados[0], dados[1], dados[2]];
      for (let i = 0; i < dados.length; i += 4) {
        const dr = dados[i] - corFundo[0];
        const dg = dados[i + 1] - corFundo[1];
        const db = dados[i + 2] - corFundo[2];
        if (Math.sqrt(dr * dr + dg * dg + db * db) < tolerancia) dados[i + 3] = 0;
      }
      cctx.putImageData(imgData, 0, 0);
    } catch (e) {
      // se der erro, segue com o fundo original em vez de travar a arte
    }
    const resultado = new Image();
    resultado.onload = () => resolve(resultado);
    resultado.src = c.toDataURL();
  });
}

// Pra logos que são só um texto/desenho claro em cima de qualquer fundo
// colorido (não só uma cor sólida) — mantém só os pixels claros (o texto)
// e apaga o resto, independente da cor do fundo.
function manterApenasClaro(img, limiar = 190) {
  return new Promise((resolve) => {
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const cctx = c.getContext("2d");
    cctx.drawImage(img, 0, 0);
    try {
      const imgData = cctx.getImageData(0, 0, c.width, c.height);
      const dados = imgData.data;
      for (let i = 0; i < dados.length; i += 4) {
        const brilho = (dados[i] + dados[i + 1] + dados[i + 2]) / 3;
        if (brilho < limiar) dados[i + 3] = 0;
      }
      cctx.putImageData(imgData, 0, 0);
    } catch (e) {
      // se der erro, segue com a imagem original em vez de travar a arte
    }
    const resultado = new Image();
    resultado.onload = () => resolve(resultado);
    resultado.src = c.toDataURL();
  });
}

// Pra logos em efeito "glow" (traço branco desbotando suavemente pro fundo
// escuro, sem um corte nítido) — vira o brilho de cada pixel em
// transparência (preto = 100% transparente, branco = opaco), preservando o
// brilho suave em vez de deixar um fundo preto quadrado ou um corte serrilhado.
function converterBrilhoEmAlpha(img) {
  return new Promise((resolve) => {
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const cctx = c.getContext("2d");
    cctx.drawImage(img, 0, 0);
    try {
      const imgData = cctx.getImageData(0, 0, c.width, c.height);
      const dados = imgData.data;
      for (let i = 0; i < dados.length; i += 4) {
        const brilho = (dados[i] + dados[i + 1] + dados[i + 2]) / 3;
        dados[i] = 255;
        dados[i + 1] = 255;
        dados[i + 2] = 255;
        dados[i + 3] = brilho;
      }
      cctx.putImageData(imgData, 0, 0);
    } catch (e) {
      // se der erro, segue com a imagem original em vez de travar a arte
    }
    const resultado = new Image();
    resultado.onload = () => resolve(resultado);
    resultado.src = c.toDataURL();
  });
}

let imgLogoMep = null;
let imgLogoMersan = null;
const logosPromoProntos = Promise.all([
  carregarImagemPromo("promo-mep-logo.png").then(img => converterBrilhoEmAlpha(img)).then(img => { imgLogoMep = img; }),
  carregarImagemPromo("promo-mersan-logo-2.jpg").then(img => manterApenasClaro(img)).then(img => { imgLogoMersan = img; }),
]).catch(() => {
  // Se algum selo não carregar, a arte ainda é gerada sem ele.
});

let promoItemAtual = null; // { produto, precoOriginal, precoFinal, temPromo, tamanhos }

async function buscarProdutoPromo(codigo) {
  codigo = (codigo || "").trim();
  if (!codigo) return;
  const loja = $promoLoja.value;
  if (!loja) return;

  $promoMsg.textContent = "Buscando produto...";
  $promoMsg.className = "msg";
  $promoInfo.classList.add("hidden");
  $promoResultadoWrap.classList.add("hidden");

  try {
    const item = await buscarPreco(codigo, loja);
    if (!item) {
      $promoMsg.textContent = "Produto não encontrado.";
      $promoMsg.className = "msg err";
      return;
    }

    const precoOriginal = item.vlPreco;
    const precoFinal = item.vlPrecoPromocao > 0 ? item.vlPrecoPromocao : item.vlPreco;
    const temPromo = item.vlPrecoPromocao > 0 && item.vlPrecoPromocao !== item.vlPreco;

    let tamanhos = [];
    let corBipada = null;
    try {
      const estData = await fetchEstoqueComRetry(`${API_BASE}/estoque/${encodeURIComponent(item.cdReferencia)}/${encodeURIComponent(loja)}`);
      const lojaNum = Number(loja);
      // Muitos produtos têm a grade de todas as cores junta na mesma
      // referência — filtra só a cor do item que foi bipado, achando a
      // linha de estoque que bate com o SKU exato lido.
      const linhaBipada = estData.find(r => r.cd_produto === item.cdSKU);
      corBipada = linhaBipada ? linhaBipada.ds_cor : null;
      tamanhos = [...new Set(
        estData
          .filter(r => r.cd_empresa === lojaNum && r.qt_stock > 0 && (!corBipada || r.ds_cor === corBipada))
          .map(r => r.ds_tamanho)
      )];
    } catch (e) {
      // segue sem grade se a consulta de estoque falhar — não impede a arte
    }

    promoItemAtual = { produto: item.dsProduto, precoOriginal, precoFinal, temPromo, tamanhos, corBipada };

    $promoProdutoNome.textContent = item.dsProduto;
    if (temPromo) {
      $promoPrecoOriginal.textContent = fmtMoeda(precoOriginal);
      $promoPrecoFinal.textContent = fmtMoeda(precoFinal);
    } else {
      $promoPrecoOriginal.textContent = "";
      $promoPrecoFinal.textContent = fmtMoeda(precoFinal);
    }
    $promoGradeTitulo.textContent = corBipada
      ? `Numerações com estoque nessa loja (cor ${corBipada}):`
      : "Numerações com estoque nessa loja:";
    $promoGradeLista.innerHTML = tamanhos.length > 0
      ? tamanhos.map(t => `<span style="display:inline-block; background:var(--bg); border:1px solid var(--border); border-radius:999px; padding:4px 10px; margin:2px; font-size:0.82rem;">${t}</span>`).join("")
      : `<span class="msg">Nenhuma numeração com estoque nessa loja.</span>`;

    $promoInfo.classList.remove("hidden");
    $promoMsg.textContent = "";
  } catch (e) {
    $promoMsg.textContent = e.mersanIndisponivel
      ? "A Mersan está instável no momento — tente de novo em alguns instantes."
      : "Erro ao buscar produto. Verifique a conexão.";
    $promoMsg.className = "msg err";
  }
}

$promoCodigoInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const codigo = $promoCodigoInput.value.trim();
  if (!codigo) return;
  buscarProdutoPromo(codigo);
});

$btnPromoBuscar.addEventListener("click", () => {
  const codigo = $promoCodigoInput.value.trim();
  if (!codigo) return;
  buscarProdutoPromo(codigo);
});

$btnPromoTirarFoto.addEventListener("click", () => $promoFotoInput.click());
$btnPromoEnviarFoto.addEventListener("click", () => $promoUploadInput.click());
$btnPromoNovaFoto.addEventListener("click", () => {
  $promoFotoInput.value = "";
  $promoFotoInput.click();
});

// Efeito retrato: desfoca o fundo, mantendo nítido um oval no centro (onde
// o produto costuma estar nas fotos tiradas na loja). Não é uma segmentação
// de verdade (isso exigiria IA/modelo de recorte) — é uma aproximação por
// máscara radial, mas funciona bem quando o produto está centralizado.
function aplicarEfeitoRetrato(ctx, w, h, intensidade = 3) {
  if (typeof ctx.filter !== "string") return; // sem suporte a filter no canvas, pula o efeito

  const nitida = document.createElement("canvas");
  nitida.width = w;
  nitida.height = h;
  nitida.getContext("2d").drawImage(ctx.canvas, 0, 0);

  // Fundo: a própria foto borrada. Intensidade vem do slider (1 a 10).
  const blurPx = Math.round(Math.min(w, h) * 0.0035 * intensidade);
  ctx.save();
  ctx.filter = `blur(${blurPx}px)`;
  ctx.drawImage(nitida, 0, 0, w, h);
  ctx.filter = "none";
  ctx.restore();

  // Recorta a versão nítida num oval central com borda suave (gradiente
  // radial controlando a transparência), e desenha por cima do fundo borrado.
  const mascarada = document.createElement("canvas");
  mascarada.width = w;
  mascarada.height = h;
  const mctx = mascarada.getContext("2d");
  mctx.drawImage(nitida, 0, 0);
  mctx.globalCompositeOperation = "destination-in";
  const cx = w / 2, cy = h / 2;
  const raioInterno = Math.min(w, h) * 0.22;
  const raioExterno = Math.min(w, h) * 0.5;
  const grad = mctx.createRadialGradient(cx, cy, raioInterno, cx, cy, raioExterno);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  mctx.fillStyle = grad;
  mctx.fillRect(0, 0, w, h);

  ctx.drawImage(mascarada, 0, 0);
}

// Aplica a correção de rotação/espelho de acordo com a tag EXIF, desenhando
// a foto já "em pé" no destino (destW x destH).
function desenharFotoOrientada(ctx, img, orientacao, destW, destH) {
  ctx.save();
  switch (orientacao) {
    case 2: ctx.translate(destW, 0); ctx.scale(-1, 1); break;
    case 3: ctx.translate(destW, destH); ctx.rotate(Math.PI); break;
    case 4: ctx.translate(0, destH); ctx.scale(1, -1); break;
    case 5: ctx.rotate(0.5 * Math.PI); ctx.scale(1, -1); break;
    case 6: ctx.rotate(0.5 * Math.PI); ctx.translate(0, -destH); break;
    case 7: ctx.rotate(0.5 * Math.PI); ctx.translate(destW, -destH); ctx.scale(-1, 1); break;
    case 8: ctx.rotate(-0.5 * Math.PI); ctx.translate(-destW, 0); break;
    default: break; // 1 (ou desconhecida): já está normal
  }
  const girado = orientacao >= 5 && orientacao <= 8;
  const larguraDesenho = girado ? destH : destW;
  const alturaDesenho = girado ? destW : destH;
  ctx.drawImage(img, 0, 0, larguraDesenho, alturaDesenho);
  ctx.restore();
}

// Usa o decodificador nativo do navegador (que entende EXIF e HEIC
// corretamente) pra já entregar a foto "em pé" — em vez de ler os bytes do
// EXIF na mão como antes, que só reconhecia JPEG e falhava silenciosamente
// em fotos HEIC (formato padrão de câmera do iPhone), deixando a foto de
// lado sem avisar nada.
function criarImagemCorrigida(file) {
  return new Promise((resolve, reject) => {
    const semCorrecao = () => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => { resolve(img); URL.revokeObjectURL(url); };
      img.onerror = reject;
      img.src = url;
    };

    if (typeof createImageBitmap !== "function") return semCorrecao();

    createImageBitmap(file, { imageOrientation: "from-image" })
      .then((bitmap) => {
        const c = document.createElement("canvas");
        c.width = bitmap.width;
        c.height = bitmap.height;
        c.getContext("2d").drawImage(bitmap, 0, 0);
        bitmap.close();
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = c.toDataURL();
      })
      // Navegador não suporta a opção "imageOrientation" — segue sem
      // corrigir em vez de travar a geração da arte.
      .catch(semCorrecao);
  });
}

function processarFotoPromo(file) {
  if (!file || !promoItemAtual) return;

  criarImagemCorrigida(file).then(async (img) => {
    await logosPromoProntos;
    promoImgAtual = img;
    // A imagem já sai corrigida (em pé) do createImageBitmap acima, então
    // não precisa mais girar de novo na hora de desenhar.
    promoOrientacaoAtual = 1;
    promoLayoutEditavel = layoutPromoPadrao();
    // Gera a arte direto com o layout padrão — editar é opcional, só quem
    // quiser ajustar posição/tamanho toca em "Editar posição".
    desenharArtePromo(img, 1, promoLayoutEditavel);
    await registrarFotoPromo();
  });
}

// Só pra contar atividade no painel "Usuários mais ativos" do admin — não
// guarda a foto em si, só que uma foi processada.
async function registrarFotoPromo() {
  if (!currentUser) return;
  const { error } = await sb.from("promo_fotos").insert({ user_id: currentUser.id, email: currentUser.email });
  if (error) console.error("Erro ao registrar foto de promoção:", error);
}

// ---------- Editor: arrastar/redimensionar nome, preço e selo (opcional,
// aberto a partir do botão "Editar posição" depois que a arte já foi
// gerada com o layout padrão) ----------

let promoImgAtual = null;
let promoOrientacaoAtual = 1;
let promoElementoAtivo = "nome";
let promoLayoutEditavel = null;
let promoArrastando = null;

// A descrição que vem da API é cheia de detalhe interno (referência, cor,
// numeração) — ex: "SANDALIA PEGADA RF 219064-06 PRETO 39". Pra arte, só
// interessa o nome do item + marca/modelo, então corta tudo a partir do
// " RF " (padrão usado em toda a descrição dos produtos). Se não achar esse
// padrão, usa a descrição inteira mesmo, sem cortar.
function nomeCurtoPromo(produto) {
  if (!produto) return "";
  const idx = produto.toUpperCase().indexOf(" RF ");
  return (idx === -1 ? produto : produto.slice(0, idx)).trim();
}

// Nome + endereço (sem cidade, pra não poluir) da loja escolhida na aba
// Promoção — usado tanto no editor quanto na arte final.
function textoLojaPromo() {
  const info = LOJAS_INFO[Number($promoLoja.value)];
  if (!info) return "";
  return `${info.nome} - ${info.endereco}`;
}

function layoutPromoPadraoFabrica() {
  return {
    nome: { xPct: 0.5, yPct: 0.12, escala: 0.85, visivel: true },
    logoMersan: { xPct: 0.02, yPct: 0.02, escala: 1, visivel: true },
    loja: { xPct: 0.5, yPct: 0.95, escala: 0.8, visivel: true },
    preco: { xPct: 0.06, yPct: 0.78, escala: 1, visivel: true },
    mep: { xPct: 0.80, yPct: 0.90, escala: 1, visivel: true },
  };
}

// Se o usuário já salvou um layout como padrão (fica no perfil, sincroniza
// entre dispositivos — igual às lojas favoritas), usa ele. Mescla com o de
// fábrica pra cobrir qualquer elemento que o layout salvo não tenha (ex: se
// um elemento novo for adicionado no app depois do usuário ter salvado).
function layoutPromoPadrao() {
  const fabrica = layoutPromoPadraoFabrica();
  const salvo = currentUser && currentUser.user_metadata && currentUser.user_metadata.promo_layout_padrao;
  if (!salvo) return fabrica;
  const layout = {};
  for (const elemento in fabrica) {
    layout[elemento] = { ...fabrica[elemento], ...(salvo[elemento] || {}) };
  }
  return layout;
}

function abrirEditorPromo() {
  if (!promoImgAtual) return;
  promoElementoAtivo = "nome";
  $promoSalvarPadraoMsg.textContent = "";

  // Mostra a foto já corrigida (em pé) no editor, do mesmo jeito que sai
  // na arte final.
  const girado = promoOrientacaoAtual >= 5 && promoOrientacaoAtual <= 8;
  const larguraNatural = girado ? promoImgAtual.naturalHeight : promoImgAtual.naturalWidth;
  const alturaNatural = girado ? promoImgAtual.naturalWidth : promoImgAtual.naturalHeight;
  const escalaPreview = Math.min(1, 700 / larguraNatural);
  const wPrev = Math.round(larguraNatural * escalaPreview);
  const hPrev = Math.round(alturaNatural * escalaPreview);
  const c = document.createElement("canvas");
  c.width = wPrev;
  c.height = hPrev;
  const cctx = c.getContext("2d");
  desenharFotoOrientada(cctx, promoImgAtual, promoOrientacaoAtual, wPrev, hPrev);
  if ($promoEfeitoRetrato.checked) aplicarEfeitoRetrato(cctx, wPrev, hPrev, Number($promoRetratoIntensidade.value));
  $promoEditorImg.src = c.toDataURL();

  const nomeChip = $promoEditorStage.querySelector('[data-elemento="nome"] .promo-chip-texto');
  nomeChip.textContent = nomeCurtoPromo(promoItemAtual.produto).toUpperCase();

  $promoChipLojaConteudo.textContent = textoLojaPromo();

  // Usa os selos já processados (fundo removido) na prévia, pra ficar
  // igual ao que sai na arte final.
  if (imgLogoMersan) $promoEditorStage.querySelector('[data-elemento="logoMersan"] img').src = imgLogoMersan.src;
  if (imgLogoMep) $promoEditorStage.querySelector('[data-elemento="mep"] img').src = imgLogoMep.src;

  const temPromo = promoItemAtual.temPromo;
  $promoChipPrecoConteudo.innerHTML = temPromo
    ? `<div style="text-decoration:line-through; opacity:.75; font-size:0.55em;">DE: ${fmtMoeda(promoItemAtual.precoOriginal)}</div>POR: ${fmtMoeda(promoItemAtual.precoFinal)}`
    : fmtMoeda(promoItemAtual.precoFinal);
  if ($promoMostrarGrade.checked && promoItemAtual.tamanhos.length > 0) {
    $promoChipPrecoConteudo.innerHTML += `<div style="font-size:0.42em; font-weight:600; margin-top:4px;">Numerações: ${promoItemAtual.tamanhos.join(" · ")}</div>`;
  }

  aplicarPosicoesChips();
  atualizarSelecaoChip();

  $promoResultadoWrap.classList.add("hidden");
  $promoEditorWrap.classList.remove("hidden");
}

function aplicarPosicoesChips() {
  Object.entries(promoLayoutEditavel).forEach(([elemento, layout]) => {
    const chip = $promoEditorStage.querySelector(`[data-elemento="${elemento}"]`);
    if (elemento === "nome" || elemento === "loja") {
      // Nome e loja ficam sempre centralizados horizontalmente — só a
      // altura e o tamanho são ajustáveis.
      chip.style.left = "50%";
      chip.style.top = (layout.yPct * 100) + "%";
      chip.style.transform = `translateX(-50%) scale(${layout.escala})`;
    } else {
      chip.style.left = (layout.xPct * 100) + "%";
      chip.style.top = (layout.yPct * 100) + "%";
      chip.style.transform = `scale(${layout.escala})`;
    }
    // Elemento removido (ou desmarcado nas opções acima, no caso dos
    // logos): continua visível (esmaecido) no editor pra dar pra selecionar
    // e restaurar, mas some da arte final.
    const desligadoPelaOpcao =
      (elemento === "logoMersan" && !$promoMostrarLogoMersan.checked) ||
      (elemento === "mep" && !$promoMostrarSeloMep.checked);
    chip.classList.toggle("removido", layout.visivel === false || desligadoPelaOpcao);
  });
}

function atualizarSelecaoChip() {
  $promoEditorStage.querySelectorAll(".promo-chip").forEach(chip => {
    chip.classList.toggle("selecionado", chip.dataset.elemento === promoElementoAtivo);
  });
  const nomes = { nome: "Nome", loja: "Loja", preco: "Preço", mep: "Selo do app", logoMersan: "Logo Mersan" };
  $promoElementoSelecionado.textContent = "Selecionado: " + nomes[promoElementoAtivo];
  const escondido = promoLayoutEditavel[promoElementoAtivo].visivel === false;
  $btnPromoRemoverElemento.textContent = escondido ? "Restaurar na arte" : "Remover da arte";
}

$promoEditorStage.querySelectorAll(".promo-chip").forEach(chip => {
  const elemento = chip.dataset.elemento;
  chip.addEventListener("pointerdown", (e) => {
    promoElementoAtivo = elemento;
    atualizarSelecaoChip();
    chip.setPointerCapture(e.pointerId);
    const rectChip = chip.getBoundingClientRect();
    promoArrastando = {
      elemento,
      offsetX: e.clientX - rectChip.left,
      offsetY: e.clientY - rectChip.top,
    };
  });
});

$promoEditorStage.addEventListener("pointermove", (e) => {
  if (!promoArrastando) return;
  const rectStage = $promoEditorStage.getBoundingClientRect();
  const layout = promoLayoutEditavel[promoArrastando.elemento];
  const y = e.clientY - rectStage.top - promoArrastando.offsetY;
  layout.yPct = Math.max(0, Math.min(1, y / rectStage.height));
  // Nome e loja ficam sempre centralizados — só arrastam na vertical.
  if (promoArrastando.elemento !== "nome" && promoArrastando.elemento !== "loja") {
    const x = e.clientX - rectStage.left - promoArrastando.offsetX;
    layout.xPct = Math.max(0, Math.min(1, x / rectStage.width));
  }
  aplicarPosicoesChips();
});
$promoEditorStage.addEventListener("pointerup", () => { promoArrastando = null; });
$promoEditorStage.addEventListener("pointercancel", () => { promoArrastando = null; });

$btnPromoMenor.addEventListener("click", () => {
  const layout = promoLayoutEditavel[promoElementoAtivo];
  layout.escala = Math.max(0.5, +(layout.escala - 0.1).toFixed(2));
  aplicarPosicoesChips();
});
$btnPromoMaior.addEventListener("click", () => {
  const layout = promoLayoutEditavel[promoElementoAtivo];
  layout.escala = Math.min(2.2, +(layout.escala + 0.1).toFixed(2));
  aplicarPosicoesChips();
});

$btnPromoRemoverElemento.addEventListener("click", () => {
  const layout = promoLayoutEditavel[promoElementoAtivo];
  layout.visivel = layout.visivel === false ? true : false;
  aplicarPosicoesChips();
  atualizarSelecaoChip();
});

$btnPromoSalvarPadrao.addEventListener("click", async () => {
  if (!currentUser) return;
  $promoSalvarPadraoMsg.textContent = "Salvando...";
  $promoSalvarPadraoMsg.className = "msg";
  const { error } = await sb.auth.updateUser({ data: { promo_layout_padrao: promoLayoutEditavel } });
  if (error) {
    $promoSalvarPadraoMsg.textContent = "Erro ao salvar: " + error.message;
    $promoSalvarPadraoMsg.className = "msg err";
    return;
  }
  // updateUser não atualiza sozinho o currentUser local — sem isso, a
  // próxima foto ainda usaria o padrão antigo até relogar.
  currentUser.user_metadata.promo_layout_padrao = promoLayoutEditavel;
  $promoSalvarPadraoMsg.textContent = "Salvo! Esse layout agora é o padrão nas próximas fotos.";
  $promoSalvarPadraoMsg.className = "msg";
});

$btnPromoCancelarEdicao.addEventListener("click", () => {
  $promoEditorWrap.classList.add("hidden");
  $promoResultadoWrap.classList.remove("hidden");
});

$btnPromoConfirmarLayout.addEventListener("click", () => {
  desenharArtePromo(promoImgAtual, promoOrientacaoAtual, promoLayoutEditavel);
  $promoEditorWrap.classList.add("hidden");
});

$btnPromoEditarPosicao.addEventListener("click", () => abrirEditorPromo());

$promoFotoInput.addEventListener("change", () => {
  processarFotoPromo($promoFotoInput.files && $promoFotoInput.files[0]);
});

$promoUploadInput.addEventListener("change", () => {
  processarFotoPromo($promoUploadInput.files && $promoUploadInput.files[0]);
});

// Quebra o texto em linhas que cabem em larguraMax (sem desenhar), limitado
// a maxLinhas — usada pra medir quantas linhas o nome do produto vai ocupar
// antes de desenhar qualquer coisa.
function quebrarTextoLinhas(ctx, texto, larguraMax, maxLinhas) {
  const palavras = texto.split(" ");
  const linhas = [];
  let linha = "";
  for (const palavra of palavras) {
    const teste = linha ? linha + " " + palavra : palavra;
    if (ctx.measureText(teste).width > larguraMax && linha) {
      linhas.push(linha);
      linha = palavra;
      if (linhas.length >= maxLinhas) return linhas;
    } else {
      linha = teste;
    }
  }
  if (linha) linhas.push(linha);
  return linhas;
}

// Detecta tom de pele (regra clássica de detecção de pele em RGB) — usado
// pra ignorar a mão segurando o produto na hora de escolher a cor
// predominante, já que só recortar o centro da foto não é suficiente (a
// mão frequentemente entra até o meio do quadro).
function corPareceMao(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return (
    r > 95 && g > 40 && b > 20 &&
    max - min > 15 &&
    Math.abs(r - g) > 15 &&
    r > g && r > b
  );
}

// Acha a cor predominante "de verdade" do produto na foto: reduz a imagem,
// ignora pixels sem saturação (parede, chão, sombra — geralmente cinza ou
// muito claro/escuro) e conta qual cor colorida aparece mais.
function corPredominante(img) {
  const tam = 60;
  const c = document.createElement("canvas");
  c.width = tam;
  c.height = tam;
  const cctx = c.getContext("2d");
  // Amostra só o centro da foto (onde o produto costuma estar) — sem isso,
  // a mão segurando o produto (que ocupa boa parte do quadro e costuma ter
  // cor mais saturada que produtos claros/pastel) podia "ganhar" a votação
  // de cor mais frequente.
  const cropPct = 0.5;
  const sx = img.naturalWidth * (1 - cropPct) / 2;
  const sy = img.naturalHeight * (1 - cropPct) / 2;
  const sw = img.naturalWidth * cropPct;
  const sh = img.naturalHeight * cropPct;
  cctx.drawImage(img, sx, sy, sw, sh, 0, 0, tam, tam);

  let dados;
  try {
    dados = cctx.getImageData(0, 0, tam, tam).data;
  } catch (e) {
    return { r: 15, g: 23, b: 42 }; // fallback: escuro padrão do app
  }

  const contagem = {};
  for (let i = 0; i < dados.length; i += 4) {
    const r = dados[i], g = dados[i + 1], b = dados[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const luz = (max + min) / 2;
    if (sat < 0.18 || luz > 235 || luz < 20) continue; // ignora fundo/sombra
    if (corPareceMao(r, g, b)) continue; // ignora tom de pele (mão segurando o produto)
    const chave = `${Math.round(r / 24) * 24},${Math.round(g / 24) * 24},${Math.round(b / 24) * 24}`;
    contagem[chave] = (contagem[chave] || 0) + 1;
  }

  let melhorChave = null, melhorCont = 0;
  for (const chave in contagem) {
    if (contagem[chave] > melhorCont) { melhorCont = contagem[chave]; melhorChave = chave; }
  }
  if (!melhorChave) return { r: 15, g: 23, b: 42 };
  const [r, g, b] = melhorChave.split(",").map(Number);
  return { r, g, b };
}

// Escolhe texto branco ou escuro dependendo do quão clara é a cor de fundo.
function corTextoContraste({ r, g, b }) {
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminancia > 0.6 ? "15,23,42" : "255,255,255";
}

// Estilo baseado nos exemplos de artes feitas à mão pra loja: nome do
// produto em destaque, uma caixinha "DE / POR" com uma linha e uma bolinha
// apontando pro produto, e o selo da campanha embaixo — sem faixa escura,
// a foto fica limpa.
function desenharArtePromo(img, orientacao = 1, layout = null) {
  layout = layout || layoutPromoPadrao();

  const girado = orientacao >= 5 && orientacao <= 8;
  const larguraNatural = girado ? img.naturalHeight : img.naturalWidth;
  const alturaNatural = girado ? img.naturalWidth : img.naturalHeight;

  const larguraMax = 1080;
  const escala = Math.min(1, larguraMax / larguraNatural);
  const w = Math.round(larguraNatural * escala);
  const h = Math.round(alturaNatural * escala);
  $promoCanvas.width = w;
  $promoCanvas.height = h;

  const ctx = $promoCanvas.getContext("2d");
  desenharFotoOrientada(ctx, img, orientacao, w, h);
  if ($promoEfeitoRetrato.checked) aplicarEfeitoRetrato(ctx, w, h, Number($promoRetratoIntensidade.value));

  // Usa a MENOR dimensão da foto como referência de escala (não sempre a
  // largura) — numa foto deitada (paisagem), a largura é bem maior que a
  // altura, e usar ela deixava tudo desproporcionalmente grande/perto.
  const base = Math.min(w, h);

  const temPromo = promoItemAtual.temPromo;
  const mostrarGrade = $promoMostrarGrade.checked && promoItemAtual.tamanhos.length > 0;

  // ---- Nome do produto — sempre centralizado horizontalmente, em cima ----
  if (layout.nome.visivel !== false) {
    const tamanhoFonteNome = Math.round(base * 0.05 * layout.nome.escala);
    const alturaLinhaNome = Math.round(tamanhoFonteNome * 1.15);
    ctx.font = `800 ${tamanhoFonteNome}px sans-serif`;
    const nomeX = w / 2;
    const linhasNome = quebrarTextoLinhas(ctx, nomeCurtoPromo(promoItemAtual.produto).toUpperCase(), w * 0.85, 3);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.65)";
    ctx.shadowBlur = base * 0.012;
    ctx.shadowOffsetY = base * 0.004;
    const nomeYBase = layout.nome.yPct * h;
    linhasNome.forEach((linha, i) => ctx.fillText(linha, nomeX, nomeYBase + (i + 1) * alturaLinhaNome));
    ctx.shadowColor = "transparent";
    ctx.textAlign = "left";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }

  // ---- Logo da Mersan (posição/tamanho escolhidos no editor) ----
  if (imgLogoMersan && layout.logoMersan.visivel !== false && $promoMostrarLogoMersan.checked) {
    const largLogo = Math.round(base * 0.16 * layout.logoMersan.escala);
    const altLogo = Math.round(largLogo * (imgLogoMersan.naturalHeight / imgLogoMersan.naturalWidth));
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = base * 0.012;
    ctx.drawImage(imgLogoMersan, layout.logoMersan.xPct * w, layout.logoMersan.yPct * h, largLogo, altLogo);
    ctx.restore();
  }

  // ---- Caixinha DE / POR, seta e grade de numerações ----
  const precoVisivel = layout.preco.visivel !== false;
  const boxAlturaLinha = Math.round(base * 0.058 * layout.preco.escala);
  const boxPad = Math.round(base * 0.03 * layout.preco.escala);
  const tamanhoFontePor = Math.round(boxAlturaLinha * 0.72);
  const tamanhoFonteDe = Math.round(boxAlturaLinha * 0.58);
  const tamanhoFonteParcelamento = Math.round(boxAlturaLinha * 0.42);
  const passoParcelamento = Math.round(tamanhoFontePor * 0.95);

  // Parcelamento sem juros: número de parcelas calculado sozinho (nunca
  // deixa a parcela abaixo de R$ 40, até 10x) — calcularParcelamento vem do
  // calc.js e é testada isolada em calc.test.js.
  const parcelamentoInfo = calcularParcelamento(promoItemAtual.precoFinal);
  const parcelamentoVisivel = precoVisivel && $promoMostrarParcelamento.checked && parcelamentoInfo.parcelas >= 2;

  const boxAltura = (temPromo ? boxAlturaLinha * 2 : boxAlturaLinha)
    + (parcelamentoVisivel ? passoParcelamento : 0)
    + boxPad * 1.6;
  const boxX = Math.round(layout.preco.xPct * w);
  const boxY = Math.round(layout.preco.yPct * h);
  const gradeVisivel = precoVisivel && mostrarGrade;
  const tamanhoFonteGrade = Math.round(base * 0.034 * layout.preco.escala);
  const gradeEspaco = Math.round(base * 0.014);
  const gradeAlturaBolinha = Math.round(tamanhoFonteGrade * 1.7);
  const gradeY = boxY + boxAltura + Math.round(base * 0.045 * layout.preco.escala);

  // Calcula a posição de cada numeração como uma "bolinha" (pílula) própria,
  // quebrando pra próxima linha quando não cabe mais na largura disponível
  // — feito antes de desenhar pra já saber a altura total ocupada (usada
  // depois pra desviar o endereço da loja de baixo).
  let gradeItens = [];
  let gradeAltura = 0;
  if (gradeVisivel) {
    ctx.font = `800 ${tamanhoFonteGrade}px sans-serif`;
    const larguraMaxLinha = w - boxX - Math.round(base * 0.04);
    let cx = boxX;
    let cy = gradeY + gradeAlturaBolinha / 2;
    promoItemAtual.tamanhos.forEach((tam) => {
      const largTexto = ctx.measureText(tam).width;
      const largBolinha = Math.max(gradeAlturaBolinha, largTexto + tamanhoFonteGrade * 0.9);
      if (cx > boxX && cx + largBolinha > boxX + larguraMaxLinha) {
        cx = boxX;
        cy += gradeAlturaBolinha + gradeEspaco;
      }
      gradeItens.push({ texto: tam, x: cx, y: cy, largura: largBolinha });
      cx += largBolinha + gradeEspaco;
    });
    gradeAltura = (cy + gradeAlturaBolinha / 2) - gradeY;
  }

  if (precoVisivel) {
    ctx.font = `800 ${tamanhoFontePor}px sans-serif`;
    const textoPor = (temPromo ? "POR: " : "") + fmtMoeda(promoItemAtual.precoFinal);
    const largTextoPor = ctx.measureText(textoPor).width;
    ctx.font = `700 ${tamanhoFonteDe}px sans-serif`;
    const textoDe = temPromo ? "DE: " + fmtMoeda(promoItemAtual.precoOriginal) : "";
    const largTextoDe = temPromo ? ctx.measureText(textoDe).width : 0;
    const textoParcelamento = parcelamentoVisivel
      ? `${parcelamentoInfo.parcelas}x de ${fmtMoeda(parcelamentoInfo.valorParcela)} sem juros`
      : "";
    ctx.font = `700 ${tamanhoFonteParcelamento}px sans-serif`;
    const largTextoParcelamento = parcelamentoVisivel ? ctx.measureText(textoParcelamento).width : 0;
    const boxLargura = Math.round(Math.max(largTextoPor, largTextoDe, largTextoParcelamento) + boxPad * 2);

    // Vermelho na promoção; preço normal usa a cor predominante da foto.
    const corBox = temPromo ? { r: 200, g: 25, b: 30 } : corPredominante(img);
    const corTextoRGB = corTextoContraste(corBox);
    const corTextoPrincipal = `rgb(${corTextoRGB})`;
    const corTextoSecundario = `rgba(${corTextoRGB},0.78)`;

    ctx.fillStyle = `rgba(${corBox.r},${corBox.g},${corBox.b},0.93)`;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(boxX, boxY, boxLargura, boxAltura, 10);
    else ctx.rect(boxX, boxY, boxLargura, boxAltura);
    ctx.fill();

    let textoY = boxY + boxPad;
    ctx.textBaseline = "top";
    if (temPromo) {
      ctx.font = `700 ${tamanhoFonteDe}px sans-serif`;
      ctx.fillStyle = corTextoSecundario;
      ctx.fillText(textoDe, boxX + boxPad, textoY);
      // Risco no meio do preço antigo, indicando que não vale mais.
      const meioDe = textoY + tamanhoFonteDe / 2;
      ctx.strokeStyle = corTextoSecundario;
      ctx.lineWidth = Math.max(1.5, base * 0.003);
      ctx.beginPath();
      ctx.moveTo(boxX + boxPad, meioDe);
      ctx.lineTo(boxX + boxPad + largTextoDe, meioDe);
      ctx.stroke();
      textoY += boxAlturaLinha;
    }
    ctx.font = `800 ${tamanhoFontePor}px sans-serif`;
    ctx.fillStyle = corTextoPrincipal;
    ctx.fillText(textoPor, boxX + boxPad, textoY);

    if (parcelamentoVisivel) {
      textoY += passoParcelamento;
      ctx.font = `700 ${tamanhoFonteParcelamento}px sans-serif`;
      ctx.fillStyle = corTextoSecundario;
      ctx.fillText(textoParcelamento, boxX + boxPad, textoY);
    }

    // Linha com bolinha, saindo da caixinha (efeito de etiqueta de preço).
    const linhaX1 = boxX + boxPad * 1.2;
    const linhaY1 = boxY + boxAltura;
    const linhaX2 = linhaX1 + base * 0.035;
    const linhaY2 = linhaY1 + base * 0.03;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = Math.max(1.5, base * 0.0025);
    ctx.beginPath();
    ctx.moveTo(linhaX1, linhaY1);
    ctx.lineTo(linhaX2, linhaY2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(linhaX2, linhaY2, Math.max(3, base * 0.0055), 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // ---- Grade (numerações com estoque) — cada tamanho na sua própria
    // "bolinha" (pílula), pra destacar mais que um texto corrido só ----
    if (gradeVisivel) {
      ctx.font = `800 ${tamanhoFonteGrade}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      gradeItens.forEach((item) => {
        ctx.fillStyle = `rgba(${corBox.r},${corBox.g},${corBox.b},0.93)`;
        ctx.beginPath();
        const raio = gradeAlturaBolinha / 2;
        if (ctx.roundRect) ctx.roundRect(item.x, item.y - raio, item.largura, gradeAlturaBolinha, raio);
        else ctx.rect(item.x, item.y - raio, item.largura, gradeAlturaBolinha);
        ctx.fill();
        ctx.fillStyle = corTextoPrincipal;
        ctx.fillText(item.texto, item.x + item.largura / 2, item.y + 1);
      });
      ctx.textAlign = "left";
    }
  }

  // ---- Loja (nome + endereço, curto) — sempre centralizada, perto do
  // rodapé. Desenhada por último pra poder desviar da grade de numerações
  // quando as duas acabam caindo na mesma altura (a grade é posicionada
  // relativa à caixinha de preço, que pode ser arrastada pra qualquer lugar).
  const textoLoja = textoLojaPromo();
  if (textoLoja && layout.loja.visivel !== false) {
    const tamanhoFonteLoja = Math.round(base * 0.028 * layout.loja.escala);
    let lojaY = layout.loja.yPct * h;
    if (gradeVisivel) {
      const margemMinima = tamanhoFonteLoja * 1.4;
      const gradeBaixo = gradeY + gradeAltura;
      if (lojaY < gradeBaixo + margemMinima) {
        lojaY = Math.min(h - tamanhoFonteLoja * 0.6, gradeBaixo + margemMinima);
      }
    }
    ctx.font = `600 ${tamanhoFonteLoja}px sans-serif`;
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.65)";
    ctx.shadowBlur = base * 0.008;
    ctx.textAlign = "center";
    ctx.fillText(textoLoja, w / 2, lojaY);
    ctx.textAlign = "left";
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

  // ---- Selo do app (MEP), posição/tamanho escolhidos no editor ----
  if (imgLogoMep && layout.mep.visivel !== false && $promoMostrarSeloMep.checked) {
    const lado = Math.round(base * 0.09 * layout.mep.escala);
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = base * 0.01;
    ctx.drawImage(imgLogoMep, layout.mep.xPct * w, layout.mep.yPct * h, lado, lado);
    ctx.restore();
  }

  $promoResultadoWrap.classList.remove("hidden");
  $btnPromoCompartilhar.classList.toggle("hidden", !(navigator.canShare));
}

$btnPromoBaixar.addEventListener("click", () => {
  $promoCanvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `promocao-${($promoCodigoInput.value || "produto").trim()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
});

$btnPromoCompartilhar.addEventListener("click", () => {
  $promoCanvas.toBlob(async (blob) => {
    const file = new File([blob], "promocao.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Promoção" });
      } catch (e) {
        // usuário cancelou o compartilhamento — sem problema
      }
    }
  }, "image/png");
});

// Registra o service worker: guarda o "shell" do app (HTML/manifest/ícones)
// em cache, então abrir de novo é instantâneo mesmo com internet ruim.
// Preço e estoque continuam sempre buscados ao vivo, nunca do cache.
//
// Também detecta quando uma nova versão do app foi publicada e recarrega
// a página sozinho, sem o usuário precisar apertar F5/atualizar.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("sw.js");

      // Verifica se tem versão nova a cada 60s enquanto o app estiver aberto
      setInterval(() => reg.update().catch(() => {}), 60000);

      let jaRecarregou = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (jaRecarregou) return;
        jaRecarregou = true;
        window.location.reload();
      });
    } catch (e) {
      console.error(e);
    }
  });
}
