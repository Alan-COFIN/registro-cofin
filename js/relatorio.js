/* ============================================================
   relatorio.js — aba "Relatório" (RIT mensal) + export .txt
   ============================================================ */

const Relatorio = {
  gerar() {
    const mes = document.getElementById('rel-mes').value; // formato YYYY-MM
    if (!mes) { showToast('Selecione o mês.'); return; }

    const doMes = App.state.registros
      .filter(r => (r.data || '').startsWith(mes))
      .sort((a, b) => (a.data || '').localeCompare(b.data || ''));

    // Agrupa por entrega oficial do PIT/SUAP, listando cada atividade
    // individualmente (não apenas a contagem por tipo).
    const porEntrega = {};
    doMes.forEach(r => {
      const entrega = r.pitOficial || PIT_MAP[r.tipo] || r.tipo;
      if (!porEntrega[entrega]) porEntrega[entrega] = [];
      porEntrega[entrega].push(r);
    });

    const [ano, mm] = mes.split('-');
    let texto =
      `RELATÓRIO INDIVIDUAL DE TRABALHO (RIT)\n` +
      `Período: ${mm}/${ano}\n` +
      `Total de registros: ${doMes.length}\n` +
      `Supervisão: Alan Ferreira do Nascimento (todas as atividades abaixo)\n\n`;

    Object.keys(porEntrega).forEach(entrega => {
      const regs = porEntrega[entrega];
      texto += `ENTREGA: ${entrega}\n`;
      regs.forEach(r => {
        const nomeResp = (RESPONSAVEIS.find(p => p.id === r.responsavel) || {}).nome || 'Não informado';
        texto += `- ${r.data} | SEI ${r.sei || '—'}${r.campus ? ' | ' + r.campus : ''} | Executado por: ${nomeResp}\n`;
        if (r.atividades) texto += `  Atividades: ${r.atividades}\n`;
        if (r.detalhes) texto += `  Detalhes: ${r.detalhes}\n`;
      });
      texto += '\n';
    });

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
