import React from 'react'
import { PromptHistoryItem } from '@/lib/schemas/prompt-history'

interface PromptHistoryProps {
  history: PromptHistoryItem[]
  isLoading: boolean
  error: string | null
  onClear: () => void
  onRemove: (id: string) => void
  onSelect: (item: PromptHistoryItem) => void
}

export default function PromptHistory({
  history,
  isLoading,
  error,
  onClear,
  onRemove,
  onSelect
}: PromptHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 border-2 border-[#FFC600] border-t-transparent rounded-full animate-spin" />
        <span className="ml-2 text-gray-400">Carregando histórico...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-white">
        {error}
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Nenhum prompt no histórico</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Histórico de Prompts</h3>
        <button
          onClick={onClear}
          className="text-sm text-red-500 hover:text-red-400 transition-colors"
        >
          Limpar histórico
        </button>
      </div>

      {/* Lista de prompts */}
      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition-colors group"
          >
            {/* Cabeçalho do item */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                {new Date(item.createdAt).toLocaleString()}
              </span>
              <div className="flex items-center space-x-2">
                {!item.isSynced && (
                  <span className="text-yellow-500 text-sm">Não sincronizado</span>
                )}
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Conteúdo do item */}
            <div
              onClick={() => onSelect(item)}
              className="cursor-pointer"
            >
              <div className="mb-2">
                <h4 className="text-sm font-medium text-[#FFC600] mb-1">Prompt</h4>
                <p className="text-sm text-gray-300">{item.prompt}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-[#FFC600] mb-1">Resposta</h4>
                <p className="text-sm text-gray-300 line-clamp-3">{item.response}</p>
              </div>

              {/* Tipo do formulário */}
              <div className="mt-4 flex items-center">
                <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400">
                  {item.formType}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 