/* ============================================================
   registro.js — aba "Novo Registro"
   ============================================================ */

const Registro = {
  onTipoChange() {
    const tipo = document.getElementById('tipo').value;
    const cfg = App.state.config.find(c => c.tipo === tipo);
    const field = document.getElementById('ativs-field');
    if (!cfg) { field.style.display = 'none'; return; }
    field.style.display = 'block';
    this.renderAtividades(cfg);
  },

  renderAtividades(cfg) {
    const box = document.getElementById('ativs-list');
    box.innerHTML = cfg.atividades.map((a, ai) => `
      <label class="ativ-item">
        <input type="checkbox" value="${a.texto.replace(/"/g, '&quot;')}" ${a.padrao ? 'checked' : ''}>
        <span class="ativ-texto" data-ci-ai="${ai}">${a.texto}</span>
        <button type="button" class="btn-edit-inline" title="Editar atividade"
                onclick="Registro.editarInline(this)">✎</button>
      </label>`).join('');
  },

  // Edição da atividade direto na tela de registro (sem ir em Configurações)
  editarInline(btn) {
    const span = btn.previousElementSibling;
    const atual = span.textContent;
    const novo = prompt('Editar texto da atividade:', atual);
    if (novo === null || !novo.trim()) return;
    span.textContent = novo.trim();
    btn.previousElementSibling.previousElementSibling.value = novo.trim();

    // reflete a alteração na Configuração (mesmo tipo/atividade)
    const tipo = document.getElementById('tipo').value;
    const cfg = App.state.config.find(c => c.tipo === tipo);
    const idx = [...btn.closest('.atividades-box').children].indexOf(btn.closest('.ativ-item'));
    if (cfg && cfg.atividades[idx]) {
      cfg.atividades[idx].texto = novo.trim();
      App.persistConfig();
      UI.renderConfig(); // mantém a aba Configurações sempre coerente
    }
  },

  getAtividadesSelecionadas() {
    return [...document.querySelectorAll('#ativs-list input[type=checkbox]:checked')]
      .map(el => el.nextElementSibling.textContent);
  },

  // Chamado ao digitar/sair do campo SEI: sugere tipo/campus com
  // base no histórico do mesmo processo
  onSeiInput() {
    const sei = document.getElementById('sei').value;
    const sug = Sei.sugerir(sei, App.state.registros);
    const box = document.getElementById('sei-sugestao');
    if (!sug) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    box.innerHTML = `Este processo já teve ${sug.qtdAnterior}x registro — última vez em
      ${sug.ultimaData} como <strong>${sug.tipo}</strong>${sug.campus ? ' / ' + sug.campus : ''}.
      <button type="button" class="btn-link" onclick="Registro.aplicarSugestaoSei()">Aplicar</button>`;
    this._sugestaoAtual = sug;
  },
  aplicarSugestaoSei() {
    const sug = this._sugestaoAtual;
    if (!sug) return;
    document.getElementById('tipo').value = sug.tipo;
    this.onTipoChange();
    if (sug.responsavel) UI.popularSelectResponsavel(document.getElementById('responsavel'), sug.responsavel);
    document.getElementById('sei-sugestao').style.display = 'none';
  },

  popularSelectPitOverride() {
    const s = document.getElementById('pit-override');
    if (!s) return;
    s.innerHTML = '<option value="">— usar padrão do tipo —</option>';
    PIT_OFICIAL.forEach(p => {
      const o = document.createElement('option');
      o.value = p; o.textContent = p;
      s.appendChild(o);
    });
  },

  // Resolve qual entrega oficial do PIT vale para este registro:
  // usa o override manual se escolhido, senão o padrão do tipo selecionado.
  resolverPitOficial(tipo) {
    const override = document.getElementById('pit-override').value;
    if (override) return override;
    return PIT_MAP[tipo] || tipo;
  },

  montarRegistro({ sei, data, tipo, campus, responsavel, detalhes, atividades }) {
    return {
      id: 'r' + Date.now() + Math.random().toString(36).slice(2, 7),
      sei, data, tipo, campus, responsavel, detalhes, atividades,
      pitOficial: this.resolverPitOficial(tipo),
      supervisor: SUPERVISOR_PADRAO, // você supervisiona sempre, independente de quem executou
      criadoEm: Date.now(),
      synced: false
    };
  },

  salvar() {
    const sei = document.getElementById('sei').value.trim();
    const data = document.getElementById('data').value;
    const tipo = document.getElementById('tipo').value;
    const campus = document.getElementById('campus').value;
    const responsavel = document.getElementById('responsavel').value;
    const detalhes = document.getElementById('detalhes').value.trim();

    if (!data || !tipo) { showToast('Preencha ao menos Data e Tipo de demanda.'); return; }

    const reg = this.montarRegistro({
      sei, data, tipo, campus, responsavel, detalhes,
      atividades: this.getAtividadesSelecionadas().join('; ')
    });

    App.state.registros.unshift(reg);
    Storage.setRegistros(App.state.registros);
    Sync.enviarRegistro(reg);

    showToast('Registro salvo.');
    this.limpar();
    Historico.render();
  },

  // Cria um registro para cada linha da caixa de lote, reaproveitando
  // tipo/campus/atividades/responsável/data já definidos no formulário acima.
  salvarLote() {
    const data = document.getElementById('data').value;
    const tipo = document.getElementById('tipo').value;
    const campus = document.getElementById('campus').value;
    const responsavel = document.getElementById('responsavel').value;
    const detalhes = document.getElementById('detalhes').value.trim();
    const atividades = this.getAtividadesSelecionadas().join('; ');

    if (!data || !tipo) { showToast('Preencha ao menos Data e Tipo de demanda antes de lançar o lote.'); return; }

    const linhas = document.getElementById('lote-seis').value
      .split('\n').map(s => s.trim()).filter(Boolean);

    if (!linhas.length) { showToast('Cole ao menos um número de processo SEI na caixa de lote.'); return; }

    linhas.forEach(sei => {
      const reg = this.montarRegistro({ sei, data, tipo, campus, responsavel, detalhes, atividades });
      App.state.registros.unshift(reg);
      Sync.enviarRegistro(reg);
    });
    Storage.setRegistros(App.state.registros);

    showToast(`${linhas.length} registro(s) salvos em lote.`);
    document.getElementById('lote-seis').value = '';
    Historico.render();
  },

  limpar() {
    document.getElementById('sei').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('pit-override').value = '';
    document.getElementById('detalhes').value = '';
    document.getElementById('ativs-field').style.display = 'none';
    document.getElementById('sei-sugestao').style.display = 'none';
    document.getElementById('data').value = App.today();
  }
};
