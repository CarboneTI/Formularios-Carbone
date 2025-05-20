import * as z from 'zod'

// Common fields schema
export const commonFields = {
  nomeEmpresa: z.string()
    .min(1, 'Nome da empresa é obrigatório')
    .max(100, 'Nome muito longo'),
  tempoMercado: z.string()
    .min(1, 'Tempo de mercado é obrigatório')
    .max(50, 'Tempo de mercado muito longo'),
  localizacao: z.string()
    .min(1, 'Localização é obrigatória')
    .max(200, 'Localização muito longa'),
  nomeAssistente: z.string()
    .min(1, 'Nome do assistente é obrigatório')
    .max(50, 'Nome muito longo'),
  generoBot: z.enum(['feminino', 'masculino', 'neutro'], {
    required_error: 'Selecione o gênero do bot'
  }),
  emailContato: z.string()
    .email('Email inválido')
    .max(100, 'Email muito longo'),
  siteEmpresa: z.string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  observacoesAdicionais: z.string()
    .max(2000, 'Texto muito longo')
    .optional(),
  regrasCriticas: z.string()
    .min(1, 'Regras críticas é obrigatório')
    .max(1000, 'Texto muito longo'),
  proibicoesAbsolutas: z.string()
    .min(1, 'Proibições absolutas é obrigatório')
    .max(1000, 'Texto muito longo'),
  exemplosConversas: z.string()
    .min(1, 'Exemplos de conversas é obrigatório')
    .max(2000, 'Texto muito longo'),
}

// Automóveis schema
export const automoveisSchema = z.object({
  ...commonFields,
  tiposVeiculos: z.string()
    .min(1, 'Tipos de veículos é obrigatório')
    .max(500, 'Texto muito longo'),
  marcasTrabalhadas: z.string()
    .min(1, 'Marcas trabalhadas é obrigatório')
    .max(500, 'Texto muito longo'),
  formasPagamento: z.string()
    .min(1, 'Formas de pagamento é obrigatório')
    .max(500, 'Texto muito longo'),
  diferenciais: z.string()
    .min(1, 'Diferenciais é obrigatório')
    .max(1000, 'Texto muito longo'),
  taxasAdicionais: z.string()
    .min(1, 'Taxas adicionais é obrigatório')
    .max(500, 'Texto muito longo'),
})

// Energia Solar schema
export const energiaSolarSchema = z.object({
  ...commonFields,
  tiposSistemas: z.string()
    .min(1, 'Tipos de sistemas é obrigatório')
    .max(500, 'Texto muito longo'),
  marcasEquipamentos: z.string()
    .min(1, 'Marcas de equipamentos é obrigatório')
    .max(500, 'Texto muito longo'),
  formasPagamento: z.string()
    .min(1, 'Formas de pagamento é obrigatório')
    .max(500, 'Texto muito longo'),
  diferenciais: z.string()
    .min(1, 'Diferenciais é obrigatório')
    .max(1000, 'Texto muito longo'),
  beneficiosEconomicos: z.string()
    .min(1, 'Benefícios econômicos é obrigatório')
    .max(500, 'Texto muito longo'),
})

// Outros schema
export const outrosSchema = z.object({
  ...commonFields,
  tipoServico: z.string()
    .min(1, 'Tipo de serviço é obrigatório')
    .max(500, 'Texto muito longo'),
  publico: z.string()
    .min(1, 'Público-alvo é obrigatório')
    .max(500, 'Texto muito longo'),
  precosServicos: z.string()
    .min(1, 'Preços e serviços é obrigatório')
    .max(500, 'Texto muito longo'),
  diferenciais: z.string()
    .min(1, 'Diferenciais é obrigatório')
    .max(1000, 'Texto muito longo'),
  politicasCancelamento: z.string()
    .min(1, 'Políticas de cancelamento é obrigatório')
    .max(500, 'Texto muito longo'),
})

// Union type for form data
export type AutomoveisData = z.infer<typeof automoveisSchema>
export type EnergiaSolarData = z.infer<typeof energiaSolarSchema>
export type OutrosData = z.infer<typeof outrosSchema>
export type FormData = AutomoveisData | EnergiaSolarData | OutrosData 