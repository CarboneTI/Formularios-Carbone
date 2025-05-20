// Este script confirma diretamente o e-mail do usuário no Supabase
// Para uso APENAS em ambiente de desenvolvimento

const { createClient } = require('@supabase/supabase-js')

// Dados de conexão do Supabase
const supabaseUrl = 'https://dzhscmihztgwtmiqidjy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHNjbWloenRnd3RtaXFpZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDUxMzgsImV4cCI6MjA2MTUyMTEzOH0.ectLn2ZUb0wA2RrbXDN-fj9_mWkWMddRqWRHo27uMI0'

// Inicializar o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// E-mail do usuário que queremos confirmar
const userEmail = 'admin@carbonecompany.com'

async function confirmUserEmail() {
  console.log(`Tentando confirmar e-mail para: ${userEmail}`)
  
  try {
    // Método 1: Usando a função de autoadmin - apenas para desenvolvimento!
    // Isso funciona quando você tem as permissões de serviço
    const { data, error } = await supabase.rpc('confirm_user', {
      email: userEmail
    })
    
    if (error) {
      console.error('Erro ao confirmar e-mail (Método 1):', error.message)
      console.log('Tentando método alternativo...')
      
      // Método 2: Autenticação e depois atualização
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: 'admincarbone123'
      })
      
      if (signInError) {
        console.error('Erro ao fazer login para confirmar e-mail:', signInError.message)
        return
      }
      
      // Se houver uma sessão, tenta atualizar o usuário
      if (signInData.session) {
        // Configura o cliente Supabase com o token de acesso
        const authedSupabase = createClient(
          supabaseUrl,
          supabaseAnonKey,
          {
            global: {
              headers: {
                Authorization: `Bearer ${signInData.session.access_token}`
              }
            }
          }
        )
        
        // Atualiza o usuário para marcar e-mail como verificado
        const { data: updateData, error: updateError } = await authedSupabase.auth.updateUser({
          data: { email_verified: true }
        })
        
        if (updateError) {
          console.error('Erro ao atualizar usuário:', updateError.message)
          return
        }
        
        console.log('E-mail confirmado com sucesso (Método 2)!')
        console.log('Dados do usuário:', updateData)
        return
      }
    } else {
      console.log('E-mail confirmado com sucesso (Método 1)!')
      console.log('Resposta:', data)
    }
  } catch (err) {
    console.error('Erro inesperado:', err)
  }
}

// Executar a função
confirmUserEmail() 