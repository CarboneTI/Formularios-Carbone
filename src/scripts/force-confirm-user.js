// AVISO: Este script usa a service_role key que tem permissões administrativas
// Nunca compartilhe ou exponha esta chave em ambientes de produção ou código público
// Use apenas para confirmação de e-mail em ambiente de desenvolvimento local

const { createClient } = require('@supabase/supabase-js')

// Dados de conexão do Supabase - substitua SERVICE_ROLE_KEY pelo seu valor
// Para obter esta chave, vá para Settings > API no painel do Supabase
// AVISO: Esta chave tem acesso total ao seu banco de dados, incluindo tabelas do sistema
const supabaseUrl = 'https://dzhscmihztgwtmiqidjy.supabase.co'

// Você precisará obter esta chave do painel do Supabase (Settings > API > service_role key)
// IMPORTANTE: Remova esta chave depois de usar
// Você pode comentar a linha abaixo e executar o script com:
// SERVICE_ROLE_KEY=sua_chave_aqui node src/scripts/force-confirm-user.js
const serviceRoleKey = process.env.SERVICE_ROLE_KEY || 'SUA_SERVICE_ROLE_KEY_AQUI'

// Inicializar o cliente do Supabase com permissões de serviço
const supabase = createClient(supabaseUrl, serviceRoleKey)

// Dados do usuário que queremos confirmar
const userId = 'da4634fb-52f3-47a0-a539-ab2854ab8b40'  // Substitua pelo ID do seu usuário
const userEmail = 'admin@carbonecompany.com'

// Função alternativa - usando API direta
async function forceConfirmUserEmail() {
  try {
    console.log('Tentando confirmar e-mail via admin API...')
    
    // Usar endpoint de admin para atualizar o usuário
    // Só funciona com service_role key
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { email_confirmed_at: new Date().toISOString() }
    )
    
    if (error) {
      console.error('Erro ao confirmar e-mail:', error.message)
      return
    }
    
    console.log('E-mail confirmado com sucesso!')
    console.log('Dados do usuário:', data)
    
    // Verificar se funcionou
    console.log('Tentando fazer login para verificar...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: 'admincarbone123',
    })
    
    if (signInError) {
      console.error('Erro ao fazer login após confirmação:', signInError.message)
      return
    }
    
    console.log('Login bem-sucedido! Confirmação funcionou.')
    console.log('Sessão:', signInData.session ? 'Criada' : 'Não criada')
    
  } catch (err) {
    console.error('Erro inesperado:', err)
  }
}

// Executar a função
forceConfirmUserEmail() 