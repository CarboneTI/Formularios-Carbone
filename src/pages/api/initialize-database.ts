import { NextApiRequest, NextApiResponse } from 'next';
import { setupDatabaseSchema } from '@/lib/supabase-init';

/**
 * Endpoint para inicializar o banco de dados com todas as tabelas necessárias
 * 
 * Este endpoint deve ser chamado apenas uma vez após a configuração do Supabase
 * ou quando novas tabelas precisarem ser adicionadas.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apenas permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  // Em produção, você pode adicionar uma verificação de segurança adicional aqui
  // como uma senha de administrador ou token de acesso
  
  try {
    // Executar o setup do banco de dados
    const result = await setupDatabaseSchema();
    
    if (!result.success) {
      return res.status(500).json({ 
        error: result.message,
        sqlScript: result.sqlScript
      });
    }
    
    return res.status(200).json({ 
      success: true,
      message: result.message
    });
  } catch (error: any) {
    console.error('Erro ao inicializar banco de dados:', error);
    return res.status(500).json({ 
      error: error.message || 'Erro interno do servidor' 
    });
  }
} 