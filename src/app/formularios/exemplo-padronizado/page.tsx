'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import FormLayout from '@/components/FormLayout'

// Schema de validação do formulário
const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  mensagem: z.string().min(5, 'Mensagem deve ter pelo menos 5 caracteres')
})

type FormData = z.infer<typeof formSchema>

export default function FormularioExemploPadronizado() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  })
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Dados do formulário:', data)
      
      // Simular sucesso
      setSubmitSuccess(true)
    } catch (err: any) {
      console.error('Erro ao enviar formulário:', err)
      setError(err.message || 'Erro ao processar formulário')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto my-8">
        <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">Formulário Enviado com Sucesso!</h2>
          <p className="text-gray-300 mb-6">Obrigado por enviar seu formulário. Entraremos em contato em breve.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Enviar Novo Formulário
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-3xl mx-auto my-8">
      <FormLayout
        title="Formulário de Exemplo Padronizado"
        subtitle="Este é um exemplo de formulário utilizando o layout padronizado"
        helpText="Preencha todos os campos abaixo para enviar sua mensagem. Campos com * são obrigatórios."
        submitLabel="Enviar Formulário"
        isLoading={isLoading}
        error={error}
        isValid={isValid}
        adminInfo={{
          webhookUrl: "https://webhook.example.com/form-endpoint",
          description: "Este formulário é apenas um exemplo para demonstrar o layout padronizado."
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
              Nome Completo*
            </label>
            <input
              id="nome"
              {...register('nome')}
              className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              placeholder="Digite seu nome completo"
            />
            {errors.nome && (
              <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              E-mail*
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium text-gray-300 mb-2">
              Mensagem*
            </label>
            <textarea
              id="mensagem"
              {...register('mensagem')}
              rows={5}
              className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              placeholder="Digite sua mensagem aqui..."
            />
            {errors.mensagem && (
              <p className="text-red-400 text-sm mt-1">{errors.mensagem.message}</p>
            )}
          </div>
          
          <div className="bg-blue-900/10 border border-blue-700/20 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              Este é apenas um formulário de exemplo para demonstrar o layout padronizado.
              Nenhum dado enviado será processado.
            </p>
          </div>
        </form>
      </FormLayout>
    </div>
  )
} 