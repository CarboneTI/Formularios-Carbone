import { NextRequest, NextResponse } from 'next/server'

// Webhook único para todos os formulários SAC
const WEBHOOK_UNICO = "https://autogrowth.cabonesolucoes.com.br/webhook/b1551055-3ebb-4a94-8aea-89488772d8ff-unico"

export async function POST(req: NextRequest) {
  try {
    // Extrair dados do corpo da requisição
    const data = await req.json()
    
    console.log('API sac-webhook recebeu dados:', data)
    
    // Verificar se estamos em ambiente de desenvolvimento
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isDevelopment) {
      // Simular uma resposta bem-sucedida em ambiente de desenvolvimento
      console.log('Ambiente de desenvolvimento detectado. Simulando chamada de webhook...')
      
      // Simular um pequeno atraso para imitar uma chamada de rede
      await new Promise(resolve => setTimeout(resolve, 700))
      
      console.log('Simulação de webhook bem-sucedida', {
        success: true,
        url: WEBHOOK_UNICO,
        simulated: true,
        data
      })
      
      return NextResponse.json({ success: true, simulated: true })
    }
    
    // Em produção, envia para o webhook real
    const response = await fetch(WEBHOOK_UNICO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Webhook error: ${response.status} ${response.statusText}`, errorText)
      return NextResponse.json({ 
        error: 'Erro ao processar webhook',
        status: response.status,
        statusText: response.statusText
      }, { status: 500 })
    }
    
    // Retornar sucesso
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' }, 
      { status: 500 }
    )
  }
} 