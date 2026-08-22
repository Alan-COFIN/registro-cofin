/* ============================================================
   main.js — estado global (App) e inicialização da página
   ============================================================ */

const App = {
  state: {
    config: [],
    registros: [],
    pit: []
  },

  today() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  },

  persistConfig() {
    Storage.setConfig(this.state.config, Date.now());
    Sync.enviarConfig(this.state.config);
  },

  init() {
    this.state.config = Storage.getConfig();
    this.state.registros = Storage.getRegistros();
    this.state.pit = Storage.getPit();

    document.getElementById('data').value = this.today();
    const relMes = document.getElementById('rel-mes');
    const now = new Date();
    relMes.value = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    UI.popularSelectCampus();
    UI.popularSelectTipo();
    UI.popularSelectResponsavel(document.getElementById('responsavel'));
    Registro.popularSelectPitOverride();
    UI.renderConfig();

    Historico.popularFiltroTipo();
    Historico.popularFiltroResponsavel();
    Historico.render();

    Pit.render();

    // Campus padrão salvo
    const campusPadrao = Storage.getCampusPadrao();
    if (campusPadrao) document.getElementById('campus').value = campusPadrao;

    // Puxa config e registros da nuvem (silencioso; avisa só se houver conflito real)
    Sync.sincronizarConfig({ silent: true });
    Sync.baixarRegistros({ silent: true });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
