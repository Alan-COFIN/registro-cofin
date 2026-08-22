/* ============================================================
   relatorio.js — aba "Relatório" (RIT mensal) + export .txt
   ============================================================ */

const Relatorio = {
  gerar() {
    const mes = document.getElementById('rel-mes').value; // formato YYYY-MM
    if (!mes) { showToast('Selecione o mês.'); return; }

    const doMes = App.state.registros.filter(r => (r.data || '').startsWith(mes));
    const porTipo = {};
    doMes.forEach(r => {
      const nomeOficial = PIT_MAP[r.tipo] || r.tipo;
      porTipo[nomeOficial] = (porTipo[nomeOficial] || 0) + 1;
    });

    const linhas = Object.keys(porTipo)
      .sort((a, b) => porTipo[b] - porTipo[a])
      .map(k => `- ${k} (${porTipo[k]}x)`);

    const [ano, mm] = mes.split('-');
    const texto =
      `RELATÓRIO INDIVIDUAL DE TRABALHO (RIT)\n` +
      `Período: ${mm}/${ano}\n` +
      `Total de registros: ${doMes.length}\n\n` +
      `Atividades desempenhadas:\n` +
      linhas.join('\n');

    document.getElementById('rel-texto').textContent = texto;
    document.getElementById('rel-cards').style.display = 'block';
    this._ultimoTexto = texto;
    this._ultimoMes = mes;
  },

  copiar() {
    if (!this._ultimoTexto) return;
    navigator.clipboard.writeText(this._ultimoTexto);
    showToast('Relatório copiado.');
  },

  baixarTxt() {
    if (!this._ultimoTexto) { showToast('Gere o relatório primeiro.'); return; }
    const blob = new Blob([this._ultimoTexto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RIT_${this._ultimoMes}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
};
