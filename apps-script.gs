/* ============================================================
   apps-script.gs
   Cole este código em Extensões > Apps Script, na planilha que
   vai guardar os registros e a configuração.

   PASSO A PASSO:
   1) Extensões > Apps Script > apague o conteúdo padrão e cole
      este arquivo inteiro.
   2) Troque TOKEN abaixo por um valor secreto seu (qualquer
      texto difícil de adivinhar).
   3) Implantar > Nova implantação > tipo "App da Web".
      - Executar como: Eu
      - Quem pode acessar: Qualquer pessoa
   4) Copie a URL gerada e cole em SHEETS_URL no js/sync.js.
   5) Cole o MESMO token em SYNC_TOKEN no js/sync.js.
   ============================================================ */

const TOKEN = '@System10#*';
const SHEET_REGISTROS = 'Registros';
const SHEET_CONFIG = 'Config';

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');

  // Verificação de segurança: sem o token correto, a requisição é recusada.
  if (body.token !== TOKEN) {
    return resposta({ status: 'erro', msg: 'token inválido' });
  }

  if (body.action === 'save_registro') return salvarRegistro(body.registro);
  if (body.action === 'load_registros') return carregarRegistros();
  if (body.action === 'save_config') return salvarConfig(body.config, body.updated_at);
  if (body.action === 'load_config') return carregarConfig();

  return resposta({ status: 'erro', msg: 'ação desconhecida' });
}

function getSheet(nome) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nome);
  if (!sh) sh = ss.insertSheet(nome);
  return sh;
}

const COLUNAS_REGISTRO = ['id', 'data', 'sei', 'tipo', 'campus', 'responsavel', 'pitOficial', 'supervisor', 'atividades', 'detalhes', 'criadoEm'];

function salvarRegistro(reg) {
  const sh = getSheet(SHEET_REGISTROS);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUNAS_REGISTRO);
  }
  sh.appendRow(COLUNAS_REGISTRO.map(c => reg[c] !== undefined ? reg[c] : ''));
  return resposta({ status: 'ok' });
}

function carregarRegistros() {
  const sh = getSheet(SHEET_REGISTROS);
  const linhas = sh.getDataRange().getValues();
  if (linhas.length < 2) return resposta({ status: 'ok', registros: [] });
  const cabecalho = linhas[0];
  const registros = linhas.slice(1).map(linha => {
    const obj = {};
    cabecalho.forEach((col, i) => { obj[col] = linha[i]; });
    return obj;
  });
  return resposta({ status: 'ok', registros });
}

function salvarConfig(configJson, updatedAt) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('config', configJson);
  props.setProperty('config_updated_at', String(updatedAt || Date.now()));
  return resposta({ status: 'ok' });
}

function carregarConfig() {
  const props = PropertiesService.getScriptProperties();
  const config = props.getProperty('config');
  const updatedAt = props.getProperty('config_updated_at');
  return resposta({ status: 'ok', config: config || null, updated_at: Number(updatedAt || 0) });
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
