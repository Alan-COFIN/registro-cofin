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

// Lista oficial das entregas do seu PIT/SUAP (RIFAC > PROAD > DIRCF > COFIN).
// Usada tanto como opção de override no registro quanto como agrupador do Relatório.
const PIT_OFICIAL = [
  'Atendimento aos campi e setores quanto a assuntos relacionados a orientações técnicas',
  'Atendimento aos fornecedores quanto aos pagamentos',
  'Atendimento às determinações e demandas de órgãos externos',
  'Atividades referentes à Liquidação de Despesas',
  'Atividades referentes à liquidação e pagamento de despesas da folha de pagamento de pessoal',
  'Atividades referentes ao Pagamento de Despesas',
  'Auxílio à Diretoria de Contabilidade e Finanças e Pró-Reitoria de Administração referente aos assuntos diversos relacionados à contabilidade, finanças, orçamento',
  'Controle, acompanhamento recursos específicos, TED, emenda por liquidação/pagamento',
  'Cumprimento de obrigações tributárias referentes à SEFIP/GFIP, PIS/PASEP/NIT, FGTS, DARF/GPS, DIRF, ISS, EFD-Reinf e E-Social, DCTFweb',
  'Elaboração e revisão de fluxos de processos e manuais',
  'Envio de IRRF aos fornecedores e colaboradores externos',
  'Envio de demandas (liquidação e pagamento) para os campi',
  'Gestão de Recursos Financeiros',
  'Participação em atividades',
  "Regularização de pagamento (ob's canceladas)"
];

// Mapa "tipo interno/genérico" -> entrega oficial PADRÃO (pode ser trocada
// registro a registro através do campo "Tipo PIT/SUAP" na tela de Registro).
const PIT_MAP = {
  'Liquidacao (Reitoria)': 'Atividades referentes à Liquidação de Despesas',
  'Pagamento (Reitoria)': 'Atividades referentes ao Pagamento de Despesas',
  'Autorização de Pagamento (Campus)': 'Envio de demandas (liquidação e pagamento) para os campi',
  'Conferência do Retorno (Campus)': 'Envio de demandas (liquidação e pagamento) para os campi',
  'Triagem e Distribuição de Processos': 'Auxílio à Diretoria de Contabilidade e Finanças e Pró-Reitoria de Administração referente aos assuntos diversos relacionados à contabilidade, finanças, orçamento'
};

// Você é sempre o supervisor das atividades registradas, independente de
// quem executou (campo "responsavel" no registro).
const SUPERVISOR_PADRAO = 'alan';
