'use client'

import PromptForm from '@/components/PromptForm'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useFormAccess } from '@/hooks/useFormAccess'
import { Loader2, ShieldAlert, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Define valid form types
type FormType = 'automoveis' | 'energia-solar' | 'outros';

export default function FormularioPromptPage() {
  const [selectedFormType, setSelectedFormType] = useState<FormType>('automoveis')
  const [currentStep, setCurrentStep] = useState(1)
  
  // Verificar acesso ao formulário
  const { 
    loading, 
    error, 
    hasAccess, 
    isPublic, 
    requiresAuth,
    isEnabled,
    formName,
    isAuthenticated
  } = useFormAccess('formulario-de-criacao-de-prompt')

  // Função para redirecionamento para login
  const redirectToLogin = () => {
    window.location.href = '/'
  }

  // Progress width based on current step
  const getProgressWidth = () => {
    switch (currentStep) {
      case 1: return '25%';
      case 2: return '50%';
      case 3: return '75%';
      case 4: return '100%';
      default: return '25%';
    }
  }

  // Se estiver carregando as configurações
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] text-white flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#FFC600] mb-4" />
        <h2 className="text-xl font-semibold">Verificando acesso ao formulário...</h2>
      </div>
    )
  }
  
  // Se o formulário não estiver ativo
  if (!isEnabled) {
    return (
      <div className="min-h-screen bg-[#0F1117] text-white flex flex-col items-center justify-center p-4">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-center">Formulário Indisponível</h2>
        <p className="text-gray-400 text-center max-w-md mb-8">
          Este formulário está temporariamente desativado. Entre em contato com o administrador para mais informações.
        </p>
        <Link 
          href="/dashboard" 
          className="bg-[#FFC600] text-black font-medium py-2 px-6 rounded-lg hover:bg-[#FFD700]"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    )
  }
  
  // Se o usuário não tem acesso ao formulário
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0F1117] text-white flex flex-col items-center justify-center p-4">
        <Lock className="h-16 w-16 text-[#FFC600] mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-center">Acesso Restrito</h2>
        <p className="text-gray-400 text-center max-w-md mb-8">
          {isPublic && requiresAuth 
            ? "Este formulário requer autenticação para acesso. Por favor, faça login para continuar."
            : "Você não tem permissão para acessar este formulário. Entre em contato com o administrador para solicitar acesso."}
        </p>
        <button 
          onClick={redirectToLogin}
          className="bg-[#FFC600] text-black font-medium py-2 px-6 rounded-lg hover:bg-[#FFD700]"
        >
          Fazer Login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <img 
              src="https://carbonecompany.com.br/wp-content/uploads/2025/02/android-chrome-512x512-2.png"
              alt="Carbone Company"
              className="h-8"
            />
            <span className="font-semibold text-lg">Central de Formulários</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.href = '/'
                }}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Sair
              </button>
            ) : (
              <Link 
                href="/"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Fazer Login
              </Link>
            )}
            
            <Link 
              href="/dashboard" 
              className="text-sm text-gray-300 hover:text-white flex items-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Voltar ao Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6">
        {/* Form Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">
            Criação de <span className="text-[#FFC600]">Prompt</span> Personalizado
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Preencha o formulário abaixo para gerar um prompt personalizado para assistentes virtuais
            da sua empresa. O formulário irá criar instruções detalhadas para atendimento automatizado.
          </p>
        </div>

        {/* Form Type Buttons */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-gray-800 rounded-lg">
            <button
              onClick={() => setSelectedFormType('automoveis')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedFormType === 'automoveis' 
                ? 'bg-[#FFC600] text-black' 
                : 'text-gray-300 hover:text-white'
              }`}
            >
              Automóveis
            </button>
            <button
              onClick={() => setSelectedFormType('energia-solar')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedFormType === 'energia-solar' 
                ? 'bg-[#FFC600] text-black' 
                : 'text-gray-300 hover:text-white'
              }`}
            >
              Energia Solar
            </button>
            <button
              onClick={() => setSelectedFormType('outros')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedFormType === 'outros' 
                ? 'bg-[#FFC600] text-black' 
                : 'text-gray-300 hover:text-white'
              }`}
            >
              Outros
            </button>
          </div>
        </div>

        {/* Steps indicator - Fixed alignment */}
        <div className="mb-12">
          <div className="max-w-3xl mx-auto px-6">
            {/* Numbered steps */}
            <div className="flex justify-between relative">
              <div className="text-center">
                <div className={`w-10 h-10 mx-auto rounded-full ${currentStep >= 1 ? 'bg-[#FFC600] text-black' : 'bg-gray-700 text-white'} flex items-center justify-center font-bold`}>1</div>
                <div className={`mt-2 text-sm font-medium ${currentStep >= 1 ? 'text-[#FFC600]' : 'text-gray-400'}`}>Informações Básicas</div>
              </div>
              <div className="text-center">
                <div className={`w-10 h-10 mx-auto rounded-full ${currentStep >= 2 ? 'bg-[#FFC600] text-black' : 'bg-gray-700 text-white'} flex items-center justify-center font-bold`}>2</div>
                <div className={`mt-2 text-sm ${currentStep >= 2 ? 'text-[#FFC600] font-medium' : 'text-gray-400'}`}>Detalhes da Empresa</div>
              </div>
              <div className="text-center">
                <div className={`w-10 h-10 mx-auto rounded-full ${currentStep >= 3 ? 'bg-[#FFC600] text-black' : 'bg-gray-700 text-white'} flex items-center justify-center font-bold`}>3</div>
                <div className={`mt-2 text-sm ${currentStep >= 3 ? 'text-[#FFC600] font-medium' : 'text-gray-400'}`}>Regras e Proibições</div>
              </div>
              <div className="text-center">
                <div className={`w-10 h-10 mx-auto rounded-full ${currentStep >= 4 ? 'bg-[#FFC600] text-black' : 'bg-gray-700 text-white'} flex items-center justify-center font-bold`}>4</div>
                <div className={`mt-2 text-sm ${currentStep >= 4 ? 'text-[#FFC600] font-medium' : 'text-gray-400'}`}>Finalização</div>
              </div>
            </div>
            
            {/* Progress bar - correctly centered on steps */}
            <div className="h-1 bg-gray-700 absolute w-full top-5 -z-10">
              <div 
                className="h-1 bg-[#FFC600] absolute top-0 left-0" 
                style={{ width: getProgressWidth() }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Container - Centered with mx-auto */}
        <div className="max-w-4xl mx-auto bg-gray-900/30 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <PromptForm 
              formType={selectedFormType} 
              onStepChange={setCurrentStep}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/20 border-t border-gray-800 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img 
                src="https://carbonecompany.com.br/wp-content/uploads/2025/02/android-chrome-512x512-2.png"
                alt="Carbone Company"
                className="h-6"
              />
              <p className="text-sm text-gray-500 mt-2">© {new Date().getFullYear()} Carbone Company. Todos os direitos reservados.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#FFC600]">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFC600]">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFC600]">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 