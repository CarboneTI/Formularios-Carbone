'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Interface para formulários disponíveis
interface Form {
  id: string;
  name: string;
  description: string;
  route: string;
  iconComponent: JSX.Element;
  isNew?: boolean;
}

export default function AvailableForms() {
  // Lista de formulários disponíveis
  const forms: Form[] = [
    {
      id: 'prompt-auto',
      name: 'Prompt Automóveis',
      description: 'Gere prompts para assistentes virtuais de empresas de automóveis.',
      route: '/formularios/formulario-de-criacao-de-prompt',
      iconComponent: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'prompt-imoveis',
      name: 'Prompt Imóveis',
      description: 'Em breve: Assistentes virtuais para imobiliárias.',
      route: '#',
      iconComponent: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      isNew: true
    },
    {
      id: 'prompt-servicos',
      name: 'Prompt Serviços',
      description: 'Em breve: Assistentes para empresas de serviços gerais.',
      route: '#',
      iconComponent: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {forms.map((form) => (
          <Link 
            key={form.id} 
            href={form.route} 
            className={`relative bg-gray-900/50 p-6 rounded-xl hover:bg-gray-800/70 transition-colors ${form.route === '#' ? 'cursor-not-allowed opacity-70 hover:bg-gray-900/50' : ''}`}
            onClick={(e) => form.route === '#' && e.preventDefault()}
            target={form.route !== '#' ? '_blank' : undefined}
          >
            {form.isNew && (
              <span className="absolute top-4 right-4 bg-[#FFC600] text-black text-xs font-bold px-2 py-1 rounded-full">
                Em breve
              </span>
            )}
            <div className="flex items-center mb-3">
              <div className="bg-gray-800 p-2 rounded-lg mr-3 text-[#FFC600]">
                {form.iconComponent}
              </div>
              <h3 className="text-lg font-semibold">{form.name}</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {form.description}
            </p>
            <div className="flex justify-end">
              <span className={`text-sm font-medium ${form.route === '#' ? 'text-gray-500' : 'text-[#FFC600]'}`}>
                {form.route === '#' ? 'Em desenvolvimento' : 'Acessar formulário →'}
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-900/30 border border-gray-800 rounded-lg text-center">
        <p className="text-gray-400 text-sm">
          Mais formulários serão adicionados em breve. Entre em contato com o administrador para solicitar novos modelos.
        </p>
      </div>
    </div>
  )
} 