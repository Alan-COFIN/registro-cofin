/* ============================================================
   ui.js — helpers de interface compartilhados: abas, toast,
   modais e renderização da aba Configurações.
   ============================================================ */

const UI = {
  showTab(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (btn) btn.classList.add('active');
    if (id === 'config') {
      this.renderConfig(); // garante que reflita qualquer edição feita em outra aba
      Sync.sincronizarConfig({ silent: true });
    }
  },

  popularSelectTipo() {
    const s = document.getElementById('tipo');
    if (!s) return;
    const atual = s.value;
    s.innerHTML = '<option value="">- Selecione o tipo -</option>';
    App.state.config.forEach(c => {
      const o = document.createElement('option');
      o.value = c.tipo;
      o.textContent = c.tipo;
      s.appendChild(o);
    });
    if (atual) s.value = atual;
  },

  popularSelectCampus() {
    const s = document.getElementById('campus');
    if (!s) return;
    s.innerHTML = '<option value="">- Selecione -</option>';
    CAMPI.forEach(c => {
      const o = document.createElement('option');
      o.value = c; o.textContent = c;
      s.appendChild(o);
    });
  },

  popularSelectResponsavel(selectEl, selecionado) {
    selectEl.innerHTML = '';
    RESPONSAVEIS.forEach(r => {
      const o = document.createElement('option');
      o.value = r.id;
      o.textContent = r.nome;
      if (r.id === selecionado) o.selected = true;
      selectEl.appendChild(o);
    });
  },

  renderConfig() {
    const box = document.getElementById('config-lista');
    if (!box) return;
    box.innerHTML = '';
    App.state.config.forEach((c, ci) => {
      const div = document.createElement('div');
      div.className = 'cfg-tipo';
      div.innerHTML = `
        <div class="cfg-head">
          <strong>${c.tipo}</strong>
          <button class="btn-link" onclick="UI.removerTipo(${ci})">excluir tipo</button>
        </div>
        <div class="cfg-atividades" id="cfg-atv-${ci}"></div>
        <div class="cfg-add">
          <input type="text" id="cfg-novo-${ci}" placeholder="Nova atividade...">
          <button class="btn-sec" onclick="UI.addAtividade(${ci})">+ atividade</button>
        </div>`;
      box.appendChild(div);
      this.renderAtividadesConfig(ci);
    });
  },

  renderAtividadesConfig(ci) {
    const box = document.getElementById('cfg-atv-' + ci);
    if (!box) return;
    const c = App.state.config[ci];
    box.innerHTML = c.atividades.map((a, ai) => `
      <div class="cfg-atv-row">
        <input type="text" value="${a.texto.replace(/"/g, '&quot;')}"
               onchange="UI.editarAtividade(${ci},${ai},this.value)">
        <button class="tgl ${a.padrao ? 'on' : ''}" onclick="UI.toggleAtivPadrao(${ci},${ai})">
          ${a.padrao ? 'padrão' : 'opcional'}
        </button>
        <button class="btn-link" onclick="UI.removerAtividade(${ci},${ai})">remover</button>
      </div>`).join('');
  },

  editarAtividade(ci, ai, novoTexto) {
    App.state.config[ci].atividades[ai].texto = novoTexto.trim();
    App.persistConfig();
  },
  toggleAtivPadrao(ci, ai) {
    const a = App.state.config[ci].atividades[ai];
    a.padrao = !a.padrao;
    App.persistConfig();
    this.renderAtividadesConfig(ci);
  },
  removerAtividade(ci, ai) {
    App.state.config[ci].atividades.splice(ai, 1);
    App.persistConfig();
    this.renderAtividadesConfig(ci);
  },
  addAtividade(ci) {
    const inp = document.getElementById('cfg-novo-' + ci);
    const texto = inp.value.trim();
    if (!texto) return;
    App.state.config[ci].atividades.push({ texto, padrao: false });
    inp.value = '';
    App.persistConfig();
    this.renderAtividadesConfig(ci);
  },
  removerTipo(ci) {
    if (!confirm('Excluir este tipo de demanda e todas as suas atividades?')) return;
    App.state.config.splice(ci, 1);
    App.persistConfig();
    this.renderConfig();
    this.popularSelectTipo();
  },
  addTipo() {
    const nome = prompt('Nome do novo tipo de demanda:');
    if (!nome) return;
    App.state.config.push({ tipo: nome.trim(), sistemas: '', atividades: [] });
    App.persistConfig();
    this.renderConfig();
    this.popularSelectTipo();
  }
};

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) { alert(msg); return; }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}
