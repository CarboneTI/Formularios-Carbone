'use client'

import { useState } from 'react'
import { Form } from '@/lib/schemas/form'
import DynamicForm from '@/components/forms/DynamicForm'
import { useFormAutoSave } from '@/hooks/useLocalStorage'

// Exemplo de formulário usando o novo padrão
const exampleForm: Form = {
  id: 'form-example',
  title: 'Formulário de Exemplo',
  description: 'Este é um exemplo de formulário usando o novo padrão de implementação.',
  isActive: true,
  isPublic: true,
  requiresAuth: false,
  sections: [
    {
      id: 'section-1',
      title: 'Informações Pessoais',
      description: 'Preencha seus dados pessoais',
      order: 0,
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Nome Completo',
          name: 'name',
          placeholder: 'Digite seu nome completo',
          required: true
        },
        {
          id: 'email',
          type: 'email',
          label: 'E-mail',
          name: 'email',
          placeholder: 'Digite seu e-mail',
          required: true
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Telefone',
          name: 'phone',
          placeholder: '(00) 00000-0000',
          required: true
        }
      ]
    },
    {
      id: 'section-2',
      title: 'Endereço',
      description: 'Informe seu endereço completo',
      order: 1,
      fields: [
        {
          id: 'street',
          type: 'text',
          label: 'Rua',
          name: 'street',
          placeholder: 'Nome da rua',
          required: true
        },
        {
          id: 'number',
          type: 'text',
          label: 'Número',
          name: 'number',
          placeholder: 'Número',
          required: true
        },
        {
          id: 'complement',
          type: 'text',
          label: 'Complemento',
          name: 'complement',
          placeholder: 'Apartamento, bloco, etc.',
          required: false
        },
        {
          id: 'city',
          type: 'text',
          label: 'Cidade',
          name: 'city',
          placeholder: 'Nome da cidade',
          required: true
        },
        {
          id: 'state',
          type: 'select',
          label: 'Estado',
          name: 'state',
          required: true,
          options: [
            { label: 'Selecione', value: '' },
            { label: 'São Paulo', value: 'SP' },
            { label: 'Rio de Janeiro', value: 'RJ' },
            { label: 'Minas Gerais', value: 'MG' }
          ]
        }
      ]
    },
    {
      id: 'section-3',
      title: 'Preferências',
      description: 'Configure suas preferências',
      order: 2,
      fields: [
        {
          id: 'notifications',
          type: 'checkbox',
          label: 'Desejo receber notificações por e-mail',
          name: 'notifications',
          required: false
        },
        {
          id: 'interests',
          type: 'multiselect',
          label: 'Áreas de Interesse',
          name: 'interests',
          required: true,
          options: [
            { label: 'Tecnologia', value: 'tech' },
            { label: 'Saúde', value: 'health' },
            { label: 'Educação', value: 'education' },
            { label: 'Finanças', value: 'finance' }
          ]
        },
        {
          id: 'comments',
          type: 'textarea',
          label: 'Comentários Adicionais',
          name: 'comments',
          placeholder: 'Digite seus comentários aqui...',
          required: false
        }
      ]
    }
  ]
}

export default function FormularioExemploPadronizado() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Usar hook de auto-save
  const { data, saveData, clearSavedData, lastSaved } = useFormAutoSave(
    'form-example',
    {},
    (data) => {
      console.log('Dados salvos automaticamente:', data)
    }
  )

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Dados do formulário:', formData)
      
      // Limpar dados salvos após envio bem-sucedido
      clearSavedData()
      
      // Redirecionar ou mostrar mensagem de sucesso
      window.location.href = '/formularios/sucesso'
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error)
      setError(error.message || 'Erro ao processar formulário')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <DynamicForm
        form={exampleForm}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
      
      {lastSaved && (
        <p className="text-sm text-gray-400 mt-4">
          Último salvamento automático: {lastSaved.toLocaleString()}
        </p>
      )}
    </div>
  )
} 