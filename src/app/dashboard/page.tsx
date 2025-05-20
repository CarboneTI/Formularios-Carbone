'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/config'
import DeleteUserModal from '@/components/DeleteUserModal'

// Inicializar o cliente Supabase
const supabase = getSupabaseClient()

interface NewUserData {
  email: string;
  password: string;
  name: string;
  role: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function Dashboard() {
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState<NewUserData>({
    email: '',
    password: '',
    name: '',
    role: 'user' // Valor padrão: usuário comum
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Estado para gerenciar o modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificação normal de sessão
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log("Dashboard - Usuário não autenticado, redirecionando para login")
          window.location.href = '/'
          return
        }
        
        // Se estiver autenticado, busca os usuários
        fetchUsers()
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        window.location.href = '/'
      }
    }
    
    checkAuth()
  }, [])

  // Função para buscar usuários da API
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (response.ok && data.users) {
        setUsers(data.users)
      } else {
        console.error('Erro ao buscar usuários:', data.error)
        setErrorMessage('Não foi possível carregar a lista de usuários')
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      setErrorMessage('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewUser({ ...newUser, [name]: value })
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setCreating(true)

    try {
      // Chamar a API para criar o usuário
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário')
      }

      setSuccessMessage(`Usuário ${newUser.email} criado com sucesso! Um e-mail com as credenciais será enviado.`)
      setNewUser({ email: '', password: '', name: '', role: 'user' })
      
      // Atualizar a lista de usuários
      fetchUsers()
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err)
      setErrorMessage(err.message || 'Erro ao criar usuário')
    } finally {
      setCreating(false)
    }
  }
  
  // Função para abrir o modal de exclusão
  const openDeleteModal = (user: User) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }
  
  // Função para fechar o modal de exclusão
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }
  
  // Função para confirmar a exclusão do usuário
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true)
    
    try {
      // Em um aplicativo real, aqui teríamos uma chamada à API
      // Simulando delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remover o usuário da lista localmente
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      
      // Mostrar mensagem de sucesso
      setSuccessMessage(`Usuário ${userToDelete.email} excluído com sucesso.`);
      
      // Fechar o modal
      closeDeleteModal();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setErrorMessage('Não foi possível excluir o usuário. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  }

  // Formatar o nível de acesso para exibição
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
            Administrador
          </span>
        )
      case 'manager':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Gerente
          </span>
        )
      case 'user':
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Usuário
          </span>
        )
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Usuários</h1>
      
      {/* Área de cadastro de usuário */}
      <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Cadastrar Novo Usuário</h2>
        
        {successMessage && (
          <div className="mb-4 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}
              
              {errorMessage && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                  <p className="text-red-400">{errorMessage}</p>
                </div>
              )}
              
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Nome completo
                  </label>
                  <input
                    id="name"
                    name="name"
                type="text"
                required
                    value={newUser.name}
                    onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                    placeholder="Ex: João Silva"
                  />
                </div>
                
                <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                type="email"
                required
                    value={newUser.email}
                    onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                    placeholder="usuario@exemplo.com"
                  />
                </div>
                
                <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                type="password"
                required
                    value={newUser.password}
                    onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
              <p className="mt-1 text-xs text-gray-400">
                A senha será enviada ao usuário por e-mail.
                  </p>
                </div>
                
                <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                    Nível de Acesso
                  </label>
                  <select
                    id="role"
                    name="role"
                required
                    value={newUser.role}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 px-3 text-white focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                  >
                <option value="user">Usuário</option>
                <option value="manager">Gerente</option>
                    <option value="admin">Administrador</option>
                  </select>
              <p className="mt-1 text-xs text-gray-400">
                    Admin: Acesso total | Gerente: Acesso intermediário | Usuário: Acesso básico
                  </p>
            </div>
                </div>
                
          <div className="mt-4">
                <button
                  type="submit"
                  disabled={creating}
              className="px-4 py-2 bg-[#FFC600] text-black rounded-lg font-medium hover:bg-[#FFD700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1117] focus:ring-[#FFC600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
              {creating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cadastrando...
                </span>
              ) : 'Cadastrar Usuário'}
                </button>
          </div>
              </form>
            </div>
            
      {/* Lista de usuários */}
            <div className="bg-gray-900/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Usuários Cadastrados</h2>
              
              {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-[#FFC600]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhum usuário cadastrado ainda.</p>
                </div>
              ) : (
                    <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="pb-3">NOME</th>
                  <th className="pb-3">EMAIL</th>
                  <th className="pb-3">NÍVEL DE ACESSO</th>
                  <th className="pb-3">AÇÕES</th>
                          </tr>
                        </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800">
                    <td className="py-3">{user.name}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">{getRoleBadge(user.role)}</td>
                    <td className="py-3">
                      <button
                        className="text-indigo-400 hover:text-indigo-300 transition-colors mr-3"
                        onClick={() => alert('Funcionalidade de edição em desenvolvimento')}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300 transition-colors"
                        onClick={() => openDeleteModal(user)}
                      >
                        Excluir
                      </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
        )}
      </div>
      
      {/* Modal de exclusão */}
      {userToDelete && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteUser}
          userName={userToDelete.name}
          userEmail={userToDelete.email}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
} 