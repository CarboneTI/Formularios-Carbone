import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Erro ao ler ${key} do localStorage:`, error)
      return initialValue
    }
  })

  // Função para salvar valor no localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que o valor seja uma função
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Salvar no estado
      setStoredValue(valueToStore)
      
      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Erro ao salvar ${key} no localStorage:`, error)
    }
  }

  // Sincronizar com outros tabs/windows
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue
          setStoredValue(newValue)
        } catch (error) {
          console.warn(`Erro ao sincronizar ${key} do localStorage:`, error)
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, initialValue])

  return [storedValue, setValue] as const
}

// Hook para formulários com auto-save
export function useFormAutoSave<T extends object>(
  formId: string,
  initialData: T,
  onSave?: (data: T) => void
) {
  const [data, setData] = useLocalStorage<T>(`form_${formId}`, initialData)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Função para salvar dados
  const saveData = (newData: T) => {
    setData(newData)
    setLastSaved(new Date())
    onSave?.(newData)
  }

  // Função para limpar dados salvos
  const clearSavedData = () => {
    setData(initialData)
    setLastSaved(null)
  }

  return {
    data,
    saveData,
    clearSavedData,
    lastSaved
  }
}

// Hook para credenciais
export function useCredentials() {
  const [credentials, setCredentials] = useLocalStorage('credentials', {
    supabaseUrl: '',
    supabaseKey: '',
    isConfigured: false
  })

  const saveCredentials = (url: string, key: string) => {
    setCredentials({
      supabaseUrl: url,
      supabaseKey: key,
      isConfigured: true
    })
  }

  const clearCredentials = () => {
    setCredentials({
      supabaseUrl: '',
      supabaseKey: '',
      isConfigured: false
    })
  }

  return {
    credentials,
    saveCredentials,
    clearCredentials,
    isConfigured: credentials.isConfigured
  }
}

// Hook para configurações do usuário
export function useUserSettings() {
  const [settings, setSettings] = useLocalStorage('user_settings', {
    theme: 'dark',
    language: 'pt-BR',
    notifications: true
  })

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }))
  }

  return {
    settings,
    updateSettings
  }
} 