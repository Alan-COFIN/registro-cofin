/* ============================================================
   historico.js — aba "Histórico" (lista, filtros, edição,
   exclusão e resumo por responsável)
   ============================================================ */

const Historico = {
  filtrados() {
    const de = document.getElementById('f-de').value;
    const ate = document.getElementById('f-ate').value;
    const tipo = document.getElementById('f-tipo').value;
    const resp = document.getElementById('f-responsavel').value;

    return App.state.registros.filter(r => {
      if (de && r.data < de) return false;
      if (ate && r.data > ate) return false;
      if (tipo && r.tipo !== tipo) return false;
      if (resp && r.responsavel !== resp) return false;
      return true;
    });
  },

  render() {
    const lista = this.filtrados();
    const box = document.getElementById('lista-registros');
    box.innerHTML = lista.map(r => {
      const nomeResp = (RESPONSAVEIS.find(p => p.id === r.responsavel) || {}).nome || '—';
      return `
      <div class="reg-card">
        <div class="reg-head">
          <span class="reg-tipo">${r.tipo}</span>
          <span class="reg-data">${r.data}</span>
        </div>
        <div class="reg-body">
          <div><strong>SEI:</strong> ${r.sei || '—'}</div>
          <div><strong>Campus:</strong> ${r.campus || '—'}</div>
          <div><strong>Entrega PIT/SUAP:</strong> ${r.pitOficial || '—'}</div>
          <div><strong>Executado por:</strong> ${nomeResp} <span class="opcional">(supervisão: Alan)</span></div>
          ${r.atividades ? `<div><strong>Atividades:</strong> ${r.atividades}</div>` : ''}
          ${r.detalhes ? `<div><strong>Detalhes:</strong> ${r.detalhes}</div>` : ''}
        </div>
        <div class="reg-actions">
          <button class="btn-link" onclick="Historico.excluir('${r.id}')">excluir</button>
          <span class="sync-tag">${r.synced ? '● nuvem' : '○ local'}</span>
        </div>
      </div>`;
    }).join('') || '<p class="empty">Nenhum registro encontrado para este filtro.</p>';

    this.renderResumoPorResponsavel(lista);
  },

  renderResumoPorResponsavel(lista) {
    const box = document.getElementById('resumo-responsavel');
    if (!box) return;
    const contagem = {};
    lista.forEach(r => {
      const key = r.responsavel || 'nao_informado';
      contagem[key] = (contagem[key] || 0) + 1;
    });
    box.innerHTML = Object.keys(contagem).map(k => {
      const nome = (RESPONSAVEIS.find(p => p.id === k) || {}).nome || 'Não informado';
      return `<span class="chip">${nome}: ${contagem[k]}</span>`;
    }).join(' ');
  },

  excluir(id) {
    if (!confirm('Excluir este registro?')) return;
    App.state.registros = App.state.registros.filter(r => r.id !== id);
    Storage.setRegistros(App.state.registros);
    this.render();
  },

  popularFiltroTipo() {
    const s = document.getElementById('f-tipo');
    s.innerHTML = '<option value="">Todos os tipos</option>';
    App.state.config.forEach(c => {
      const o = document.createElement('option');
      o.value = c.tipo; o.textContent = c.tipo;
      s.appendChild(o);
    });
  },
  popularFiltroResponsavel() {
    const s = document.getElementById('f-responsavel');
    s.innerHTML = '<option value="">Todos</option>';
    RESPONSAVEIS.forEach(r => {
      const o = document.createElement('option');
      o.value = r.id; o.textContent = r.nome;
      s.appendChild(o);
    });
  }
};
