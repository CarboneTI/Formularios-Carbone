import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface FormAccessConfig {
  isPublic: boolean
  requiresAuth: boolean
  isEnabled: boolean
  formName: string
  formDescription: string
}

/**
 * Hook para verificar se um formulário pode ser acessado com base nas configurações
 * @param formId O ID do formulário a ser verificado
 * @returns Objeto com as configurações de acesso do formulário
 */
export function useFormAccess(formId: string) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accessConfig, setAccessConfig] = useState<FormAccessConfig>({
    isPublic: true,        // Todos os formulários são públicos agora
    requiresAuth: false,   // Não requer autenticação
    isEnabled: true,       // Todos os formulários estão habilitados
    formName: '',
    formDescription: ''
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loadFormSettings = async () => {
      try {
        setLoading(true)
        
        // Verificar se o usuário está autenticado
        const { data: { session } } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
        
        // Buscar configurações do formulário
        const { data: formSettings, error } = await supabase
          .from('form_settings')
          .select('*')
          .eq('form_id', formId)
          .single()
        
        if (error) {
          console.error('Erro ao carregar configurações do formulário:', error)
          setError(`Erro ao verificar acesso ao formulário: ${error.message}`)
          
          // Se houver erro, usamos as configurações padrão (tornando o formulário acessível)
          setAccessConfig({
            isPublic: true,
            requiresAuth: false,
            isEnabled: true,
            formName: 'Formulário',
            formDescription: 'Descrição não disponível'
          })
        } else if (formSettings) {
          // Agora estamos ignorando as configurações restritivas
          setAccessConfig({
            isPublic: true,  // Sempre público
            requiresAuth: false, // Não requer autenticação
            isEnabled: formSettings.enabled || true, // Mantemos enabled como única restrição
            formName: formSettings.form_name || 'Formulário',
            formDescription: formSettings.description || 'Descrição não disponível'
          })
        }
      } catch (err: any) {
        console.error('Erro ao verificar acesso ao formulário:', err)
        setError(err.message || 'Ocorreu um erro ao verificar o acesso ao formulário')
      } finally {
        setLoading(false)
      }
    }
    
    loadFormSettings()
  }, [formId])

  // Verificar se o usuário tem acesso ao formulário
  const hasAccess = () => {
    // Agora só verificamos se o formulário está ativo
    return accessConfig.isEnabled;
  }

  return {
    loading,
    error,
    isPublic: true,  // Sempre retorna true
    requiresAuth: false, // Sempre retorna false
    isEnabled: accessConfig.isEnabled,
    formName: accessConfig.formName,
    formDescription: accessConfig.formDescription,
    isAuthenticated,
    hasAccess: hasAccess()
  }
} 