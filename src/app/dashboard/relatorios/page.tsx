'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/config'

// Cliente Supabase
const supabase = getSupabaseClient()

// Interface para dados de relatórios
interface ReportData {
  periodo: string;
  totalForms: number;
  promptsGerados: number;
  usuariosAtivos: number;
  taxaConversao: string;
}

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState('30d') // Padrão: últimos 30 dias
  const [dadosResumo, setDadosResumo] = useState<ReportData | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Verificar autenticação e carregar dados iniciais
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificação normal de sessão
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log("Relatórios - Usuário não autenticado, redirecionando para login")
          window.location.href = '/'
          return
        }
        
        // Se estiver autenticado, carrega os dados
        carregarDados(periodo)
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        window.location.href = '/'
      }
    }
    
    checkAuth()
  }, [periodo])

  // Carregar dados conforme o período selecionado
  const carregarDados = async (novoPeriodo: string) => {
    setLoading(true)
    setErrorMessage('')
    
    try {
      // Aqui seria uma chamada à API real
      // Por enquanto, usando dados simulados
      
      // Simular atraso de rede
      setTimeout(() => {
        const dadosSimulados: ReportData = {
          periodo: novoPeriodo,
          totalForms: novoPeriodo === '7d' ? 27 : novoPeriodo === '30d' ? 124 : 372,
          promptsGerados: novoPeriodo === '7d' ? 18 : novoPeriodo === '30d' ? 86 : 255,
          usuariosAtivos: novoPeriodo === '7d' ? 5 : novoPeriodo === '30d' ? 12 : 24,
          taxaConversao: novoPeriodo === '7d' ? '66.7%' : novoPeriodo === '30d' ? '69.3%' : '68.5%'
        }
        
        setDadosResumo(dadosSimulados)
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
      setErrorMessage('Erro ao carregar dados. Tente novamente.')
      setLoading(false)
    }
  }

  // Alterar período e atualizar dados
  const handlePeriodoChange = (novoPeriodo: string) => {
    setPeriodo(novoPeriodo)
    carregarDados(novoPeriodo)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Relatórios</h1>
      
      {/* Filtros */}
      <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Filtrar por período</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            className={`px-4 py-2 rounded-lg ${periodo === '7d' ? 'bg-[#FFC600] text-black' : 'bg-gray-800 hover:bg-gray-700'}`}
            onClick={() => handlePeriodoChange('7d')}
          >
            Últimos 7 dias
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${periodo === '30d' ? 'bg-[#FFC600] text-black' : 'bg-gray-800 hover:bg-gray-700'}`}
            onClick={() => handlePeriodoChange('30d')}
          >
            Últimos 30 dias
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${periodo === '90d' ? 'bg-[#FFC600] text-black' : 'bg-gray-800 hover:bg-gray-700'}`}
            onClick={() => handlePeriodoChange('90d')}
          >
            Últimos 90 dias
          </button>
        </div>
      </div>

      {/* Indicadores principais */}
      {loading ? (
        <div className="bg-gray-900/50 rounded-xl p-6 mb-8 min-h-[200px] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 border-4 border-t-[#FFC600] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Carregando dados...</p>
          </div>
        </div>
      ) : errorMessage ? (
        <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-6 mb-8">
          <p className="text-red-400">{errorMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total de Formulários</p>
            <h3 className="text-3xl font-bold">{dadosResumo?.totalForms}</h3>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Prompts Gerados</p>
            <h3 className="text-3xl font-bold">{dadosResumo?.promptsGerados}</h3>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Usuários Ativos</p>
            <h3 className="text-3xl font-bold">{dadosResumo?.usuariosAtivos}</h3>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Taxa de Conversão</p>
            <h3 className="text-3xl font-bold">{dadosResumo?.taxaConversao}</h3>
          </div>
        </div>
      )}

      {/* Gráficos e dados detalhados */}
      <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Atividade por dia</h2>
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
          <p className="text-gray-400 mb-4">Gráficos em desenvolvimento</p>
          <p className="text-sm text-gray-500">
            Esta funcionalidade será implementada em breve, permitindo visualizar a atividade diária de geração de prompts.
          </p>
        </div>
      </div>

      {/* Formulários mais utilizados */}
      <div className="bg-gray-900/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Formulários mais utilizados</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-3">Formulário</th>
              <th className="pb-3">Utilizações</th>
              <th className="pb-3">Última utilização</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-800">
              <td className="py-3">Prompt de Automóveis</td>
              <td className="py-3">{dadosResumo?.promptsGerados || 0}</td>
              <td className="py-3">Hoje</td>
            </tr>
            <tr className="border-t border-gray-800">
              <td className="py-3 text-gray-400">Outros formulários</td>
              <td className="py-3 text-gray-400">0</td>
              <td className="py-3 text-gray-400">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
} 