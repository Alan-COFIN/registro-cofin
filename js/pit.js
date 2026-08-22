/* ============================================================
   pit.js — aba "Planejar PIT" (distribuição de horas do
   Plano Individual de Trabalho entre entregas fixas/variáveis)
   ============================================================ */

const Pit = {
  render() {
    const box = document.getElementById('pit-lista');
    box.innerHTML = App.state.pit.map((p, i) => `
      <div class="pit-item">
        <input type="text" value="${p.titulo.replace(/"/g, '&quot;')}"
               onchange="Pit.setCampo(${i},'titulo',this.value)">
        <select onchange="Pit.setCampo(${i},'tipo',this.value)">
          <option value="fixa" ${p.tipo === 'fixa' ? 'selected' : ''}>Fixa</option>
          <option value="variavel" ${p.tipo === 'variavel' ? 'selected' : ''}>Variável</option>
        </select>
        <input type="number" min="0" value="${p.horas || 0}" style="width:60px"
               onchange="Pit.setCampo(${i},'horas',Number(this.value))"> h
        <button class="btn-link" onclick="Pit.remover(${i})">remover</button>
      </div>`).join('');
    this.calcular();
  },

  setCampo(i, campo, valor) {
    App.state.pit[i][campo] = valor;
    Storage.setPit(App.state.pit);
    this.calcular();
  },
  adicionar() {
    App.state.pit.push({ titulo: 'Nova entrega', tipo: 'variavel', horas: 0 });
    Storage.setPit(App.state.pit);
    this.render();
  },
  remover(i) {
    App.state.pit.splice(i, 1);
    Storage.setPit(App.state.pit);
    this.render();
  },

  calcular() {
    const totalDisponivel = Number(document.getElementById('pit-total').value || 0);
    const fixaSum = App.state.pit.filter(p => p.tipo === 'fixa').reduce((s, p) => s + Number(p.horas || 0), 0);
    const varSum = App.state.pit.filter(p => p.tipo === 'variavel').reduce((s, p) => s + Number(p.horas || 0), 0);
    const resumo = document.getElementById('pit-resumo');
    const alerta = document.getElementById('pit-alerta');
    resumo.textContent =
      `Total informado: ${totalDisponivel}h | Fixas: ${fixaSum}h | Variáveis: ${varSum}h | ` +
      `Soma: ${fixaSum + varSum}h`;
    if (totalDisponivel && (fixaSum + varSum) > totalDisponivel) {
      alerta.style.display = 'block';
      alerta.textContent = `Atenção: a soma (${fixaSum + varSum}h) ultrapassa o total disponível (${totalDisponivel}h).`;
    } else {
      alerta.style.display = 'none';
    }
  }
};
