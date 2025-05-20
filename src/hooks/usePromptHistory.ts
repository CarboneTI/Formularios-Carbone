import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { getSupabaseClient } from '@/lib/supabase-init'
import { PromptHistoryItem } from '@/lib/schemas/prompt-history'

const MAX_LOCAL_HISTORY = 50 // Limite de itens no histórico local

export function usePromptHistory(userId?: string) {
  const [history, setHistory] = useLocalStorage<PromptHistoryItem[]>('prompt_history', [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = getSupabaseClient()

  // Carregar histórico do banco de dados quando o usuário estiver autenticado
  useEffect(() => {
    if (userId) {
      loadHistoryFromDatabase()
    }
  }, [userId])

  // Carregar histórico do banco de dados
  const loadHistoryFromDatabase = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('prompt_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        // Converter dados do banco para o formato local
        const dbHistory: PromptHistoryItem[] = data.map(item => ({
          id: item.id,
          userId: item.user_id,
          prompt: item.prompt,
          response: item.response,
          formType: item.form_type,
          formData: item.form_data,
          createdAt: item.created_at,
          isSynced: true
        }))

        // Mesclar com histórico local, mantendo os mais recentes
        const mergedHistory = mergeHistories(history, dbHistory)
        setHistory(mergedHistory)
      }
    } catch (err: any) {
      console.error('Erro ao carregar histórico:', err)
      setError('Falha ao carregar histórico do banco de dados')
    } finally {
      setIsLoading(false)
    }
  }

  // Mesclar históricos local e do banco
  const mergeHistories = (local: PromptHistoryItem[], db: PromptHistoryItem[]) => {
    const merged = [...local, ...db]
    
    // Remover duplicados mantendo a versão mais recente
    const unique = merged.reduce((acc, current) => {
      const exists = acc.find(item => item.id === current.id)
      if (!exists) {
        acc.push(current)
      } else if (new Date(current.createdAt) > new Date(exists.createdAt)) {
        acc[acc.indexOf(exists)] = current
      }
      return acc
    }, [] as PromptHistoryItem[])

    // Ordenar por data mais recente
    return unique
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, MAX_LOCAL_HISTORY)
  }

  // Adicionar novo item ao histórico
  const addToHistory = async (
    prompt: string,
    response: string,
    formType: string,
    formData: Record<string, any>
  ) => {
    try {
      setError(null)
      
      const newItem: PromptHistoryItem = {
        id: crypto.randomUUID(),
        userId,
        prompt,
        response,
        formType,
        formData,
        createdAt: new Date().toISOString(),
        isSynced: false
      }

      // Adicionar ao histórico local
      const updatedHistory = [newItem, ...history].slice(0, MAX_LOCAL_HISTORY)
      setHistory(updatedHistory)

      // Se usuário estiver autenticado, salvar no banco
      if (userId) {
        setIsLoading(true)
        const { error: dbError } = await supabase
          .from('prompt_history')
          .insert({
            id: newItem.id,
            user_id: userId,
            prompt: newItem.prompt,
            response: newItem.response,
            form_type: newItem.formType,
            form_data: newItem.formData,
            created_at: newItem.createdAt
          })

        if (dbError) throw dbError

        // Marcar como sincronizado
        const syncedHistory = updatedHistory.map(item =>
          item.id === newItem.id ? { ...item, isSynced: true } : item
        )
        setHistory(syncedHistory)
      }
    } catch (err: any) {
      console.error('Erro ao adicionar ao histórico:', err)
      setError('Falha ao salvar no histórico')
    } finally {
      setIsLoading(false)
    }
  }

  // Limpar histórico
  const clearHistory = async () => {
    try {
      setError(null)
      setIsLoading(true)

      // Limpar histórico local
      setHistory([])

      // Se usuário estiver autenticado, limpar do banco
      if (userId) {
        const { error: dbError } = await supabase
          .from('prompt_history')
          .delete()
          .eq('user_id', userId)

        if (dbError) throw dbError
      }
    } catch (err: any) {
      console.error('Erro ao limpar histórico:', err)
      setError('Falha ao limpar histórico')
    } finally {
      setIsLoading(false)
    }
  }

  // Remover item específico do histórico
  const removeFromHistory = async (itemId: string) => {
    try {
      setError(null)
      setIsLoading(true)

      // Remover do histórico local
      const updatedHistory = history.filter(item => item.id !== itemId)
      setHistory(updatedHistory)

      // Se usuário estiver autenticado, remover do banco
      if (userId) {
        const { error: dbError } = await supabase
          .from('prompt_history')
          .delete()
          .eq('id', itemId)

        if (dbError) throw dbError
      }
    } catch (err: any) {
      console.error('Erro ao remover item do histórico:', err)
      setError('Falha ao remover item do histórico')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    history,
    isLoading,
    error,
    addToHistory,
    clearHistory,
    removeFromHistory,
    refreshHistory: loadHistoryFromDatabase
  }
} 