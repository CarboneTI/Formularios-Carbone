'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Shield, CheckCircle, XCircle, Save } from 'lucide-react'

// Tipagem dos dados de formulário
interface FormSettings {
  id: string
  form_id: string
  form_name: string
  description: string
  is_public: boolean
  requires_auth: boolean
  enabled: boolean
  created_at: string
  updated_at: string
}

export default function ConfiguracoesAvancadas() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [formSettings, setFormSettings] = useState<FormSettings[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Verificar autenticação e carregar configurações
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificação normal de sessão
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log("Configurações Avançadas - Usuário não autenticado, redirecionando para login")
          window.location.href = '/'
          return
        }
        
        // Verificar se é admin (isso deveria ser feito no servidor em um caso real)
        const isAdmin = session.user.email === 'admin@carbonecompany.com'
        if (!isAdmin) {
          console.log("Configurações Avançadas - Usuário não é admin, redirecionando")
          window.location.href = '/dashboard'
          return
        }
        
        setIsSuperAdmin(true)
        
        // Carregar as configurações dos formulários
        fetchFormSettings()
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        window.location.href = '/'
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  // Atualizar configuração de um formulário
  const updateFormSetting = (formId: string, field: string, value: boolean) => {
    setFormSettings(prevSettings => 
      prevSettings.map(form => 
        form.form_id === formId ? { ...form, [field]: value } : form
      )
    )
  }

  // Salvar configurações
  const saveSettings = async () => {
    setSaving(true)
    setErrorMessage('')
    setSuccessMessage('')
    
    try {
      // Salvar cada configuração atualizada
      for (const form of formSettings) {
        const { error } = await supabase
          .from('form_settings')
          .upsert({
            id: form.id,
            form_id: form.form_id,
            form_name: form.form_name,
            description: form.description,
            is_public: form.is_public,
            requires_auth: form.requires_auth,
            enabled: form.enabled,
            updated_at: new Date().toISOString()
          }, { onConflict: 'form_id' })
        
        if (error) {
          console.error(`Erro ao salvar configuração para ${form.form_name}:`, error)
          setErrorMessage(`Falha ao salvar configurações: ${error.message}`)
          return
        }
      }
      
      setSuccessMessage('Configurações salvas com sucesso!')
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error)
      setErrorMessage(error.message || 'Ocorreu um erro ao salvar as configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFC600]" />
        <span className="ml-2">Carregando configurações...</span>
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="p-6 bg-red-900/30 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta página. Este recurso é exclusivo para administradores.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações Avançadas</h1>
          <p className="text-gray-400">Configure opções avançadas do sistema e acesso aos formulários</p>
        </div>
        
        <button 
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-[#FFC600] text-black font-medium rounded-lg hover:bg-[#FFD700] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {/* Mensagens de erro/sucesso */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-white">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            {errorMessage}
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg text-white">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            {successMessage}
          </div>
        </div>
      )}

      {/* Seção de configuração de formulários */}
      <div className="bg-gray-900/50 p-6 rounded-xl">
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 mr-2 text-[#FFC600]" />
          <h2 className="text-xl font-semibold">Configurações de Acesso aos Formulários</h2>
        </div>
        
        <p className="text-gray-400 mb-6">
          Configure quais formulários são públicos (não exigem login) e quais exigem autenticação.
          Os formulários podem ser totalmente desativados se necessário.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 px-4 text-left">Formulário</th>
                <th className="py-3 px-4 text-center">Público</th>
                <th className="py-3 px-4 text-center">Requer Autenticação</th>
                <th className="py-3 px-4 text-center">Ativo</th>
              </tr>
            </thead>
            <tbody>
              {formSettings.map((form) => (
                <tr key={form.form_id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4">
                    <div>
                      <h3 className="font-medium">{form.form_name}</h3>
                      <p className="text-sm text-gray-400">{form.description}</p>
                      <p className="text-xs text-gray-500">ID: {form.form_id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={form.is_public}
                        onChange={(e) => updateFormSetting(form.form_id, 'is_public', e.target.checked)}
                      />
                      <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FFC600] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFC600]"></div>
                    </label>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={form.requires_auth}
                        onChange={(e) => updateFormSetting(form.form_id, 'requires_auth', e.target.checked)}
                        disabled={!form.is_public} // Desabilitar se o formulário não for público
                      />
                      <div className={`relative w-11 h-6 ${!form.is_public ? 'bg-gray-900 opacity-50' : 'bg-gray-700'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FFC600] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFC600]`}></div>
                    </label>
                    {!form.is_public && (
                      <p className="text-xs text-gray-500 mt-1">Formulário não é público</p>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={form.enabled}
                        onChange={(e) => updateFormSetting(form.form_id, 'enabled', e.target.checked)}
                      />
                      <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FFC600] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFC600]"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-gray-900/30 border border-gray-800 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Explicação das opções</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><strong>Público:</strong> Se ativado, o formulário pode ser acessado sem estar logado no sistema.</li>
            <li><strong>Requer Autenticação:</strong> Mesmo que seja público, ainda requer que o usuário esteja autenticado para acessar. Esta opção só funciona se o formulário for marcado como público.</li>
            <li><strong>Ativo:</strong> Se desativado, o formulário não ficará disponível para nenhum usuário, independentemente das outras configurações.</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 