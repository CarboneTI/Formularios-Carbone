'use client'

import { useState, useEffect } from 'react'
import { webhooks, WebhookConfig, FormType } from '@/config/webhooks'

export default function WebhooksManager() {
  const [formType, setFormType] = useState<FormType>('automoveis')
  const [webhookConfigs, setWebhookConfigs] = useState<WebhookConfig[]>([])
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  
  // New webhook state
  const [newWebhook, setNewWebhook] = useState<WebhookConfig>({
    url: '',
    headers: { 'Authorization': 'Bearer ' },
    enabled: false,
    description: ''
  })
  
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')
  
  // Load webhooks for selected form type
  useEffect(() => {
    // In a real implementation, this would fetch from an API or database
    // For this demo, we're just using the imported configuration
    setWebhookConfigs([...webhooks[formType]])
  }, [formType])
  
  const handleAddWebhook = () => {
    if (!newWebhook.url || !newWebhook.description) {
      setError('URL e descrição são obrigatórios')
      return
    }
    
    // Validate URL
    try {
      new URL(newWebhook.url)
    } catch (e) {
      setError('URL inválida')
      return
    }
    
    setError('')
    
    // In a real implementation, this would call an API to save the new webhook
    const updatedWebhooks = [...webhookConfigs, { ...newWebhook }]
    setWebhookConfigs(updatedWebhooks)
    
    // Reset form
    setNewWebhook({
      url: '',
      headers: { 'Authorization': 'Bearer ' },
      enabled: false,
      description: ''
    })
    setShowAddForm(false)
    
    // Show success message
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }
  
  const handleEditWebhook = (index: number) => {
    const webhook = webhookConfigs[index]
    setEditIndex(index)
    setNewWebhook({ ...webhook })
  }
  
  const handleUpdateWebhook = () => {
    if (editIndex === null) return
    
    if (!newWebhook.url || !newWebhook.description) {
      setError('URL e descrição são obrigatórios')
      return
    }
    
    // Validate URL
    try {
      new URL(newWebhook.url)
    } catch (e) {
      setError('URL inválida')
      return
    }
    
    setError('')
    
    // In a real implementation, this would call an API to update the webhook
    const updatedWebhooks = [...webhookConfigs]
    updatedWebhooks[editIndex] = { ...newWebhook }
    setWebhookConfigs(updatedWebhooks)
    
    // Reset form
    setNewWebhook({
      url: '',
      headers: { 'Authorization': 'Bearer ' },
      enabled: false,
      description: ''
    })
    setEditIndex(null)
    
    // Show success message
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }
  
  const handleDeleteWebhook = (index: number) => {
    if (!confirm('Tem certeza que deseja excluir este webhook?')) return
    
    // In a real implementation, this would call an API to delete the webhook
    const updatedWebhooks = [...webhookConfigs]
    updatedWebhooks.splice(index, 1)
    setWebhookConfigs(updatedWebhooks)
    
    // Show success message
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }
  
  const handleToggleWebhook = (index: number) => {
    // In a real implementation, this would call an API to toggle the webhook
    const updatedWebhooks = [...webhookConfigs]
    updatedWebhooks[index].enabled = !updatedWebhooks[index].enabled
    setWebhookConfigs(updatedWebhooks)
    
    // Show success message
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }
  
  const cancelEdit = () => {
    setEditIndex(null)
    setNewWebhook({
      url: '',
      headers: { 'Authorization': 'Bearer ' },
      enabled: false,
      description: ''
    })
    setError('')
  }

  return (
    <div className="bg-gray-900/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Webhooks</h2>
      
      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
          <p className="text-green-400 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Configurações de webhook salvas com sucesso!
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="formType" className="block text-sm font-medium text-gray-300 mb-2">
          Tipo de Formulário
        </label>
        <select
          id="formType"
          value={formType}
          onChange={(e) => setFormType(e.target.value as FormType)}
          className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2.5 px-3 text-white focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
        >
          <option value="automoveis">Automóveis</option>
          <option value="energia-solar">Energia Solar</option>
          <option value="outros">Outros</option>
        </select>
      </div>
      
      {/* Lista de webhooks existentes */}
      <div className="mt-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-400">Webhooks Configurados</h3>
        
        {webhookConfigs.length === 0 ? (
          <p className="text-gray-500 text-sm italic">Nenhum webhook configurado para este tipo de formulário.</p>
        ) : (
          webhookConfigs.map((webhook, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-white">{webhook.description}</h4>
                  <p className="text-gray-400 text-sm truncate">{webhook.url}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleWebhook(index)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      webhook.enabled
                        ? 'bg-green-900/20 text-green-400 border border-green-600/30'
                        : 'bg-red-900/20 text-red-400 border border-red-600/30'
                    }`}
                  >
                    {webhook.enabled ? 'Ativado' : 'Desativado'}
                  </button>
                  <button
                    onClick={() => handleEditWebhook(index)}
                    className="px-3 py-1 bg-blue-900/20 text-blue-400 border border-blue-600/30 rounded text-xs font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteWebhook(index)}
                    className="px-3 py-1 bg-red-900/20 text-red-400 border border-red-600/30 rounded text-xs font-medium"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Botão para adicionar novo webhook */}
      {!showAddForm && editIndex === null && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm flex items-center hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Webhook
        </button>
      )}
      
      {/* Formulário para adicionar/editar webhook */}
      {(showAddForm || editIndex !== null) && (
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">
            {editIndex !== null ? 'Editar Webhook' : 'Adicionar Novo Webhook'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-300 mb-2">
                URL do Webhook*
              </label>
              <input
                id="webhookUrl"
                type="text"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                className="block w-full rounded-lg border border-gray-700 bg-gray-900 py-2 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                placeholder="https://exemplo.com/webhook"
              />
            </div>
            
            <div>
              <label htmlFor="webhookDesc" className="block text-sm font-medium text-gray-300 mb-2">
                Descrição*
              </label>
              <input
                id="webhookDesc"
                type="text"
                value={newWebhook.description}
                onChange={(e) => setNewWebhook({ ...newWebhook, description: e.target.value })}
                className="block w-full rounded-lg border border-gray-700 bg-gray-900 py-2 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                placeholder="Ex: Webhook para integração com CRM"
              />
            </div>
            
            <div>
              <label htmlFor="webhookHeaders" className="block text-sm font-medium text-gray-300 mb-2">
                Cabeçalho de Autorização
              </label>
              <input
                id="webhookHeaders"
                type="text"
                value={newWebhook.headers?.['Authorization'] || ''}
                onChange={(e) => 
                  setNewWebhook({ 
                    ...newWebhook, 
                    headers: { 
                      ...newWebhook.headers,
                      'Authorization': e.target.value 
                    } 
                  })
                }
                className="block w-full rounded-lg border border-gray-700 bg-gray-900 py-2 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                placeholder="Bearer seu-token-aqui"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="webhookEnabled"
                type="checkbox"
                checked={newWebhook.enabled}
                onChange={(e) => setNewWebhook({ ...newWebhook, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-[#FFC600] focus:ring-[#FFC600] focus:ring-offset-gray-900"
              />
              <label htmlFor="webhookEnabled" className="ml-2 block text-sm text-gray-300">
                Webhook ativado
              </label>
            </div>
            
            <div className="flex space-x-3 pt-2">
              {editIndex !== null ? (
                <>
                  <button
                    onClick={handleUpdateWebhook}
                    className="px-4 py-2 bg-[#FFC600] text-black rounded font-medium text-sm hover:bg-[#FFD700] transition-colors"
                  >
                    Atualizar
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-700 text-white rounded font-medium text-sm hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddWebhook}
                    className="px-4 py-2 bg-[#FFC600] text-black rounded font-medium text-sm hover:bg-[#FFD700] transition-colors"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setError('')
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded font-medium text-sm hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <p className="text-gray-400 text-sm">
          <strong>Nota:</strong> Os webhooks serão acionados quando um formulário for enviado. O payload conterá os dados do formulário e o prompt gerado.
        </p>
      </div>
    </div>
  )
} 