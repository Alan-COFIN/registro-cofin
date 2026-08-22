/* ============================================================
   sei.js — sugestão automática de tipo/campus a partir do
   histórico de processos SEI já registrados por você.
   Não usa nenhuma IA externa: é correlação local dos seus
   próprios dados (mesmo processo tende a repetir o fluxo).
   ============================================================ */

const Sei = {
  // Normaliza um número de processo SEI para comparação
  // (remove espaços; mantém o número completo, pois o mesmo
  // processo é o mesmo número em todas as etapas do fluxo)
  normalizar(sei) {
    return (sei || '').replace(/\s+/g, '').trim();
  },

  // Retorna todos os registros anteriores com o mesmo nº de processo,
  // mais recentes primeiro
  historicoDoProcesso(sei, registros) {
    const alvo = this.normalizar(sei);
    if (!alvo) return [];
    return registros
      .filter(r => this.normalizar(r.sei) === alvo)
      .sort((a, b) => (b.data || '').localeCompare(a.data || ''));
  },

  // Sugere tipo/campus/responsável com base no último registro
  // do mesmo processo. Retorna null se não houver histórico.
  sugerir(sei, registros) {
    const hist = this.historicoDoProcesso(sei, registros);
    if (!hist.length) return null;
    const ultimo = hist[0];
    return {
      tipo: ultimo.tipo,
      campus: ultimo.campus,
      responsavel: ultimo.responsavel,
      qtdAnterior: hist.length,
      ultimaData: ultimo.data
    };
  }
};
