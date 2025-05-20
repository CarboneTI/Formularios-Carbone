/**
 * Implementação de cliente mock do Supabase para desenvolvimento local
 * Usado quando USE_LOCAL_AUTH está ativado
 */

// Definir valores de teste diretamente em vez de importá-los, para evitar referência circular
const adminCredentials = {
  email: 'admin@carbonecompany.com',
  password: 'admin123',
  name: 'Administrador',
  role: 'admin'
};

// Tipos simplificados para simular o Supabase
interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    role: string;
  };
  created_at: string;
}

interface MockSession {
  user: User;
}

// Cache de usuários simulados
const mockUsers: User[] = [
  {
    id: '1',
    email: adminCredentials.email,
    user_metadata: {
      name: adminCredentials.name,
      role: adminCredentials.role
    },
    created_at: new Date().toISOString()
  }
];

// Sessão atual simulada - inicializa checando localStorage no cliente
const getInitialSession = (): MockSession | null => {
  if (typeof window !== 'undefined') {
    const savedSession = localStorage.getItem('mock_auth_session');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        console.error('Erro ao parsear sessão salva:', e);
      }
    }
  }
  return null;
};

let currentSession: MockSession | null = getInitialSession();

// Funções auxiliares para salvar/remover sessão no localStorage e cookies
const saveSession = (session: MockSession | null) => {
  if (typeof window !== 'undefined') {
    if (session) {
      localStorage.setItem('mock_auth_session', JSON.stringify(session));
      // Definir um cookie para que o middleware possa detectar
      document.cookie = "local-auth-redirect=true; path=/; max-age=86400";
    } else {
      localStorage.removeItem('mock_auth_session');
      // Remover o cookie
      document.cookie = "local-auth-redirect=; path=/; max-age=0";
    }
  }
};

// Inicialmente, se temos uma sessão, salvamos
if (currentSession) {
  saveSession(currentSession);
}

// Criar um cliente mock do Supabase
export function createMockClient() {
  return {
    auth: {
      // Métodos de autenticação
      getSession: () => {
        console.log('Mock Auth - getSession chamado, retornando:', currentSession ? 'Sessão ativa' : 'Sem sessão');
        return Promise.resolve({ data: { session: currentSession }, error: null });
      },
      
      signInWithPassword: ({ email, password }: { email: string; password: string }) => {
        console.log('Mock Auth - tentativa de login com:', email);
        
        // Verifica credenciais com o adminCredentials
        if (email === adminCredentials.email && password === adminCredentials.password) {
          currentSession = { user: mockUsers[0] };
          saveSession(currentSession);
          
          console.log('Mock Auth - login bem-sucedido, sessão criada');
          return Promise.resolve({ data: { user: mockUsers[0], session: currentSession }, error: null });
        }
        
        console.log('Mock Auth - credenciais inválidas');
        // Simula erro de autenticação
        return Promise.resolve({ 
          data: { user: null, session: null }, 
          error: { message: 'Invalid login credentials' } 
        });
      },
      
      signOut: () => {
        console.log('Mock Auth - signOut chamado, removendo sessão');
        currentSession = null;
        saveSession(null);
        return Promise.resolve({ error: null });
      },
      
      // Para chamadas de admin
      admin: {
        listUsers: () => {
          console.log('Mock Auth - listUsers chamado, retornando', mockUsers.length, 'usuários');
          return Promise.resolve({ data: { users: mockUsers }, error: null });
        },
        
        createUser: ({ email, password, user_metadata }: any) => {
          // Verificar se o email já existe
          const existingUser = mockUsers.find(user => user.email === email);
          if (existingUser) {
            console.log('Mock Auth - createUser: usuário já existe:', email);
            return Promise.resolve({ 
              data: null, 
              error: { message: 'User already registered' } 
            });
          }
          
          // Criar novo usuário
          const newUser: User = {
            id: `mock-${Date.now()}`,
            email,
            user_metadata: user_metadata || {},
            created_at: new Date().toISOString()
          };
          
          mockUsers.push(newUser);
          console.log('Mock Auth - usuário criado com sucesso:', email);
          
          return Promise.resolve({ 
            data: { user: newUser }, 
            error: null 
          });
        }
      }
    },
    
    // Adicionar suporte para operações de banco de dados
    from: (table: string) => {
      console.log(`Mock DB - Acessando tabela: ${table}`);
      return {
        select: (columns?: string) => {
          console.log(`Mock DB - SELECT em ${table}${columns ? ` (${columns})` : ''}`);
          const query = {
            data: [],
            error: null,
            eq: (column: string, value: any) => {
              console.log(`Mock DB - WHERE ${column} = ${value}`);
              return {
                ...query,
                single: () => {
                  console.log(`Mock DB - LIMIT 1`);
                  return Promise.resolve({ data: null, error: null });
                }
              };
            },
            single: () => {
              console.log(`Mock DB - LIMIT 1`);
              return Promise.resolve({ data: null, error: null });
            },
            order: (column: string, options?: { ascending: boolean }) => {
              console.log(`Mock DB - ORDER BY ${column} ${options?.ascending ? 'ASC' : 'DESC'}`);
              return Promise.resolve({ data: [], error: null });
            }
          };
          return query;
        },
        
        insert: (data: any) => {
          console.log(`Mock DB - INSERT em ${table}:`, data);
          return Promise.resolve({ data, error: null });
        },
        
        update: (data: any) => {
          console.log(`Mock DB - UPDATE em ${table}:`, data);
          return Promise.resolve({ data, error: null });
        },
        
        delete: () => {
          console.log(`Mock DB - DELETE em ${table}`);
          return {
            eq: (column: string, value: any) => {
              console.log(`Mock DB - WHERE ${column} = ${value}`);
              return Promise.resolve({ data: null, error: null });
            }
          };
        },
        
        upsert: (data: any, options?: { onConflict?: string }) => {
          console.log(`Mock DB - UPSERT em ${table}:`, data, options);
          return Promise.resolve({ data, error: null });
        }
      };
    }
  };
} 