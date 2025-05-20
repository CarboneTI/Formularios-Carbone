'use client'

import { useFormContext } from 'react-hook-form'
import { FormData } from '@/lib/schemas'

interface FormSectionProps {
  formType: 'automoveis' | 'energia-solar' | 'outros'
  currentSection: number
  placeholders: {
    automoveis: {
      tiposVeiculos: string
      marcasTrabalhadas: string
      formasPagamento: string
      taxasAdicionais: string
      diferenciais: string
    }
    'energia-solar': {
      tiposSistemas: string
      marcasEquipamentos: string
      formasPagamento: string
      beneficiosEconomicos: string
      diferenciais: string
    }
    outros: {
      tipoServico: string
      publico: string
      precosServicos: string
      politicasCancelamento: string
      diferenciais: string
    }
  }
}

export default function FormSection({ formType, currentSection, placeholders }: FormSectionProps) {
  const { register, formState: { errors } } = useFormContext<FormData>()

  // Helper function to safely access errors
  const getFieldError = (fieldName: string) => {
    return errors[fieldName as keyof FormData]?.message
  }

  // Render different sections based on currentSection
  switch (currentSection) {
    case 1:
      return (
        <div className="space-y-6">
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
              {getFieldError('nomeEmpresa') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('nomeEmpresa')}</p>
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
              {getFieldError('tempoMercado') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('tempoMercado')}</p>
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
            {getFieldError('localizacao') && (
              <p className="text-red-400 text-sm mt-1">{getFieldError('localizacao')}</p>
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
              {getFieldError('nomeAssistente') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('nomeAssistente')}</p>
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
              {getFieldError('generoBot') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('generoBot')}</p>
              )}
            </div>
          </div>
        </div>
      )

    case 2:
      return (
        <div className="space-y-6">
          <div className="border-t border-gray-800 pt-8 mt-8">
            <h3 className="text-lg font-semibold mb-4 text-[#FFC600]">Detalhes da Empresa</h3>
          </div>

          {formType === 'automoveis' && (
            <>
              <div>
                <label htmlFor="tiposVeiculos" className="block text-sm font-medium text-gray-300 mb-2">
                  Tipos de Veículos Vendidos*
                </label>
                <textarea
                  id="tiposVeiculos"
                  {...register('tiposVeiculos')}
                  placeholder={placeholders.automoveis.tiposVeiculos}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                />
                {getFieldError('tiposVeiculos') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('tiposVeiculos')}</p>
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
                    placeholder={placeholders.automoveis.marcasTrabalhadas}
                    rows={3}
                    className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  />
                  {getFieldError('marcasTrabalhadas') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('marcasTrabalhadas')}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="formasPagamento" className="block text-sm font-medium text-gray-300 mb-2">
                    Formas de Pagamento Aceitas*
                  </label>
                  <textarea
                    id="formasPagamento"
                    {...register('formasPagamento')}
                    placeholder={placeholders.automoveis.formasPagamento}
                    rows={3}
                    className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  />
                  {getFieldError('formasPagamento') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('formasPagamento')}</p>
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
                    placeholder={placeholders.automoveis.diferenciais}
                    rows={3}
                    className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  />
                  {getFieldError('diferenciais') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('diferenciais')}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="taxasAdicionais" className="block text-sm font-medium text-gray-300 mb-2">
                    Taxas e Custos Adicionais*
                  </label>
                  <textarea
                    id="taxasAdicionais"
                    {...register('taxasAdicionais')}
                    placeholder={placeholders.automoveis.taxasAdicionais}
                    rows={3}
                    className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  />
                  {getFieldError('taxasAdicionais') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('taxasAdicionais')}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {formType === 'energia-solar' && (
            <>
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
                  {getFieldError('marcasEquipamentos') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('marcasEquipamentos')}</p>
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
                  {getFieldError('formasPagamento') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('formasPagamento')}</p>
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
                  {getFieldError('diferenciais') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('diferenciais')}</p>
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
                  {getFieldError('beneficiosEconomicos') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('beneficiosEconomicos')}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {formType === 'outros' && (
            <>
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
                {getFieldError('tipoServico') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('tipoServico')}</p>
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
                  {getFieldError('publico') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('publico')}</p>
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
                  {getFieldError('formasPagamento') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('formasPagamento')}</p>
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
                  {getFieldError('diferenciais') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('diferenciais')}</p>
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
                  {getFieldError('precosServicos') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('precosServicos')}</p>
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
                {getFieldError('politicasCancelamento') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('politicasCancelamento')}</p>
                )}
              </div>
            </>
          )}
        </div>
      )

    case 3:
      return (
        <div className="space-y-6">
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
            {getFieldError('regrasCriticas') && (
              <p className="text-red-400 text-sm mt-1">{getFieldError('regrasCriticas')}</p>
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
            {getFieldError('proibicoesAbsolutas') && (
              <p className="text-red-400 text-sm mt-1">{getFieldError('proibicoesAbsolutas')}</p>
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
            {getFieldError('exemplosConversas') && (
              <p className="text-red-400 text-sm mt-1">{getFieldError('exemplosConversas')}</p>
            )}
          </div>
        </div>
      )

    case 4:
      return (
        <div className="space-y-6">
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
              {getFieldError('emailContato') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('emailContato')}</p>
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
              {getFieldError('siteEmpresa') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('siteEmpresa')}</p>
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
            {getFieldError('observacoesAdicionais') && (
              <p className="text-red-400 text-sm mt-1">{getFieldError('observacoesAdicionais')}</p>
            )}
          </div>
        </div>
      )

    default:
      return null
  }
} 