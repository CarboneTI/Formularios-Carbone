'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import DateTimePicker from '@/components/DateTimePicker'

export const metadata = {
  title: 'Formulário de Reagendamento | Central de Formulários',
  description: 'Formulário para reagendamento de horários da Carbone Company',
}

export default function ReagendamentoPage() {
  const [selectedDateTime, setSelectedDateTime] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica de submissão aqui
    console.log('Data/hora selecionada:', selectedDateTime)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <header>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Voltar ao Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">
          Formulário <span className="text-[#FFC600]">Reagendamento</span>
        </h1>
        
        <p className="text-gray-400 mb-6">
          Selecione a data/hora (São Paulo) e escolha um agendamento existente.
        </p>
      </header>

      <main className="form-container">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DateTimePicker
            label="Data e Hora"
            value={selectedDateTime}
            onChange={setSelectedDateTime}
            required
          />

          {/* Aqui virá a lista de agendamentos disponíveis */}
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedDateTime}
            >
              Continuar
            </button>
          </div>
        </form>
      </main>
    </div>
  )
} 