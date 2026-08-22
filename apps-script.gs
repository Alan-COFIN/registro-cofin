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

const TOKEN = 'COLE_AQUI_O_MESMO_TOKEN_DO_sync.js';
const SHEET_REGISTROS = 'Registros';
const SHEET_CONFIG = 'Config';

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');

  // Verificação de segurança: sem o token correto, a requisição é recusada.
  if (body.token !== TOKEN) {
    return resposta({ status: 'erro', msg: 'token inválido' });
  }

  if (body.action === 'save_registro') return salvarRegistro(body.registro);
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

function salvarRegistro(reg) {
  const sh = getSheet(SHEET_REGISTROS);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['id', 'data', 'sei', 'tipo', 'campus', 'responsavel', 'atividades', 'detalhes', 'criadoEm']);
  }
  sh.appendRow([
    reg.id, reg.data, reg.sei, reg.tipo, reg.campus,
    reg.responsavel, reg.atividades, reg.detalhes, reg.criadoEm
  ]);
  return resposta({ status: 'ok' });
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
