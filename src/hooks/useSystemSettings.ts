import { useState, useEffect } from 'react'

interface SystemSettings {
  domain?: string
  webhook_url?: string
  notification_email?: string
  notifications_enabled?: boolean
  session_timeout?: string
  dark_theme?: boolean
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // Carregar configurações
  const loadSettings = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/system-settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao carregar configurações')
      }
      
      setSettings(data.settings)
    } catch (error: any) {
      console.error('Erro ao carregar configurações:', error)
      setError(error.message || 'Erro ao carregar configurações do sistema')
    } finally {
      setLoading(false)
    }
  }
  
  // Salvar configurações
  const saveSettings = async (
    _supabaseUrl: string | null, // Parâmetro mantido por retrocompatibilidade, mas não é mais utilizado
    _supabaseKey: string | null, // Parâmetro mantido por retrocompatibilidade, mas não é mais utilizado
    newSettings: SystemSettings
  ) => {
    try {
      const response = await fetch('/api/admin/system-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newSettings
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao salvar configurações')
      }
      
      // Atualizar configurações locais
      setSettings(prev => ({
        ...prev,
        ...newSettings
      }))
      
      return { success: true, message: data.message || 'Configurações salvas com sucesso' }
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error)
      return { 
        success: false, 
        message: error.message || 'Erro ao salvar configurações do sistema' 
      }
    }
  }
  
  // Carregar configurações ao montar o componente
  useEffect(() => {
    loadSettings()
  }, [])
  
  return {
    settings,
    loading,
    error,
    loadSettings,
    saveSettings
  }
} 