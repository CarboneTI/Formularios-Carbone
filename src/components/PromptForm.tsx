'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Define different schemas for each form type
const commonFields = {
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
const automoveisSchema = z.object({
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
});

// Energia Solar schema
const energiaSolarSchema = z.object({
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
});

// Outros schema
const outrosSchema = z.object({
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
});

// Union type for form data
type AutomoveisData = z.infer<typeof automoveisSchema>;
type EnergiaSolarData = z.infer<typeof energiaSolarSchema>;
type OutrosData = z.infer<typeof outrosSchema>;
type FormData = AutomoveisData | EnergiaSolarData | OutrosData;

// Definição das propriedades do componente
interface PromptFormProps {
  formType?: 'automoveis' | 'energia-solar' | 'outros';
  onStepChange?: (step: number) => void;
}

export default function PromptForm({ formType = 'automoveis', onStepChange }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [promptResult, setPromptResult] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [currentSection, setCurrentSection] = useState(1)

  // Placeholders baseados no tipo de formulário
  const placeholders = {
    automoveis: {
      tiposVeiculos: "Ex: Carros novos, carros usados, motos, caminhões...",
      marcasTrabalhadas: "Ex: Toyota, Honda, Volkswagen, Ford...",
      formasPagamento: "Ex: Dinheiro, cartão, financiamento...",
      taxasAdicionais: "Ex: Taxa de documentação, seguro, revisão...",
      diferenciais: "Ex: Melhor preço da região, garantia estendida, serviço de entrega..."
    },
    'energia-solar': {
      tiposSistemas: "Ex: Sistemas residenciais, comerciais, industriais, rurais...",
      marcasEquipamentos: "Ex: Canadian Solar, SMA, Fronius, Growatt...",
      formasPagamento: "Ex: À vista, financiamento, parcelamento...",
      beneficiosEconomicos: "Ex: Economia média mensal, retorno de investimento, valorização do imóvel...",
      diferenciais: "Ex: Instalação rápida, monitoramento remoto, garantia estendida..."
    },
    outros: {
      tipoServico: "Ex: Consultoria, serviços técnicos, educação, saúde...",
      publico: "Ex: Empresas, consumidores finais, profissionais, estudantes...",
      precosServicos: "Ex: Pacotes, assinaturas, valor por hora, projetos personalizados...",
      politicasCancelamento: "Ex: Reembolso, reagendamento, multas por cancelamento...",
      diferenciais: "Ex: Atendimento personalizado, suporte 24h, garantia de satisfação..."
    }
  };

  // Select the appropriate schema based on formType
  const getSchema = () => {
    switch (formType) {
      case 'energia-solar':
        return energiaSolarSchema as z.ZodType<FormData>;
      case 'outros':
        return outrosSchema as z.ZodType<FormData>;
      default:
        return automoveisSchema as z.ZodType<FormData>;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(getSchema()),
  });

  // Função auxiliar para verificar erros de campo específicos
  const getFieldError = (field: keyof FormData) => {
    return errors[field]?.message as string | undefined;
  };

  // Common fields watched across all form types
  const watchNomeEmpresa = watch('nomeEmpresa')
  const watchTempoMercado = watch('tempoMercado')
  const watchLocalizacao = watch('localizacao')
  const watchNomeAssistente = watch('nomeAssistente')
  const watchGeneroBot = watch('generoBot')
  
  const watchRegrasCriticas = watch('regrasCriticas')
  const watchProibicoesAbsolutas = watch('proibicoesAbsolutas')
  const watchExemplosConversas = watch('exemplosConversas')
  
  // Form-specific fields being watched
  const watchDiferenciais = watch('diferenciais')
  
  // Automóveis specific fields
  const watchTiposVeiculos = formType === 'automoveis' ? watch('tiposVeiculos') : null
  const watchMarcasTrabalhadas = formType === 'automoveis' ? watch('marcasTrabalhadas') : null
  const watchFormasPagamento = watch('formasPagamento')
  const watchTaxasAdicionais = formType === 'automoveis' ? watch('taxasAdicionais') : null
  
  // Energia Solar specific fields
  const watchTiposSistemas = formType === 'energia-solar' ? watch('tiposSistemas') : null
  const watchMarcasEquipamentos = formType === 'energia-solar' ? watch('marcasEquipamentos') : null
  const watchBeneficiosEconomicos = formType === 'energia-solar' ? watch('beneficiosEconomicos') : null
  
  // Outros specific fields
  const watchTipoServico = formType === 'outros' ? watch('tipoServico') : null
  const watchPublico = formType === 'outros' ? watch('publico') : null
  const watchPrecosServicos = formType === 'outros' ? watch('precosServicos') : null
  const watchPoliticasCancelamento = formType === 'outros' ? watch('politicasCancelamento') : null
  
  // Update section status based on field values
  useEffect(() => {
    // Section 1: Basic Information (common for all form types)
    if (watchNomeEmpresa && watchTempoMercado && watchLocalizacao && watchNomeAssistente && watchGeneroBot) {
      updateSection(2);
    } else {
      updateSection(1);
    }
    
    // Section 2: Company Details (varies by form type)
    if (formType === 'automoveis' && 
        watchTiposVeiculos && watchMarcasTrabalhadas && watchFormasPagamento && 
        watchDiferenciais && watchTaxasAdicionais) {
      updateSection(3);
    } else if (formType === 'energia-solar' && 
        watchTiposSistemas && watchMarcasEquipamentos && watchFormasPagamento && 
        watchDiferenciais && watchBeneficiosEconomicos) {
      updateSection(3);
    } else if (formType === 'outros' && 
        watchTipoServico && watchPublico && watchPrecosServicos && 
        watchDiferenciais && watchPoliticasCancelamento) {
      updateSection(3);
    }
    
    // Section 3: Rules and Prohibitions (common for all form types)
    if (watchRegrasCriticas && watchProibicoesAbsolutas && watchExemplosConversas) {
      updateSection(4);
    }
  }, [
    formType,
    // Common fields
    watchNomeEmpresa, watchTempoMercado, watchLocalizacao, watchNomeAssistente, watchGeneroBot,
    watchRegrasCriticas, watchProibicoesAbsolutas, watchExemplosConversas, watchDiferenciais,
    watchFormasPagamento,
    
    // Automóveis specific fields
    watchTiposVeiculos, watchMarcasTrabalhadas, watchTaxasAdicionais,
    
    // Energia Solar specific fields
    watchTiposSistemas, watchMarcasEquipamentos, watchBeneficiosEconomicos,
    
    // Outros specific fields
    watchTipoServico, watchPublico, watchPrecosServicos, watchPoliticasCancelamento
  ]);

  // Update the current section and notify parent component
  const updateSection = (section: number) => {
    if (section > currentSection) {
      setCurrentSection(section);
      if (onStepChange) {
        onStepChange(section);
      }
    }
  };

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowModal(false)
      }
    }

    if (showModal) {
      document.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [showModal])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    try {
      // Set final step when form is submitted
      if (onStepChange) {
        onStepChange(4);
      }
      
      console.log('Enviando dados para API:', { formType, ...data });
      
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, formType}),
      })

      // Registrar a resposta para diagnóstico
      const responseText = await response.text();
      console.log('Resposta da API:', { 
        status: response.status, 
        statusText: response.statusText,
        responseText 
      });

      if (!response.ok) {
        let errorMessage = 'Erro de servidor';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Se não for possível analisar como JSON, use o texto da resposta
          errorMessage = responseText || errorMessage;
        }
        throw new Error(`HTTP error! status: ${response.status}. Mensagem: ${errorMessage}`);
      }

      // Tentar fazer o parse do JSON da resposta
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Resposta inválida do servidor');
      }

      setPromptResult(result.prompt)
      setShowModal(true)
      reset()
      // Reset to step 1 after form submit and reset
      if (onStepChange) {
        onStepChange(1);
      }
    } catch (error) {
      console.error('Erro ao gerar prompt:', error)
      setError(typeof error === 'object' && error !== null && 'message' in error 
        ? (error as Error).message 
        : 'Ocorreu um erro ao gerar o prompt. Por favor, tente novamente.');
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowModal(false)
    }
  }

  // Altera o título baseado no tipo de formulário
  const getTipoLabel = () => {
    switch (formType) {
      case 'energia-solar':
        return 'Tipos de Sistemas Solar Trabalhados*';
      case 'outros':
        return 'Tipos de Serviços Oferecidos*';
      default:
        return 'Tipos de Veículos Trabalhados*';
    }
  }

  const getMarcasLabel = () => {
    switch (formType) {
      case 'energia-solar':
        return 'Equipamentos/Fabricantes Atendidos*';
      case 'outros':
        return 'Especialidades/Marcas Atendidas*';
      default:
        return 'Marcas Trabalhadas*';
    }
  }

  // Função para renderizar o formulário correspondente ao tipo selecionado
  const renderFormContent = () => {
    switch (formType) {
      case 'energia-solar':
  return (
          <>
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome da Empresa*
                </label>
                <input
                  id="nomeEmpresa"
                  {...register('nomeEmpresa')}
                  placeholder="Ex: Nome da Empresa de Energia Solar"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.nomeEmpresa && (
                  <p className="text-red-400 text-sm mt-1">{errors.nomeEmpresa.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="tempoMercado" className="block text-sm font-medium text-gray-300 mb-2">
                  Tempo de Mercado*
                </label>
                <input
                  id="tempoMercado"
                  {...register('tempoMercado')}
                  placeholder="Ex: X anos"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.tempoMercado && (
                  <p className="text-red-400 text-sm mt-1">{errors.tempoMercado.message as string}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="localizacao" className="block text-sm font-medium text-gray-300 mb-2">
                Regiões Atendidas*
              </label>
              <input
                id="localizacao"
                {...register('localizacao')}
                placeholder="Ex: Cidades, Estados ou Regiões onde atua"
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.localizacao && (
                <p className="text-red-400 text-sm mt-1">{errors.localizacao.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nomeAssistente" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Assistente Virtual*
                </label>
                <input
                  id="nomeAssistente"
                  {...register('nomeAssistente')}
                  placeholder="Ex: Nome do Assistente"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.nomeAssistente && (
                  <p className="text-red-400 text-sm mt-1">{errors.nomeAssistente.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="generoBot" className="block text-sm font-medium text-gray-300 mb-2">
                  Gênero do Bot*
                </label>
                <select
                  id="generoBot"
                  {...register('generoBot')}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="neutro">Neutro</option>
                </select>
                {errors.generoBot && (
                  <p className="text-red-400 text-sm mt-1">{errors.generoBot.message as string}</p>
                )}
              </div>
            </div>

            {/* Detalhes da empresa */}
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[#FFC600]">Detalhes da Empresa</h3>
            </div>
            
            <div>
              <label htmlFor="tiposSistemas" className="block text-sm font-medium text-gray-300 mb-2">
                Tipos de Sistemas Oferecidos*
              </label>
              <textarea
                id="tiposSistemas"
                {...register('tiposSistemas')}
                placeholder={placeholders['energia-solar'].tiposSistemas}
                rows={3}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {getFieldError('tiposSistemas') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('tiposSistemas')}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="marcasEquipamentos" className="block text-sm font-medium text-gray-300 mb-2">
                  Marcas e Equipamentos*
                </label>
                <textarea
                  id="marcasEquipamentos"
                  {...register('marcasEquipamentos')}
                  placeholder={placeholders['energia-solar'].marcasEquipamentos}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.marcasEquipamentos && (
                  <p className="text-red-400 text-sm mt-1">{errors.marcasEquipamentos.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="formasPagamento" className="block text-sm font-medium text-gray-300 mb-2">
                  Formas de Pagamento Aceitas*
                </label>
                <textarea
                  id="formasPagamento"
                  {...register('formasPagamento')}
                  placeholder={placeholders['energia-solar'].formasPagamento}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.formasPagamento && (
                  <p className="text-red-400 text-sm mt-1">{errors.formasPagamento.message as string}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="diferenciais" className="block text-sm font-medium text-gray-300 mb-2">
                  Diferenciais da Empresa*
                </label>
                <textarea
                  id="diferenciais"
                  {...register('diferenciais')}
                  placeholder={placeholders['energia-solar'].diferenciais}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.diferenciais && (
                  <p className="text-red-400 text-sm mt-1">{errors.diferenciais.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="beneficiosEconomicos" className="block text-sm font-medium text-gray-300 mb-2">
                  Benefícios Econômicos*
                </label>
                <textarea
                  id="beneficiosEconomicos"
                  {...register('beneficiosEconomicos')}
                  placeholder={placeholders['energia-solar'].beneficiosEconomicos}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.beneficiosEconomicos && (
                  <p className="text-red-400 text-sm mt-1">{errors.beneficiosEconomicos.message as string}</p>
                )}
              </div>
            </div>

            {/* Regras e proibições */}
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[#FFC600]">Regras e Proibições</h3>
            </div>

            <div>
              <label htmlFor="regrasCriticas" className="block text-sm font-medium text-gray-300 mb-2">
                Regras Críticas do Negócio*
              </label>
              <textarea
                id="regrasCriticas"
                {...register('regrasCriticas')}
                placeholder="Ex: Informações que nunca devem ser esquecidas, verificações sempre necessárias, políticas importantes, etc."
                rows={4}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.regrasCriticas && (
                <p className="text-red-400 text-sm mt-1">{errors.regrasCriticas.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="proibicoesAbsolutas" className="block text-sm font-medium text-gray-300 mb-2">
                Proibições Absolutas*
              </label>
              <textarea
                id="proibicoesAbsolutas"
                {...register('proibicoesAbsolutas')}
                placeholder="Ex: O que o bot nunca deve dizer ou fazer, erros comuns a evitar, etc."
                rows={4}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.proibicoesAbsolutas && (
                <p className="text-red-400 text-sm mt-1">{errors.proibicoesAbsolutas.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="exemplosConversas" className="block text-sm font-medium text-gray-300 mb-2">
                Exemplo de Conversa Ideal (pelo menos um diálogo)*
              </label>
              <textarea
                id="exemplosConversas"
                {...register('exemplosConversas')}
                placeholder="Cliente: 'Saudação ou pergunta inicial'&#10;Bot: 'Resposta ideal do assistente...'"
                rows={5}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.exemplosConversas && (
                <p className="text-red-400 text-sm mt-1">{errors.exemplosConversas.message as string}</p>
              )}
            </div>

            {/* Finalização */}
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[#FFC600]">Finalização</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emailContato" className="block text-sm font-medium text-gray-300 mb-2">
                  E-mail de Contato*
                </label>
                <input
                  id="emailContato"
                  {...register('emailContato')}
                  placeholder="Ex: seuemail@empresa.com"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.emailContato && (
                  <p className="text-red-400 text-sm mt-1">{errors.emailContato.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="siteEmpresa" className="block text-sm font-medium text-gray-300 mb-2">
                  Site da Empresa (opcional)
                </label>
                <input
                  id="siteEmpresa"
                  {...register('siteEmpresa')}
                  placeholder="Ex: https://www.empresa.com.br"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.siteEmpresa && (
                  <p className="text-red-400 text-sm mt-1">{errors.siteEmpresa.message as string}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="observacoesAdicionais" className="block text-sm font-medium text-gray-300 mb-2">
                Observações Adicionais (opcional)
              </label>
              <textarea
                id="observacoesAdicionais"
                {...register('observacoesAdicionais')}
                placeholder="Informações complementares relevantes..."
                rows={3}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.observacoesAdicionais && (
                <p className="text-red-400 text-sm mt-1">{errors.observacoesAdicionais.message as string}</p>
              )}
            </div>
          </>
        );
      
      case 'outros':
        return (
          <>
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome da Empresa*
                </label>
                <input
                  id="nomeEmpresa"
                  {...register('nomeEmpresa')}
                  placeholder="Ex: Nome da Empresa"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.nomeEmpresa && (
                  <p className="text-red-400 text-sm mt-1">{errors.nomeEmpresa.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="tempoMercado" className="block text-sm font-medium text-gray-300 mb-2">
                  Tempo de Mercado*
                </label>
                <input
                  id="tempoMercado"
                  {...register('tempoMercado')}
                  placeholder="Ex: X anos"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.tempoMercado && (
                  <p className="text-red-400 text-sm mt-1">{errors.tempoMercado.message as string}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="localizacao" className="block text-sm font-medium text-gray-300 mb-2">
                Localização/Região de Atuação*
              </label>
              <input
                id="localizacao"
                {...register('localizacao')}
                placeholder="Ex: Cidade, Estado, País, Online"
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.localizacao && (
                <p className="text-red-400 text-sm mt-1">{errors.localizacao.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nomeAssistente" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Assistente Virtual*
                </label>
                <input
                  id="nomeAssistente"
                  {...register('nomeAssistente')}
                  placeholder="Ex: Nome do Assistente"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.nomeAssistente && (
                  <p className="text-red-400 text-sm mt-1">{errors.nomeAssistente.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="generoBot" className="block text-sm font-medium text-gray-300 mb-2">
                  Gênero do Bot*
                </label>
                <select
                  id="generoBot"
                  {...register('generoBot')}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="neutro">Neutro</option>
                </select>
                {errors.generoBot && (
                  <p className="text-red-400 text-sm mt-1">{errors.generoBot.message as string}</p>
                )}
              </div>
            </div>

            {/* Detalhes da empresa */}
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[#FFC600]">Detalhes da Empresa</h3>
            </div>
            
            <div>
              <label htmlFor="tipoServico" className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Serviço/Produto*
              </label>
              <textarea
                id="tipoServico"
                {...register('tipoServico')}
                placeholder={placeholders.outros.tipoServico}
                rows={3}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.tipoServico && (
                <p className="text-red-400 text-sm mt-1">{errors.tipoServico.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="publico" className="block text-sm font-medium text-gray-300 mb-2">
                  Público-Alvo*
                </label>
                <textarea
                  id="publico"
                  {...register('publico')}
                  placeholder={placeholders.outros.publico}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.publico && (
                  <p className="text-red-400 text-sm mt-1">{errors.publico.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="formasPagamento" className="block text-sm font-medium text-gray-300 mb-2">
                  Formas de Pagamento Aceitas*
                </label>
                <textarea
                  id="formasPagamento"
                  {...register('formasPagamento')}
                  placeholder="Ex: PIX, boleto, cartão, assinaturas, etc."
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.formasPagamento && (
                  <p className="text-red-400 text-sm mt-1">{errors.formasPagamento.message as string}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="diferenciais" className="block text-sm font-medium text-gray-300 mb-2">
                  Diferenciais da Empresa*
                </label>
                <textarea
                  id="diferenciais"
                  {...register('diferenciais')}
                  placeholder={placeholders.outros.diferenciais}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.diferenciais && (
                  <p className="text-red-400 text-sm mt-1">{errors.diferenciais.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="precosServicos" className="block text-sm font-medium text-gray-300 mb-2">
                  Preços e Serviços*
                </label>
                <textarea
                  id="precosServicos"
                  {...register('precosServicos')}
                  placeholder={placeholders.outros.precosServicos}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.precosServicos && (
                  <p className="text-red-400 text-sm mt-1">{errors.precosServicos.message as string}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="politicasCancelamento" className="block text-sm font-medium text-gray-300 mb-2">
                Políticas de Cancelamento*
              </label>
              <textarea
                id="politicasCancelamento"
                {...register('politicasCancelamento')}
                placeholder={placeholders.outros.politicasCancelamento}
                rows={3}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.politicasCancelamento && (
                <p className="text-red-400 text-sm mt-1">{errors.politicasCancelamento.message as string}</p>
              )}
            </div>

            {/* Regras e proibições */}
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[#FFC600]">Regras e Proibições</h3>
            </div>

            <div>
              <label htmlFor="regrasCriticas" className="block text-sm font-medium text-gray-300 mb-2">
                Regras Críticas do Negócio*
              </label>
              <textarea
                id="regrasCriticas"
                {...register('regrasCriticas')}
                placeholder="Ex: Informações que nunca devem ser esquecidas, verificações sempre necessárias, políticas importantes, etc."
                rows={4}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.regrasCriticas && (
                <p className="text-red-400 text-sm mt-1">{errors.regrasCriticas.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="proibicoesAbsolutas" className="block text-sm font-medium text-gray-300 mb-2">
                Proibições Absolutas*
              </label>
              <textarea
                id="proibicoesAbsolutas"
                {...register('proibicoesAbsolutas')}
                placeholder="Ex: O que o bot nunca deve dizer ou fazer, erros comuns a evitar, etc."
                rows={4}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.proibicoesAbsolutas && (
                <p className="text-red-400 text-sm mt-1">{errors.proibicoesAbsolutas.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="exemplosConversas" className="block text-sm font-medium text-gray-300 mb-2">
                Exemplo de Conversa Ideal (pelo menos um diálogo)*
              </label>
              <textarea
                id="exemplosConversas"
                {...register('exemplosConversas')}
                placeholder="Cliente: 'Saudação ou pergunta inicial'&#10;Bot: 'Resposta ideal do assistente...'"
                rows={5}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.exemplosConversas && (
                <p className="text-red-400 text-sm mt-1">{errors.exemplosConversas.message as string}</p>
              )}
            </div>

            {/* Finalização */}
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[#FFC600]">Finalização</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emailContato" className="block text-sm font-medium text-gray-300 mb-2">
                  E-mail de Contato*
                </label>
                <input
                  id="emailContato"
                  {...register('emailContato')}
                  placeholder="Ex: seuemail@empresa.com"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.emailContato && (
                  <p className="text-red-400 text-sm mt-1">{errors.emailContato.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="siteEmpresa" className="block text-sm font-medium text-gray-300 mb-2">
                  Site da Empresa (opcional)
                </label>
                <input
                  id="siteEmpresa"
                  {...register('siteEmpresa')}
                  placeholder="Ex: https://www.empresa.com.br"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.siteEmpresa && (
                  <p className="text-red-400 text-sm mt-1">{errors.siteEmpresa.message as string}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="observacoesAdicionais" className="block text-sm font-medium text-gray-300 mb-2">
                Observações Adicionais (opcional)
              </label>
              <textarea
                id="observacoesAdicionais"
                {...register('observacoesAdicionais')}
                placeholder="Informações complementares relevantes..."
                rows={3}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.observacoesAdicionais && (
                <p className="text-red-400 text-sm mt-1">{errors.observacoesAdicionais.message as string}</p>
              )}
            </div>
          </>
        );
      
      default: // automóveis
        return (
          <>
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-300 mb-2">
                Nome da Empresa*
              </label>
              <input
                id="nomeEmpresa"
                {...register('nomeEmpresa')}
                placeholder="Ex: Nome da Loja de Veículos"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.nomeEmpresa && (
                  <p className="text-red-400 text-sm mt-1">{errors.nomeEmpresa.message as string}</p>
              )}
            </div>
            <div>
                <label htmlFor="tempoMercado" className="block text-sm font-medium text-gray-300 mb-2">
                Tempo de Mercado*
              </label>
              <input
                id="tempoMercado"
                {...register('tempoMercado')}
                placeholder="Ex: X anos"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.tempoMercado && (
                  <p className="text-red-400 text-sm mt-1">{errors.tempoMercado.message as string}</p>
              )}
            </div>
          </div>

          <div>
              <label htmlFor="localizacao" className="block text-sm font-medium text-gray-300 mb-2">
              Localização/Região de Atuação*
            </label>
            <input
              id="localizacao"
              {...register('localizacao')}
              placeholder="Ex: Cidade, Estado, País"
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
            />
            {errors.localizacao && (
                <p className="text-red-400 text-sm mt-1">{errors.localizacao.message as string}</p>
            )}
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="nomeAssistente" className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Assistente Virtual*
              </label>
              <input
                id="nomeAssistente"
                {...register('nomeAssistente')}
                placeholder="Ex: Nome do Assistente"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.nomeAssistente && (
                  <p className="text-red-400 text-sm mt-1">{errors.nomeAssistente.message as string}</p>
              )}
            </div>
            <div>
                <label htmlFor="generoBot" className="block text-sm font-medium text-gray-300 mb-2">
                Gênero do Bot*
              </label>
                <select
                  id="generoBot"
                  {...register('generoBot')}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>Selecione</option>
                <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                <option value="neutro">Neutro</option>
              </select>
              {errors.generoBot && (
                  <p className="text-red-400 text-sm mt-1">{errors.generoBot.message as string}</p>
              )}
            </div>
          </div>

            {/* Detalhes da empresa */}
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[#FFC600]">Detalhes da Empresa</h3>
            </div>
            
          <div>
              <label htmlFor="tiposVeiculos" className="block text-sm font-medium text-gray-300 mb-2">
                Tipos de Veículos Vendidos*
            </label>
            <textarea
              id="tiposVeiculos"
              {...register('tiposVeiculos')}
                placeholder="Ex: Novos, usados, categorias específicas"
                rows={3}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
            />
            {errors.tiposVeiculos && (
                <p className="text-red-400 text-sm mt-1">{errors.tiposVeiculos.message as string}</p>
            )}
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
                <label htmlFor="marcasTrabalhadas" className="block text-sm font-medium text-gray-300 mb-2">
              Marcas Trabalhadas*
            </label>
            <textarea
              id="marcasTrabalhadas"
              {...register('marcasTrabalhadas')}
                  placeholder="Ex: Marcas de veículos vendidos"
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
            />
            {errors.marcasTrabalhadas && (
                  <p className="text-red-400 text-sm mt-1">{errors.marcasTrabalhadas.message as string}</p>
            )}
          </div>
            <div>
                <label htmlFor="formasPagamento" className="block text-sm font-medium text-gray-300 mb-2">
                  Formas de Pagamento Aceitas*
              </label>
              <textarea
                id="formasPagamento"
                {...register('formasPagamento')}
                  placeholder="Ex: Métodos de pagamento disponíveis"
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.formasPagamento && (
                  <p className="text-red-400 text-sm mt-1">{errors.formasPagamento.message as string}</p>
              )}
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
                <label htmlFor="diferenciais" className="block text-sm font-medium text-gray-300 mb-2">
              Diferenciais da Empresa*
            </label>
            <textarea
              id="diferenciais"
              {...register('diferenciais')}
                  placeholder="Ex: Garantias oferecidas, serviços adicionais inclusos, benefícios exclusivos, etc."
              rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
            />
            {errors.diferenciais && (
                  <p className="text-red-400 text-sm mt-1">{errors.diferenciais.message as string}</p>
                )}
              </div>
              <div>
                <label htmlFor="taxasAdicionais" className="block text-sm font-medium text-gray-300 mb-2">
                  Taxas e Custos Adicionais*
                </label>
                <textarea
                  id="taxasAdicionais"
                  {...register('taxasAdicionais')}
                  placeholder="Ex: Taxas de transferência, documentação, custos extras, etc."
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {errors.taxasAdicionais && (
                  <p className="text-red-400 text-sm mt-1">{errors.taxasAdicionais.message as string}</p>
                )}
              </div>
          </div>

            {/* Regras e proibições */}
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[#FFC600]">Regras e Proibições</h3>
            </div>

          <div>
              <label htmlFor="regrasCriticas" className="block text-sm font-medium text-gray-300 mb-2">
                Regras Críticas do Negócio*
            </label>
            <textarea
              id="regrasCriticas"
              {...register('regrasCriticas')}
                placeholder="Ex: Informações que nunca devem ser esquecidas, verificações sempre necessárias, políticas importantes, etc."
                rows={4}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
            />
            {errors.regrasCriticas && (
                <p className="text-red-400 text-sm mt-1">{errors.regrasCriticas.message as string}</p>
            )}
          </div>

          <div>
              <label htmlFor="proibicoesAbsolutas" className="block text-sm font-medium text-gray-300 mb-2">
              Proibições Absolutas*
            </label>
            <textarea
              id="proibicoesAbsolutas"
              {...register('proibicoesAbsolutas')}
                placeholder="Ex: O que o bot nunca deve dizer ou fazer, erros comuns a evitar, etc."
                rows={4}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
            />
            {errors.proibicoesAbsolutas && (
                <p className="text-red-400 text-sm mt-1">{errors.proibicoesAbsolutas.message as string}</p>
            )}
          </div>

          <div>
              <label htmlFor="exemplosConversas" className="block text-sm font-medium text-gray-300 mb-2">
                Exemplo de Conversa Ideal (pelo menos um diálogo)*
            </label>
            <textarea
              id="exemplosConversas"
              {...register('exemplosConversas')}
                placeholder="Cliente: 'Saudação ou pergunta inicial'&#10;Bot: 'Resposta ideal do assistente...'"
                rows={5}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
            />
            {errors.exemplosConversas && (
                <p className="text-red-400 text-sm mt-1">{errors.exemplosConversas.message as string}</p>
            )}
          </div>

            {/* Finalização */}
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[#FFC600]">Finalização</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="emailContato" className="block text-sm font-medium text-gray-300 mb-2">
                  E-mail de Contato*
              </label>
              <input
                id="emailContato"
                {...register('emailContato')}
                  placeholder="Ex: seuemail@empresa.com"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.emailContato && (
                  <p className="text-red-400 text-sm mt-1">{errors.emailContato.message as string}</p>
              )}
            </div>
            <div>
                <label htmlFor="siteEmpresa" className="block text-sm font-medium text-gray-300 mb-2">
                  Site da Empresa (opcional)
              </label>
              <input
                id="siteEmpresa"
                {...register('siteEmpresa')}
                  placeholder="Ex: https://www.empresa.com.br"
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              />
              {errors.siteEmpresa && (
                  <p className="text-red-400 text-sm mt-1">{errors.siteEmpresa.message as string}</p>
              )}
            </div>
          </div>

            <div>
              <label htmlFor="observacoesAdicionais" className="block text-sm font-medium text-gray-300 mb-2">
                Observações Adicionais (opcional)
            </label>
            <textarea
              id="observacoesAdicionais"
              {...register('observacoesAdicionais')}
              placeholder="Informações complementares relevantes..."
                rows={3}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
            />
              {errors.observacoesAdicionais && (
                <p className="text-red-400 text-sm mt-1">{errors.observacoesAdicionais.message as string}</p>
              )}
          </div>
          </>
        );
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {renderFormContent()}

        {error && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading}
            className="py-3 px-6 bg-[#FFC600] text-black rounded-lg font-medium hover:bg-[#FFD700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1117] focus:ring-[#FFC600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              Gerando Prompt...
            </>
          ) : (
            'Gerar Prompt'
          )}
        </button>
        </div>
      </form>

      {/* Modal para exibir o resultado */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={handleModalClose}
        >
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#FFC600]">Prompt Gerado</h2>
            <button
              onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-4 whitespace-pre-wrap font-mono text-sm text-gray-300">
              {promptResult}
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(promptResult)
                  alert('Prompt copiado para a área de transferência!')
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copiar Prompt
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([promptResult], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'prompt-assistente.txt'
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar Arquivo
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors ml-auto"
              >
                Fechar
              </button>
            </div>
            
            {/* Webhook Information Section - Only visible for admins */}
            <div className="mt-8 border-t border-gray-700 pt-6">
              <details className="text-left">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947z" clipRule="evenodd" />
                    <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  Informações do Webhook (Somente para Administradores)
                </summary>
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg text-sm text-gray-300">
                  <p>O formulário está configurado para enviar dados para o webhook:</p>
                  <code className="block mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto break-all">
                    https://autogrowth.cabonesolucoes.com.br/webhook/2e418174-0f99-403f-9539-2d1dacbceaa2-formulario-de-criacao-de-prompt-automatizado
                  </code>
                  <p className="mt-2 text-xs text-gray-400">
                    Este webhook está integrado com um fluxo de trabalho n8n que utiliza o modelo GPT-4o mini
                    para processar os dados do formulário. As seguintes operações são realizadas:
                  </p>
                  <ul className="list-disc ml-4 mt-1 text-xs text-gray-400">
                    <li>Recepção dos dados do formulário</li>
                    <li>Processamento dos dados com um agente de IA</li>
                    <li>Geração de um prompt personalizado</li>
                    <li>Retorno do prompt gerado para exibição ao usuário</li>
                  </ul>
                  <p className="mt-2 text-xs text-gray-400">
                    Para configurar ou modificar este webhook, por favor acesse o painel administrativo.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 