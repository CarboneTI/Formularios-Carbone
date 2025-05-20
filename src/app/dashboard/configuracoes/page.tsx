'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/config'
import { useSystemSettings } from '@/hooks/useSystemSettings'

// Cliente Supabase
const supabase = getSupabaseClient()

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState('basic')
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  
  // Hook para carregar e salvar configurações do sistema
  const { 
    settings, 
    loading: loadingSettings, 
    error: settingsError,
    saveSettings
  } = useSystemSettings()
  
  // Estados para configurações básicas
  const [emailNotificacoes, setEmailNotificacoes] = useState('admin@carbonecompany.com')
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true)
  const [tempoSessao, setTempoSessao] = useState('60')
  const [temaEscuro, setTemaEscuro] = useState(true)
  
  // Estados para configurações avançadas
  const [dominio, setDominio] = useState('app.carbonecompany.com')
  const [webhookUrl, setWebhookUrl] = useState('https://autogrowth.cabonesolucoes.com.br/webhook/b1551055-3ebb-4a94-8aea-89488772d8ff-unico')
  
  // Atualizar estados com configurações carregadas
  useEffect(() => {
    if (settings) {
      // Configurações básicas
      setEmailNotificacoes(settings.notification_email || emailNotificacoes)
      setNotificacoesAtivadas(settings.notifications_enabled ?? notificacoesAtivadas)
      setTempoSessao(settings.session_timeout || tempoSessao)
      setTemaEscuro(settings.dark_theme ?? temaEscuro)
      
      // Configurações avançadas
      setDominio(settings.domain || dominio)
      setWebhookUrl(settings.webhook_url || webhookUrl)
    }
  }, [settings])

  // Verificar autenticação e carregar dados iniciais
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificação de sessão
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log("Configurações - Usuário não autenticado, redirecionando para login")
          window.location.href = '/'
          return
        }
        
        // Em um caso real, você faria uma chamada para a API para verificar se o usuário é super admin
        // Aqui estamos apenas simulando para fins de demonstração
        const isAdmin = session.user.email === 'admin@carbonecompany.com'
        setIsSuperAdmin(isAdmin)
        
        // Carregar configurações do banco de dados
        // As configurações serão carregadas automaticamente pelo hook useSystemSettings
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        window.location.href = '/'
      }
    }
    
    checkAuth()
  }, [])

  // Funções para lidar com o envio do formulário básico
  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSaveSuccess(false)
    
    try {
      const result = await saveSettings(null, null, {
        notification_email: emailNotificacoes,
        notifications_enabled: notificacoesAtivadas,
        session_timeout: tempoSessao,
        dark_theme: temaEscuro
      })
      
      if (result.success) {
        setSaveSuccess(true)
      } else {
        setErrorMessage(result.message)
      }
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error)
      setErrorMessage(error.message || 'Falha ao salvar configurações')
    } finally {
      setLoading(false)
      
      // Reset do status de sucesso após 3 segundos
      if (saveSuccess) {
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      }
    }
  }
  
  // Funções para lidar com o envio do formulário avançado
  const handleAdvancedSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSaveSuccess(false)
    
    try {
      const result = await saveSettings(null, null, {
        domain: dominio,
        webhook_url: webhookUrl
      })
      
      if (result.success) {
        setSaveSuccess(true)
      } else {
        setErrorMessage(result.message)
      }
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error)
      setErrorMessage(error.message || 'Erro ao salvar configurações. Verifique sua conexão de rede.')
    } finally {
      setLoading(false)
      
      // Reset do status de sucesso após 3 segundos
      if (saveSuccess) {
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      }
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      {/* Abas */}
      <div className="flex space-x-1 border-b border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab('basic')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'basic' ? 'text-[#FFC600] border-b-2 border-[#FFC600]' : 'text-gray-400 hover:text-white'}`}
        >
          Configurações Básicas
        </button>
        
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('advanced')}
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'advanced' ? 'text-[#FFC600] border-b-2 border-[#FFC600]' : 'text-gray-400 hover:text-white'}`}
          >
            Configurações Avançadas
          </button>
        )}
      </div>
      
      {/* Configurações Básicas */}
      {activeTab === 'basic' && (
        <form onSubmit={handleBasicSubmit} className="space-y-8">
          {/* Email para notificações */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Notificações</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="emailNotificacoes" className="block text-sm font-medium text-gray-300 mb-2">
                  Email para notificações
                </label>
                <input
                  id="emailNotificacoes"
                  type="email"
                  value={emailNotificacoes}
                  onChange={(e) => setEmailNotificacoes(e.target.value)}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2.5 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  placeholder="email@exemplo.com"
                />
                <p className="mt-1 text-sm text-gray-400">
                  Todas as notificações do sistema serão enviadas para este email.
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  id="notificacoesAtivadas"
                  type="checkbox"
                  checked={notificacoesAtivadas}
                  onChange={(e) => setNotificacoesAtivadas(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-[#FFC600] focus:ring-[#FFC600] focus:ring-offset-gray-900"
                />
                <label htmlFor="notificacoesAtivadas" className="ml-2 block text-sm text-gray-300">
                  Ativar notificações por email
                </label>
              </div>
            </div>
          </div>
          
          {/* Configurações de segurança */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Segurança</h2>
            
            <div>
              <label htmlFor="tempoSessao" className="block text-sm font-medium text-gray-300 mb-2">
                Tempo de sessão (minutos)
              </label>
              <select
                id="tempoSessao"
                value={tempoSessao}
                onChange={(e) => setTempoSessao(e.target.value)}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2.5 px-3 text-white focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">60 minutos</option>
                <option value="120">2 horas</option>
                <option value="240">4 horas</option>
              </select>
              <p className="mt-1 text-sm text-gray-400">
                Define por quanto tempo a sessão permanece ativa sem atividade.
              </p>
            </div>
          </div>
          
          {/* Configurações de aparência */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Aparência</h2>
            
            <div className="flex items-center">
              <input
                id="temaEscuro"
                type="checkbox"
                checked={temaEscuro}
                onChange={(e) => setTemaEscuro(e.target.checked)}
                className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-[#FFC600] focus:ring-[#FFC600] focus:ring-offset-gray-900"
              />
              <label htmlFor="temaEscuro" className="ml-2 block text-sm text-gray-300">
                Tema escuro
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Atualmente, apenas o tema escuro está disponível. Mais opções em breve.
            </p>
          </div>
          
          {/* Botão de salvar */}
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#FFC600] text-black rounded-lg font-medium hover:bg-[#FFD700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1117] focus:ring-[#FFC600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : (
                'Salvar configurações'
              )}
            </button>
            
            {saveSuccess && (
              <span className="text-green-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Configurações salvas com sucesso!
              </span>
            )}
            
            {errorMessage && (
              <span className="text-red-500">
                {errorMessage}
              </span>
            )}
          </div>
        </form>
      )}
      
      {/* Configurações Avançadas */}
      {activeTab === 'advanced' && isSuperAdmin && (
        <div className="space-y-8">
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-blue-500 font-medium">Nota sobre configurações do banco de dados</h3>
                <p className="text-gray-300 text-sm mt-1">
                  As configurações do banco de dados (Supabase) são gerenciadas automaticamente pelo backend e não requerem configuração manual.
                  Em caso de necessidade de mudanças nessas configurações, entre em contato com o suporte técnico.
                </p>
              </div>
            </div>
          </div>
          
          {/* Configurações de Domínio */}
          <form onSubmit={handleAdvancedSubmit} className="space-y-8">
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Configurações de Domínio</h2>
              
              <div>
                <label htmlFor="dominio" className="block text-sm font-medium text-gray-300 mb-2">
                  Domínio da Aplicação
                </label>
                <input
                  id="dominio"
                  type="text"
                  value={dominio}
                  onChange={(e) => setDominio(e.target.value)}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2.5 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  placeholder="app.seudominio.com"
                />
                <p className="mt-1 text-sm text-gray-400">
                  O domínio onde a aplicação será acessada. O DNS deve estar configurado corretamente.
                </p>
              </div>
            </div>
            
            {/* Configurações de Webhook */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Configurações de Webhook</h2>
              
              <div>
                <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  URL do Webhook Principal
                </label>
                <input
                  id="webhookUrl"
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2.5 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  placeholder="https://webhook.seudominio.com/endpoint"
                />
                <p className="mt-1 text-sm text-gray-400">
                  URL para onde serão enviadas todas as notificações de formulários.
                </p>
              </div>
            </div>
            
            {/* Botão de salvar */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#FFC600] text-black rounded-lg font-medium hover:bg-[#FFD700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1117] focus:ring-[#FFC600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  'Salvar configurações'
                )}
              </button>
              
              {saveSuccess && (
                <span className="text-green-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Configurações salvas com sucesso!
                </span>
              )}
              
              {errorMessage && (
                <span className="text-red-500">
                  {errorMessage}
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  )
} 