/* ============================================================
   storage.js — camada única de acesso ao localStorage.
   Nenhum outro módulo deve chamar localStorage diretamente.
   ============================================================ */

const KEYS = {
  CONFIG: 'rc_config',
  CONFIG_UPDATED_AT: 'rc_config_updated_at',
  REGISTROS: 'rc_registros',
  PIT: 'rc_pit',
  CAMPUS_PADRAO: 'rc_campus_padrao'
};

const Storage = {
  getConfig() {
    const raw = localStorage.getItem(KEYS.CONFIG);
    return raw ? JSON.parse(raw) : structuredClone(DEFAULT_CONFIG);
  },
  setConfig(config, updatedAt) {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
    localStorage.setItem(KEYS.CONFIG_UPDATED_AT, String(updatedAt || Date.now()));
  },
  getConfigUpdatedAt() {
    return Number(localStorage.getItem(KEYS.CONFIG_UPDATED_AT) || 0);
  },

  getRegistros() {
    const raw = localStorage.getItem(KEYS.REGISTROS);
    return raw ? JSON.parse(raw) : [];
  },
  setRegistros(registros) {
    localStorage.setItem(KEYS.REGISTROS, JSON.stringify(registros));
  },

  getPit() {
    const raw = localStorage.getItem(KEYS.PIT);
    return raw ? JSON.parse(raw) : [];
  },
  setPit(pit) {
    localStorage.setItem(KEYS.PIT, JSON.stringify(pit));
  },

  getCampusPadrao() {
    return localStorage.getItem(KEYS.CAMPUS_PADRAO) || '';
  },
  setCampusPadrao(v) {
    localStorage.setItem(KEYS.CAMPUS_PADRAO, v || '');
  }
};
