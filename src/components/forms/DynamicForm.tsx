import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form as FormType, formSchema } from '@/lib/schemas/form'
import FormSection from './FormSection'

interface DynamicFormProps {
  form: FormType
  onSubmit: (data: any) => void
  isLoading?: boolean
  error?: string
  className?: string
}

export default function DynamicForm({
  form,
  onSubmit,
  isLoading = false,
  error,
  className = ''
}: DynamicFormProps) {
  const methods = useForm({
    resolver: zodResolver(formSchema)
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={`space-y-8 ${className}`}
      >
        {/* Cabeçalho do formulário */}
        <div>
          <h2 className="text-2xl font-bold">{form.title}</h2>
          {form.description && (
            <p className="mt-2 text-gray-400">{form.description}</p>
          )}
        </div>

        {/* Seções do formulário */}
        <div className="space-y-12">
          {form.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <FormSection key={section.id} section={section} />
            ))}
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-white">
            {error}
          </div>
        )}

        {/* Botão de envio */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#FFC600] text-gray-900 font-medium rounded-lg hover:bg-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </div>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  )
} 