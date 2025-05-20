'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusCircle, X, ArrowLeft } from 'lucide-react'

// Tipos de formulário SAC
type TipoSolicitacao = 'extra' | 'planejamento' | 'filmmakers-decupagem' | 'filmmakers-gravacao'

export default function SACForm() {
  const [currentSection, setCurrentSection] = useState<number>(1)
  const [tipoSolicitacao, setTipoSolicitacao] = useState<TipoSolicitacao>('extra')
  const [showFilmmakersOptions, setShowFilmmakersOptions] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    cliente: '',
    prioridade: '',
    dataFinal: '',
    listaClickUp: '',
    nomeTask: '',
    descricao: ''
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [clienteOptions, setClienteOptions] = useState<Array<{id: string, name: string}>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  // Constantes
  const LIST_ID = "901306484176"
  
  // Carregar os clientes ao iniciar o componente
  useEffect(() => {
    carregarClientes()
  }, [])
  
  // Função para carregar clientes do ClickUp
  const carregarClientes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/clickup-proxy?endpoint=list/${LIST_ID}/task`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data && data.tasks) {
        setClienteOptions(data.tasks.map((task: any) => ({
          id: task.id,
          name: task.name
        })))
      }
    } catch (error) {
      console.error("Erro ao buscar tasks no ClickUp:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Manipulador de alterações nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Manipulador para selecionar o tipo de formulário
  const handleTipoFormularioChange = (tipo: TipoSolicitacao) => {
    if (tipo === 'extra' || tipo === 'planejamento') {
      setTipoSolicitacao(tipo)
      setShowFilmmakersOptions(false)
    } else {
      setShowFilmmakersOptions(true)
    }
  }
  
  // Manipulador para selecionar o subtipo de Filmmakers
  const handleFilmmakersTipoChange = (subtipo: 'decupagem' | 'gravacao') => {
    setTipoSolicitacao(`filmmakers-${subtipo}` as TipoSolicitacao)
    setShowFilmmakersOptions(false)
    setCurrentSection(2)
  }
  
  // Validar o formulário antes de passar para a próxima seção
  const validateForm = (): boolean => {
    const { cliente, prioridade, dataFinal, listaClickUp, nomeTask, descricao } = formData
    
    // Validar campos comuns para todos os tipos
    if (!cliente) {
      setSubmitError('Selecione um cliente')
      return false
    }
    
    // Validar campos específicos por tipo
    if (tipoSolicitacao === 'filmmakers-decupagem') {
      if (!descricao) {
        setSubmitError('O campo de títulos é obrigatório')
        return false
      }
    } else {
      // Para extra, planejamento e filmmakers-gravacao
      if (!prioridade) {
        setSubmitError('Selecione a prioridade')
        return false
      }
      
      if (!dataFinal) {
        setSubmitError('Informe a data final')
        return false
      }
      
      // Lista só é obrigatória para extra e planejamento
      if ((tipoSolicitacao === 'extra' || tipoSolicitacao === 'planejamento') && !listaClickUp) {
        setSubmitError('Selecione o setor responsável')
        return false
      }
      
      if (!nomeTask) {
        setSubmitError('Informe o nome da task')
        return false
      }
      
      if (!descricao) {
        setSubmitError('A descrição é obrigatória')
        return false
      }
    }
    
    // Se chegou até aqui, o formulário é válido
    setSubmitError(null)
    return true
  }
  
  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const selectedClient = clienteOptions.find(c => c.id === formData.cliente)
      const selectedTaskName = selectedClient ? selectedClient.name : ''
      
      let prioridade, dataFinalISO, listaId, listaNome, nomeTask
      
      if (tipoSolicitacao !== 'filmmakers-decupagem') {
        prioridade = parseInt(formData.prioridade, 10)
        const dataFinalValue = formData.dataFinal
        const dateObj = new Date(`${dataFinalValue}T00:00:00`)
        dataFinalISO = dateObj.toISOString()
        
        // Obter nome da lista selecionada
        const listaSelect = document.getElementById('listaClickUp') as HTMLSelectElement
        listaId = formData.listaClickUp
        listaNome = listaSelect && listaId ? listaSelect.options[listaSelect.selectedIndex].textContent : null
        nomeTask = formData.nomeTask
      }
      
      const bodyData = {
        tipoSolicitacao,
        nomeTask: nomeTask || null,
        tituloTask: selectedTaskName,
        taskId: formData.cliente,
        prioridade: prioridade || null,
        dataFinal: dataFinalISO || null,
        descricao: formData.descricao,
        listaId: listaId || null,
        listaNome: listaNome || null
      }
      
      // Enviar para o webhook via nossa API
      const response = await fetch('/api/sac-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      })
      
      if (response.ok) {
        setSubmitSuccess(true)
        // Resetar o formulário
        setFormData({
          cliente: '',
          prioridade: '',
          dataFinal: '',
          listaClickUp: '',
          nomeTask: '',
          descricao: ''
        })
      } else {
        const errorText = await response.text()
        setSubmitError(`Erro ao enviar: ${response.status} - ${errorText || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      setSubmitError('Erro ao enviar o formulário. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Renderizar o conteúdo baseado no tipo de solicitação
  const renderContent = () => {
    if (submitSuccess) {
      return (
        <div className="text-center p-10">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100/10 mb-8">
            <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4 text-[#FFC600]">Formulário Enviado com Sucesso!</h3>
          <p className="text-gray-300 mb-8">
            Sua solicitação foi enviada e será processada em breve.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => {
                setSubmitSuccess(false)
                setCurrentSection(1)
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
            >
              Enviar Outro Formulário
            </button>
            
            <Link href="/dashboard" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      )
    }
    
    // Renderizar seleção de tipo de formulário
    if (showFilmmakersOptions) {
      return (
        <div className="my-8">
          <button
            onClick={() => setShowFilmmakersOptions(false)}
            className="mb-6 text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </button>
          
          <h2 className="text-2xl font-bold text-[#FFC600] mb-6 text-center">Selecione o tipo de Filmmakers</h2>
          
          <div className="grid gap-4">
            <button
              onClick={() => handleFilmmakersTipoChange('decupagem')}
              className="w-full py-4 px-6 border border-gray-700 hover:border-[#FFC600] rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-left transition-all"
            >
              <div className="font-semibold text-lg mb-1">Decupagem</div>
              <div className="text-sm text-gray-400">Formulário para títulos de tarefas separados por vírgula.</div>
            </button>
            
            <button
              onClick={() => handleFilmmakersTipoChange('gravacao')}
              className="w-full py-4 px-6 border border-gray-700 hover:border-[#FFC600] rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-left transition-all"
            >
              <div className="font-semibold text-lg mb-1">Gravação</div>
              <div className="text-sm text-gray-400">Formulário para solicitações de gravação.</div>
            </button>
          </div>
        </div>
      )
    }
    
    if (currentSection === 1) {
      return (
        <div className="my-8">
          <h2 className="text-2xl font-bold text-[#FFC600] mb-6 text-center">Qual é o tipo de solicitação?</h2>
          
          <div className="grid gap-4">
            <button
              onClick={() => {
                handleTipoFormularioChange('extra')
                setCurrentSection(2)
              }}
              className={`w-full py-4 px-6 border border-gray-700 hover:border-[#FFC600] rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-left transition-all ${tipoSolicitacao === 'extra' ? 'border-[#FFC600] ring-2 ring-[#FFC600]/50' : ''}`}
            >
              <div className="font-semibold text-lg mb-1">Solicitação Extra</div>
              <div className="text-sm text-gray-400">Formulário para demandas extras dos clientes.</div>
            </button>
            
            <button
              onClick={() => {
                handleTipoFormularioChange('planejamento')
                setCurrentSection(2)
              }}
              className={`w-full py-4 px-6 border border-gray-700 hover:border-[#FFC600] rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-left transition-all ${tipoSolicitacao === 'planejamento' ? 'border-[#FFC600] ring-2 ring-[#FFC600]/50' : ''}`}
            >
              <div className="font-semibold text-lg mb-1">Planejamento</div>
              <div className="text-sm text-gray-400">Formulário para planejamento estratégico.</div>
            </button>
            
            <button
              onClick={() => handleTipoFormularioChange('filmmakers-decupagem')}
              className={`w-full py-4 px-6 border border-gray-700 hover:border-[#FFC600] rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-left transition-all ${tipoSolicitacao.startsWith('filmmakers') ? 'border-[#FFC600] ring-2 ring-[#FFC600]/50' : ''}`}
            >
              <div className="font-semibold text-lg mb-1">Filmmakers</div>
              <div className="text-sm text-gray-400">Solicitações relacionadas a filmmakers (decupagem ou gravação).</div>
            </button>
          </div>
        </div>
      )
    }
    
    // Renderizar formulário
    return (
      <form onSubmit={handleSubmit} className="my-8">
        {submitError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {submitError}
          </div>
        )}
        
        <div className="space-y-6">
          {/* CLIENTE */}
          <div>
            <label htmlFor="cliente" className="block text-sm font-medium text-[#FFC600] mb-1">
              Selecione o cliente*
            </label>
            <select
              id="cliente"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white focus:ring-2 focus:ring-[#FFC600] focus:border-transparent"
              required
            >
              <option value="">-- Selecione --</option>
              {isLoading ? (
                <option value="" disabled>Carregando...</option>
              ) : (
                clienteOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))
              )}
            </select>
          </div>
          
          {tipoSolicitacao !== 'filmmakers-decupagem' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PRIORIDADE */}
                <div>
                  <label htmlFor="prioridade" className="block text-sm font-medium text-[#FFC600] mb-1">
                    Prioridade*
                  </label>
                  <select
                    id="prioridade"
                    name="prioridade"
                    value={formData.prioridade}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white focus:ring-2 focus:ring-[#FFC600] focus:border-transparent"
                    required
                  >
                    <option value="">-- Selecione --</option>
                    <option value="1">Urgente</option>
                    <option value="2">Alta</option>
                    <option value="3">Normal</option>
                    <option value="4">Baixa</option>
                  </select>
                </div>
                
                {/* DATA FINAL */}
                <div>
                  <label htmlFor="dataFinal" className="block text-sm font-medium text-[#FFC600] mb-1">
                    Data Final*
                  </label>
                  <input
                    type="date"
                    id="dataFinal"
                    name="dataFinal"
                    value={formData.dataFinal}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white focus:ring-2 focus:ring-[#FFC600] focus:border-transparent"
                    required
                    style={{cursor: 'pointer'}}
                  />
                </div>
              </div>
              
              {(tipoSolicitacao === 'extra' || tipoSolicitacao === 'planejamento') && (
                <div>
                  <label htmlFor="listaClickUp" className="block text-sm font-medium text-[#FFC600] mb-1">
                    Selecione o setor Responsável*
                  </label>
                  <select
                    id="listaClickUp"
                    name="listaClickUp"
                    value={formData.listaClickUp}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white focus:ring-2 focus:ring-[#FFC600] focus:border-transparent"
                    required
                  >
                    <option value="">-- Selecione a Lista --</option>
                    <option value="901307269821">audiovisual</option>
                    <option value="901306484052">design</option>
                    <option value="901307269583">tráfego</option>
                    <option value="901307269834">CS</option>
                    <option value="901307269808">Gerência</option>
                    <option value="901307269881">SAC</option>
                    <option value="901307455235">Social media</option>
                  </select>
                </div>
              )}
              
              <div>
                <label htmlFor="nomeTask" className="block text-sm font-medium text-[#FFC600] mb-1">
                  Nome da Task*
                </label>
                <input
                  type="text"
                  id="nomeTask"
                  name="nomeTask"
                  value={formData.nomeTask}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white focus:ring-2 focus:ring-[#FFC600] focus:border-transparent"
                  placeholder="Digite o nome da task"
                  required
                />
              </div>
            </>
          )}
          
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-[#FFC600] mb-1">
              {tipoSolicitacao === 'filmmakers-decupagem' ? 'Campo de Títulos*' : 'Descrição*'}
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white focus:ring-2 focus:ring-[#FFC600] focus:border-transparent min-h-[140px]"
              placeholder={tipoSolicitacao === 'filmmakers-decupagem' ? 'Inserir títulos separados por vírgula' : 'Descreva a demanda...'}
              required
              rows={5}
            />
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentSection(1)}
              className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Voltar para Tipos</span>
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#FFC600] hover:bg-[#FFD700] text-black font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-black/30 border-t-black rounded-full"></span>
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Enviar Formulário</span>
              )}
            </button>
          </div>
        </div>
      </form>
    )
  }
  
  // Layout principal
  return (
    <div className="w-full max-w-4xl mx-auto">
      <header>
        <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Voltar ao Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">
          Formulário <span className="text-[#FFC600]">SAC</span>
        </h1>
        
        <p className="text-gray-400 mb-6">
          {tipoSolicitacao === 'extra' && "Este formulário tem o objetivo anexar demandas extras dos clientes."}
          {tipoSolicitacao === 'planejamento' && "Este formulário é para planejamento estratégico."}
          {tipoSolicitacao === 'filmmakers-decupagem' && "Digite os títulos das tarefas separados por vírgula."}
          {tipoSolicitacao === 'filmmakers-gravacao' && "Este formulário é para Filmmakers: Gravação."}
          {currentSection === 1 && "Selecione o tipo de formulário que deseja preencher."}
        </p>
        
        {/* Barra de progresso - mostrar apenas se não estiver na seleção inicial ou concluído */}
        {currentSection > 1 && !submitSuccess && !showFilmmakersOptions && (
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#FFC600] h-full transition-all duration-300 rounded-full"
              style={{ width: `100%` }}
            ></div>
          </div>
        )}
      </header>
      
      <main className="bg-gray-900/50 rounded-lg border border-gray-800 p-6 md:p-8">
        {renderContent()}
      </main>
    </div>
  )
} 