/* ============================================================
   data.js — dados padrão do sistema (tipos de demanda,
   atividades, mapeamento PIT/SUAP, responsáveis)
   Editável em tempo de execução via aba Configurações;
   isto é apenas a semente inicial.
   ============================================================ */

const RESPONSAVEIS = [
  { id: 'alan', nome: 'Alan (supervisor)' },
  { id: 'lucinei', nome: 'Lucinei' },
  { id: 'lairio', nome: 'Lairio' }
];

const CAMPI = ['RT', 'CCS', 'CBO', 'CRB', 'CXA', 'CSM', 'CTA', 'DIRCF', 'COERG', 'PROAD'];

const DEFAULT_CONFIG = [
  {
    tipo: 'Liquidacao (Reitoria)',
    sistemas: 'SIAFI; SICAF; Compranet; SEI; Planilha REINF',
    atividades: [
      { texto: 'Consulta do SICAF', padrao: true },
      { texto: 'Consulta de saldo de empenho', padrao: true },
      { texto: 'Consulta do Simples Nacional', padrao: true },
      { texto: 'Conferência do Instrumento de Cobrança', padrao: true },
      { texto: 'Conferência de Despacho (Liquidação)', padrao: true },
      { texto: 'Apropriação da NF/FAT', padrao: true },
      { texto: 'Lançamento de encargo no drive REINF', padrao: true },
      { texto: 'Execução do DARF contábil INSS', padrao: false },
      { texto: 'Verificação Beneficiários / Lista de Credores', padrao: false },
      { texto: 'Geração de Lista de Credores', padrao: false },
      { texto: 'Liquidação SIAFI', padrao: false },
      { texto: 'Consulta de IRRF incidente', padrao: false },
      { texto: 'Encaminhamento para COERG', padrao: false }
    ]
  },
  {
    tipo: 'Pagamento (Reitoria)',
    sistemas: 'SIAFI; SICAF; SEI; Planilha REINF',
    atividades: [
      { texto: 'Conferência do Despacho Decisório', padrao: true },
      { texto: 'Conferência da Liquidação', padrao: true },
      { texto: 'Consulta do SICAF', padrao: true },
      { texto: 'Verificação de saldo e recurso TED/Emenda', padrao: true },
      { texto: 'Consulta de disponibilidade financeira', padrao: true },
      { texto: 'Pagamento da liquidação no SIAFI', padrao: true },
      { texto: 'Lançamento REINF (Pós-Pagamento)', padrao: true },
      { texto: 'Anexo dos comprovantes de pagamento', padrao: true },
      { texto: 'Despacho OB p/ COERG', padrao: true }
    ]
  },
  {
    tipo: 'Autorização de Pagamento (Campus)',
    sistemas: 'SEI; SIAFI; Tesouro Gerencial; Planilha',
    atividades: [
      { texto: 'Conferência do Despacho Decisório', padrao: true },
      { texto: 'Verificação de orçamento e saldo disponível', padrao: true },
      { texto: 'Verificação de recurso TED/Emenda', padrao: true },
      { texto: 'Despacho autorizando pagamento para o campus', padrao: true }
    ]
  },
  {
    tipo: 'Conferência do Retorno (Campus)',
    sistemas: 'SEI; SICAF; SIAFI; Planilha REINF; E-mail; WhatsApp',
    atividades: [
      { texto: 'Conferência dos comprovantes de pagamento recebidos', padrao: true },
      { texto: 'Verificação do SICAF válido', padrao: true },
      { texto: 'Conferência dos comprovantes de líquido e retenções', padrao: true },
      { texto: 'Verificação do lançamento da NP na planilha REINF', padrao: true },
      { texto: 'Despacho encaminhando para COERG', padrao: true }
    ]
  },
  {
    tipo: 'Triagem e Distribuição de Processos',
    sistemas: 'SEI; Planilha; E-mail; WhatsApp',
    atividades: [
      { texto: 'Verificação do processo recebido no SEI', padrao: true },
      { texto: 'Análise da demanda (liquidação ou pagamento)', padrao: true },
      { texto: 'Atribuição para a equipe responsável', padrao: true }
    ]
  }
];

// Mapa "tipo interno" -> "texto oficial PIT/SUAP" (usado no relatório)
const PIT_MAP = {
  'Liquidacao (Reitoria)': 'Atividades referentes a Liquidacao de Despesas',
  'Pagamento (Reitoria)': 'Atividades referentes ao Pagamento de Despesas',
  'Autorização de Pagamento (Campus)': 'Envio de demandas (liquidacao e pagamento) para os campi',
  'Conferência do Retorno (Campus)': 'Envio de demandas (liquidacao e pagamento) para os campi',
  'Triagem e Distribuição de Processos': 'Auxilio a Diretoria de Contabilidade e Financas e Pro-Reitoria de Administracao'
};
