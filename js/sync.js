/* ============================================================
   sync.js — integração com Google Apps Script (Google Sheets).

   IMPORTANTE — antes de usar:
   1) Publique o apps-script.gs como Web App no seu Google Sheets
      (Extensões > Apps Script > Implantar > Nova implantação).
   2) Cole a URL gerada em SHEETS_URL abaixo.
   3) Defina um TOKEN secreto aqui E no mesmo valor dentro do
      apps-script.gs (constante TOKEN). Sem isso, qualquer pessoa
      que veja o código público do repositório poderia chamar o
      endpoint e ler ou sobrescrever seus dados.
   ============================================================ */

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwVqHOUsxdVUfzYCm4M4Iaq0_ZDRqfEDG0v1G2fJLcopdmq2tqpIdZK_5sDOAo7nucR1g/exec';
const SYNC_TOKEN = '@System10#*';

const Sync = {
  _configurado() {
    return SHEETS_URL && SHEETS_URL.indexOf('COLE_AQUI') === -1;
  },

  setStatus(state, msg) {
    const el = document.getElementById('sync-status');
    if (!el) return;
    el.className = 'sync-status sync-' + state;
    el.textContent = msg;
  },

  async _post(body) {
    const resp = await fetch(SHEETS_URL, {
      method: 'POST',
      body: JSON.stringify(Object.assign({ token: SYNC_TOKEN }, body))
    });
    return resp.json();
  },

  // Busca todos os registros da nuvem e mescla com os locais (por id),
  // para que o histórico apareça igual em qualquer navegador.
  async baixarRegistros({ force = false, silent = false } = {}) {
    if (!this._configurado()) {
      if (!silent) showToast('Configure SHEETS_URL antes de sincronizar.');
      return;
    }
    if (!silent) this.setStatus('ing', 'Baixando registros...');
    try {
      const d = await this._post({ action: 'load_registros' });
      if (d.status === 'ok' && Array.isArray(d.registros)) {
        const locais = App.state.registros;
        const idsLocais = new Set(locais.map(r => r.id));
        let novos = 0;
        d.registros.forEach(remoto => {
          if (!idsLocais.has(remoto.id)) {
            remoto.synced = true;
            locais.push(remoto);
            novos++;
          }
        });
        locais.sort((a, b) => (b.data || '').localeCompare(a.data || ''));
        Storage.setRegistros(locais);
        if (novos > 0 || force) Historico.render();
        this.setStatus('ok', novos ? `${novos} registro(s) novos` : 'Registros em dia');
      }
    } catch (e) {
      this.setStatus('err', 'Sem conexão com a nuvem');
    }
  },

  // Envia um registro individual (histórico) para a planilha
  async enviarRegistro(reg) {
    if (!this._configurado()) return;
    this.setStatus('ing', 'Salvando na nuvem...');
    try {
      const d = await this._post({ action: 'save_registro', registro: reg });
      if (d.status === 'ok') {
        this.setStatus('ok', 'Salvo na nuvem');
        reg.synced = true;
        Storage.setRegistros(App.state.registros);
      } else {
        this.setStatus('err', 'Erro: ' + (d.msg || 'desconhecido'));
      }
    } catch (e) {
      this.setStatus('err', 'Sem conexão — salvo só localmente');
    }
  },

  // Sobe a config local para a nuvem (usar com cuidado: sobrescreve)
  async enviarConfig(config) {
    if (!this._configurado()) return;
    const updatedAt = Date.now();
    try {
      await this._post({ action: 'save_config', config: JSON.stringify(config), updated_at: updatedAt });
      Storage.setConfig(config, updatedAt);
    } catch (e) {
      Storage.setConfig(config, updatedAt);
    }
  },

  // Busca a config da nuvem. Se remoteUpdatedAt > local, avisa em vez
  // de sobrescrever silenciosamente (a menos que force=true).
  async sincronizarConfig({ force = false, silent = false } = {}) {
    if (!this._configurado()) {
      if (!silent) showToast('Configure SHEETS_URL antes de sincronizar.');
      return;
    }
    if (!silent) this.setStatus('ing', 'Sincronizando...');
    try {
      const d = await this._post({ action: 'load_config' });
      if (d.status === 'ok' && d.config) {
        const remoto = JSON.parse(d.config);
        const remotoUpdatedAt = Number(d.updated_at || 0);
        const localUpdatedAt = Storage.getConfigUpdatedAt();

        if (!force && remotoUpdatedAt < localUpdatedAt) {
          // versão local é mais nova que a nuvem: não sobrescreve, avisa
          this.setStatus('err', 'Config local mais recente — envie antes de puxar');
          if (!silent) {
            showToast('Sua config local é mais nova que a da nuvem. Use "Enviar config" para não perder suas alterações.');
          }
          return { conflict: true };
        }

        App.state.config = remoto;
        Storage.setConfig(remoto, remotoUpdatedAt);
        UI.renderConfig();
        UI.popularSelectTipo();
        this.setStatus('ok', 'Config sincronizada');
      } else {
        // nada na nuvem ainda: envia a config local como inicial
        await this.enviarConfig(App.state.config);
        this.setStatus('ok', 'Config enviada (nuvem estava vazia)');
      }
    } catch (e) {
      this.setStatus('err', 'Sem conexão com a nuvem');
    }
  }
};
