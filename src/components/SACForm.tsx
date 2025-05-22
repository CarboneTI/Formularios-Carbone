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
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [isPrioridadeDropdownOpen, setIsPrioridadeDropdownOpen] = useState<boolean>(false)
  const [isSetorDropdownOpen, setIsSetorDropdownOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedClient, setSelectedClient] = useState<{id: string, name: string} | null>(null)
  const [selectedPrioridade, setSelectedPrioridade] = useState<{value: string, label: string} | null>(null)
  const [selectedSetor, setSelectedSetor] = useState<{value: string, label: string} | null>(null)
  const [filteredClients, setFilteredClients] = useState<Array<{id: string, name: string}>>([])
  
  // Constantes
  const LIST_ID = "901306484176"
  
  // Opções de prioridade
  const prioridadeOptions = [
    { value: "1", label: "Urgente" },
    { value: "2", label: "Alta" },
    { value: "3", label: "Normal" },
    { value: "4", label: "Baixa" }
  ]

  // Opções de setor
  const setorOptions = [
    { value: "901307269821", label: "audiovisual" },
    { value: "901306484052", label: "design" },
    { value: "901307269583", label: "tráfego" },
    { value: "901307269834", label: "CS" },
    { value: "901307269808", label: "Gerência" },
    { value: "901307269881", label: "SAC" },
    { value: "901307455235", label: "Social media" }
  ]
  
  // Carregar os clientes ao iniciar o componente
  useEffect(() => {
    carregarClientes()
  }, [])
  
  // Atualizar clientes filtrados quando a busca ou os clientes mudarem
  useEffect(() => {
    const filtered = clienteOptions.filter(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchQuery, clienteOptions]);
  
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
        const options = data.tasks.map((task: any) => ({
          id: task.id,
          name: task.name
        }));
        setClienteOptions(options);
        setFilteredClients(options);
      }
    } catch (error) {
      console.error("Erro ao buscar tasks no ClickUp:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Função para selecionar um cliente
  const handleClientSelect = (client: { id: string; name: string }) => {
    setSelectedClient(client);
    setFormData(prev => ({
      ...prev,
      cliente: client.id
    }));
    setIsDropdownOpen(false);
  };
  
  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container-cliente')) {
        setIsDropdownOpen(false);
      }
      if (!target.closest('.dropdown-container-prioridade')) {
        setIsPrioridadeDropdownOpen(false);
      }
      if (!target.closest('.dropdown-container-setor')) {
        setIsSetorDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Função para selecionar prioridade
  const handlePrioridadeSelect = (option: { value: string; label: string }) => {
    setSelectedPrioridade(option);
    setFormData(prev => ({
      ...prev,
      prioridade: option.value
    }));
    setIsPrioridadeDropdownOpen(false);
  };

  // Função para selecionar setor
  const handleSetorSelect = (option: { value: string; label: string }) => {
    setSelectedSetor(option);
    setFormData(prev => ({
      ...prev,
      listaClickUp: option.value
    }));
    setIsSetorDropdownOpen(false);
  };
  
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
              type="button"
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
            type="button"
            onClick={() => setShowFilmmakersOptions(false)}
            className="mb-6 text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </button>
          
          <h2 className="text-2xl font-bold text-[#FFC600] mb-6 text-center">Selecione o tipo de Filmmakers</h2>
          
          <div className="grid gap-4">
            <button
              type="button"
              onClick={() => handleFilmmakersTipoChange('decupagem')}
              className="w-full py-4 px-6 border border-gray-700 hover:border-[#FFC600] rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-left transition-all"
            >
              <div className="font-semibold text-lg mb-1">Decupagem</div>
              <div className="text-sm text-gray-400">Formulário para títulos de tarefas separados por vírgula.</div>
            </button>
            
            <button
              type="button"
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
              type="button"
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
              type="button"
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
              type="button"
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
      <>
        {/* Cliente Dropdown */}
        <div>
          <label htmlFor="cliente" className="form-label">
            Selecione o cliente*
          </label>
          <div className="dropdown-container">
            <div 
              className="dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedClient ? selectedClient.name : 'Selecione...'}
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className={`h-5 w-5 text-gray-400 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="p-3 border-b border-gray-800">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Pesquisar cliente..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="form-input pl-10"
                    />
                    <svg 
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="overflow-auto">
                  {filteredClients.length === 0 ? (
                    <div className="px-6 py-8 text-gray-400 text-center">
                      <svg 
                        className="mx-auto h-12 w-12 text-gray-500 mb-4"
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-400">Nenhum cliente encontrado</p>
                    </div>
                  ) : (
                    filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="dropdown-item"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium">{client.name}</div>
                        </div>
                        {selectedClient?.id === client.id && (
                          <svg className="h-5 w-5 text-[#FFC600] ml-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <input
            type="hidden"
            name="cliente"
            value={selectedClient?.id || ''}
          />
        </div>

        {tipoSolicitacao !== 'filmmakers-decupagem' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prioridade Dropdown */}
              <div>
                <label htmlFor="prioridade" className="form-label">
                  Prioridade*
                </label>
                <div className="dropdown-container">
                  <div 
                    className="dropdown-trigger"
                    onClick={() => setIsPrioridadeDropdownOpen(!isPrioridadeDropdownOpen)}
                  >
                    {selectedPrioridade ? selectedPrioridade.label : 'Selecione...'}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className={`h-5 w-5 text-gray-400 transform transition-transform ${isPrioridadeDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {isPrioridadeDropdownOpen && (
                    <div className="dropdown-menu">
                      <div className="overflow-auto">
                        {prioridadeOptions.map((option) => (
                          <div
                            key={option.value}
                            className="dropdown-item"
                            onClick={() => handlePrioridadeSelect(option)}
                          >
                            <div className="flex-1">
                              <div className="text-white font-medium">{option.label}</div>
                            </div>
                            {selectedPrioridade?.value === option.value && (
                              <svg className="h-5 w-5 text-[#FFC600] ml-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="hidden"
                  name="prioridade"
                  value={selectedPrioridade?.value || ''}
                />
              </div>
              
              {/* Data Final */}
              <div>
                <label htmlFor="dataFinal" className="form-label">
                  Data Final*
                </label>
                <input
                  type="date"
                  id="dataFinal"
                  name="dataFinal"
                  value={formData.dataFinal}
                  onChange={handleChange}
                  className="form-input cursor-pointer"
                  required
                  readOnly={false}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                />
              </div>
            </div>
            
            {/* Setor Responsável Dropdown */}
            {(tipoSolicitacao === 'extra' || tipoSolicitacao === 'planejamento') && (
              <div>
                <label htmlFor="listaClickUp" className="form-label">
                  Selecione o setor Responsável*
                </label>
                <div className="dropdown-container">
                  <div 
                    className="dropdown-trigger"
                    onClick={() => setIsSetorDropdownOpen(!isSetorDropdownOpen)}
                  >
                    {selectedSetor ? selectedSetor.label : 'Selecione...'}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className={`h-5 w-5 text-gray-400 transform transition-transform ${isSetorDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {isSetorDropdownOpen && (
                    <div className="dropdown-menu">
                      <div className="overflow-auto">
                        {setorOptions.map((option) => (
                          <div
                            key={option.value}
                            className="dropdown-item"
                            onClick={() => handleSetorSelect(option)}
                          >
                            <div className="flex-1">
                              <div className="text-white font-medium">{option.label}</div>
                            </div>
                            {selectedSetor?.value === option.value && (
                              <svg className="h-5 w-5 text-[#FFC600] ml-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="hidden"
                  name="listaClickUp"
                  value={selectedSetor?.value || ''}
                />
              </div>
            )}
            
            {/* Nome da Task */}
            <div>
              <label htmlFor="nomeTask" className="form-label">
                Nome da Task*
              </label>
              <input
                type="text"
                id="nomeTask"
                name="nomeTask"
                value={formData.nomeTask}
                onChange={handleChange}
                className="form-input"
                placeholder="Digite o nome da task"
                required
              />
            </div>
          </>
        )}
        
        {/* Descrição/Títulos */}
        <div>
          <label htmlFor="descricao" className="form-label">
            {tipoSolicitacao === 'filmmakers-decupagem' ? 'Campo de Títulos*' : 'Descrição*'}
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="form-textarea"
            placeholder={tipoSolicitacao === 'filmmakers-decupagem' ? 'Inserir títulos separados por vírgula' : 'Descreva a demanda...'}
            required
            rows={5}
          />
        </div>
        
        {/* Botões de Ação */}
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
            className="btn btn-primary flex items-center gap-2"
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
      </>
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
        
        {currentSection > 1 && !submitSuccess && !showFilmmakersOptions && (
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#FFC600] h-full transition-all duration-300 rounded-full"
              style={{ width: `100%` }}
            ></div>
          </div>
        )}
      </header>
      
      <main className="form-container">
        {submitError && (
          <div className="alert alert-error">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderContent()}
        </form>
      </main>
    </div>
  )
} 