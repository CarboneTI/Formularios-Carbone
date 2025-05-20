import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient, testCredentials, supabaseConfig } from '@/lib/config'
import { createClient } from '@supabase/supabase-js'
import { sendMail, getNewUserEmailTemplate } from '@/lib/mail'
import { createHash } from 'crypto'

// Function to hash passwords safely
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Backup direct key as a last resort - usando a mesma chave do arquivo de configuração
const HARDCODED_SERVICE_KEY = supabaseConfig.serviceKey;

// Direct admin client as fallback
function getFallbackAdminClient() {
  console.log('Using fallback admin client with hardcoded key');
  console.log('Key length:', HARDCODED_SERVICE_KEY.length);
  return createClient(supabaseConfig.url, HARDCODED_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Função para obter todos os usuários
export async function GET() {
  try {
    // Obter o cliente admin do Supabase
    let adminClient;
    try {
      adminClient = getSupabaseAdminClient();
    } catch (err) {
      console.error('Error getting admin client, using fallback:', err);
      adminClient = getFallbackAdminClient();
    }
    
    try {
      // Buscar usuários diretamente da tabela users
      const { data: users, error } = await adminClient
        .from('users')
        .select('id, email, name, role, created_at');
      
      if (error) {
        console.error('Erro na listagem de usuários da tabela:', error);
        throw error;
      }
      
      // Formatar os dados dos usuários
      const formattedUsers = (users || []).map(user => ({
        id: user.id,
        email: user.email,
        name: user.name || 'Usuário sem nome',
        role: user.role || 'user',
        createdAt: user.created_at
      }));
      
      return NextResponse.json({ users: formattedUsers });
    } catch (dbError) {
      console.error('Erro ao listar usuários da tabela:', dbError)
      
      // Em desenvolvimento, retornar ao menos o usuário admin
      console.log('Retornando usuário admin padrão para interface não quebrar')
      
      return NextResponse.json({
        users: [
          {
            id: 'dev-admin-id',
            email: testCredentials.admin.email,
            name: 'Admin (Dev)',
            role: 'admin',
            createdAt: new Date().toISOString()
          }
        ]
      })
    }
  } catch (error) {
    console.error('Erro inesperado ao listar usuários:', error)
    return NextResponse.json(
      { users: [], error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()

    // Validações básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'E-mail em formato inválido' },
        { status: 400 }
      )
    }

    // Validar o nível de acesso
    const validRoles = ['admin', 'manager', 'user']
    const userRole = role || 'user' // Se não for fornecido, assume 'user'
    
    if (!validRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Nível de acesso inválido' },
        { status: 400 }
      )
    }

    // Criar o cliente admin do Supabase
    let adminClient;
    try {
      adminClient = getSupabaseAdminClient();
    } catch (err) {
      console.error('Error getting admin client, using fallback for POST:', err);
      adminClient = getFallbackAdminClient();
    }

    // Verificar se o usuário já existe na tabela 'users'
    const { data: existingUser, error: queryError } = await adminClient
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já registrado' },
        { status: 400 }
      );
    }

    // Gerar ID único para o usuário
    const userId = crypto.randomUUID ? crypto.randomUUID() : `user_${Date.now().toString(36)}`;
    
    // Hash a senha para salvar no banco
    const passwordHash = hashPassword(password);

    // Inserir usuário diretamente na tabela users
    try {
      const { data: newUser, error: insertError } = await adminClient
        .from('users')
        .insert({
          id: userId,
          email: email,
          name: name,
          password_hash: passwordHash,
          role: userRole,
          active: true,
          created_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('Erro ao inserir usuário na tabela users:', insertError);
        return NextResponse.json(
          { error: 'Falha ao criar usuário no banco de dados' },
          { status: 500 }
        );
      }

      // Enviar e-mail com as credenciais
      try {
        const emailTemplate = getNewUserEmailTemplate(name, email, password, userRole)
        const emailResult = await sendMail({
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text
        })

        if (!emailResult.success) {
          console.warn('Usuário criado, mas falha ao enviar e-mail:', 
            emailResult.error?.code || 'Erro desconhecido')
        }
      } catch (emailError: any) {
        console.error('Erro ao enviar e-mail:', 
          emailError?.code || (emailError?.message ? emailError.message.substring(0, 100) : 'Erro desconhecido'))
        // Continuamos mesmo com erro no e-mail, pois o usuário já foi criado
      }

      return NextResponse.json({
        success: true,
        message: 'Usuário criado com sucesso',
        user: { 
          id: userId, 
          email, 
          name, 
          role: userRole 
        }
      });
    } catch (error) {
      console.error('Erro ao inserir usuário:', error);
      return NextResponse.json(
        { error: 'Falha ao criar usuário no banco de dados' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Criar um endpoint para criar um usuário padrão para testes
export async function PUT(req: NextRequest) {
  try {
    let adminClient;
    try {
      adminClient = getSupabaseAdminClient();
    } catch (err) {
      console.error('Error getting admin client, using fallback for PUT:', err);
      adminClient = getFallbackAdminClient();
    }
    
    // Usar as credenciais de teste do arquivo de configuração
    const testUser = testCredentials.admin
    
    // Verificar se o usuário já existe
    const { data: existingUser, error: queryError } = await adminClient
      .from('users')
      .select('id')
      .eq('email', testUser.email)
      .single();
      
    if (existingUser) {
      console.log('Usuário de teste já existe na tabela users');
      return NextResponse.json({
        message: 'Usuário de teste já existe',
        user: {
          email: testUser.email,
          password: testUser.password,
          role: testUser.role
        }
      });
    }
    
    // Criar usuário de teste na tabela users
    const userId = crypto.randomUUID ? crypto.randomUUID() : `user_${Date.now().toString(36)}`;
    const passwordHash = hashPassword(testUser.password);
    
    const { error: insertError } = await adminClient
      .from('users')
      .insert({
        id: userId,
        email: testUser.email,
        name: testUser.name,
        password_hash: passwordHash,
        role: testUser.role,
        active: true,
        created_at: new Date().toISOString()
      });
      
    if (insertError) {
      console.error('Erro ao criar usuário de teste na tabela users:', insertError);
      return NextResponse.json(
        { error: 'Falha ao criar usuário de teste' },
        { status: 500 }
      );
    }
    
    // Retornar informações do usuário criado
    return NextResponse.json({
      message: 'Usuário de teste criado com sucesso',
      user: {
        email: testUser.email,
        password: testUser.password,
        role: testUser.role
    }
    });
  } catch (error: any) {
    console.error('Erro ao criar usuário de teste:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar usuário de teste' },
      { status: 500 }
    )
  }
} 