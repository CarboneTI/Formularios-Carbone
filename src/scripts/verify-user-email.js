const { createClient } = require('@supabase/supabase-js')

// Dados de conexão do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Inicializar o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Dados do usuário de teste
const testUser = {
  email: 'admin@carbonecompany.com',
  password: process.env.ADMIN_PASSWORD || 'admincarbone123',
}

async function verifyUserEmail() {
  try {
    // 1. Fazer login com o usuário
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    })

    if (signInError) {
      console.error('Erro ao fazer login:', signInError.message)
      return
    }

    // 2. Obter o token de acesso
    const accessToken = signInData.session.access_token

    // 3. Usar a função de atualização do usuário para marcar o e-mail como verificado
    const { data, error } = await supabase.auth.updateUser({
      email: testUser.email,
      data: { email_verified: true }
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (error) {
      console.error('Erro ao verificar o e-mail do usuário:', error.message)
      return
    }

    console.log('E-mail do usuário verificado com sucesso!')
    console.log('Dados do usuário atualizados:', data)
  } catch (err) {
    console.error('Erro inesperado:', err)
  }
}

// Executar a função
verifyUserEmail() 