# Registro COFIN

App de registro de atividades PGD, feito do zero em HTML/JS puro (sem framework), organizado em módulos.

## Estrutura

```
index.html          shell + abas
css/style.css        estilo
js/data.js           tipos de demanda, atividades, PIT/SUAP, responsáveis (semente inicial)
js/storage.js        acesso ao localStorage
js/sei.js            sugestão automática de tipo pelo histórico do processo SEI
js/sync.js           sincronização com Google Sheets (token de segurança + aviso de conflito)
js/ui.js             abas, toast, aba Configurações
js/registro.js        aba Novo Registro (inclui edição inline de atividade)
js/historico.js       aba Histórico + resumo por responsável
js/relatorio.js       aba Relatório (RIT) + exportar .txt
js/pit.js             aba Planejar PIT
js/main.js            inicialização
apps-script.gs        código para colar no Google Apps Script
```

## Como colocar no ar

1. **Planilha + Apps Script**
   - Crie uma planilha nova no Google Sheets.
   - Extensões > Apps Script > cole o conteúdo de `apps-script.gs`.
   - Troque `TOKEN` por um valor secreto seu.
   - Implantar > Nova implantação > App da Web > Executar como "Eu", acesso "Qualquer pessoa".
   - Copie a URL gerada.

2. **Front-end**
   - Abra `js/sync.js` e preencha `SHEETS_URL` (a URL copiada) e `SYNC_TOKEN` (o mesmo token do passo 1).

3. **Publicar**
   - Suba a pasta para um repositório no GitHub.
   - Settings > Pages > publique a branch principal.

## Sincronização entre navegadores

- A configuração (tipos/atividades) é salva na nuvem a cada alteração.
- Ao abrir a aba Configurações, o app tenta puxar a versão mais recente automaticamente.
- Se você editou localmente e a nuvem tiver uma versão mais nova, o app avisa em vez de sobrescrever — use os botões "Puxar da nuvem" ou "Forçar puxar" para decidir manualmente.
- Os registros de histórico (não a config) são enviados individualmente a cada "Salvar registro".

## Segurança

A URL do Apps Script fica visível no código-fonte (é uma página pública). O `TOKEN` impede que alguém que veja essa URL consiga ler ou gravar dados sem o valor secreto correto. Não compartilhe o token.
