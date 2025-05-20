'use client'

import PromptForm from '@/components/PromptForm'

export default function PromptsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            Desenvolvimento de Prompts
          </h1>
          <p className="text-gray-300">
            Preencha o formulário abaixo para gerar um prompt personalizado para seu negócio.
          </p>
        </div>
        <PromptForm />
      </div>
    </div>
  )
} 