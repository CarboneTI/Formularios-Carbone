import nodemailer from 'nodemailer'

// Configurar o transporter do Nodemailer para enviar emails
// Para desenvolvimento/teste, podemos usar variáveis em código
// Para produção, NUNCA faça isso - use variáveis de ambiente!
const GMAIL_USER = process.env.GMAIL_USER || 'admin@carbonecompany.com'
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'senha_app'
// Flag para desabilitar o envio de emails (útil para desenvolvimento)
const DISABLE_EMAIL = process.env.DISABLE_EMAIL === 'true' || true

// Interfaces para o email
interface SendMailParams {
  to: string
  subject: string
  text?: string
  html?: string
}

interface SendMailResult {
  success: boolean
  error?: any
}

// Cria um transporter do Nodemailer somente se emails estiverem habilitados
const transporter = !DISABLE_EMAIL ? nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
}) : null

// Função para enviar email
export async function sendMail(params: SendMailParams): Promise<SendMailResult> {
  // Se o envio de emails estiver desabilitado, retorna sucesso mas loga a informação
  if (DISABLE_EMAIL) {
    console.log('SIMULAÇÃO: Email que seria enviado:', {
      to: params.to,
      subject: params.subject,
      text: params.text?.substring(0, 100) + '...',
      html: params.html?.substring(0, 100) + '...'
    })
    return { success: true }
  }

  try {
    // Verificar se o transporter foi inicializado
    if (!transporter) {
      throw new Error('Transporter de email não inicializado')
    }

    // Tenta enviar o email
    const info = await transporter.sendMail({
      from: `"Carbone Company" <${GMAIL_USER}>`,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html
    })

    console.log('Email enviado:', info.messageId)
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return {
      success: false,
      error
    }
  }
}

// Template para email de novo usuário
export function getNewUserEmailTemplate(name: string, email: string, password: string, role: string = 'user') {
  // Mapeamento de roles para descrições em português
  const roleDescriptions: Record<string, string> = {
    admin: 'Administrador (acesso total ao sistema)',
    manager: 'Gerente (acesso intermediário)',
    user: 'Usuário (acesso básico)'
  };

  // Obter a descrição do nível de acesso
  const roleDescription = roleDescriptions[role] || roleDescriptions.user;
  
  const subject = 'Suas credenciais para o sistema Carbone Company'
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #333;">Bem-vindo(a) à Carbone Company, ${name}!</h2>
      <p>Sua conta foi criada com sucesso. Abaixo estão suas credenciais de acesso:</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Senha:</strong> ${password}</p>
        <p><strong>Nível de Acesso:</strong> ${roleDescription}</p>
      </div>
      
      <p>Por questões de segurança, recomendamos que você altere sua senha após o primeiro acesso.</p>
      
      <p>Para acessar o sistema, clique no link abaixo:</p>
      <p><a href="http://localhost:3000" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Acessar o Sistema</a></p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #777;">
        Este é um email automático, não responda a este email.
      </p>
    </div>
  `
  
  const text = `
    Bem-vindo(a) à Carbone Company, ${name}!
    
    Sua conta foi criada com sucesso. Abaixo estão suas credenciais de acesso:
    
    Email: ${email}
    Senha: ${password}
    Nível de Acesso: ${roleDescription}
    
    Por questões de segurança, recomendamos que você altere sua senha após o primeiro acesso.
    
    Para acessar o sistema, visite: http://localhost:3000
    
    Este é um email automático, não responda a este email.
  `
  
  return { subject, html, text }
} 