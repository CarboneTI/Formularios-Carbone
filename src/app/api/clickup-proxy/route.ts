import { NextRequest, NextResponse } from 'next/server'

// Token do ClickUp
const CLICKUP_TOKEN = "pk_75431324_QRD7RDKQDZ92L4JUBXMTAAMHQHZDAAAL"
const BASE_URL = "https://api.clickup.com/api/v2/"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const endpoint = searchParams.get('endpoint')
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint não especificado' }, { status: 400 })
    }
    
    // Construir a URL para o ClickUp
    const url = `${BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': CLICKUP_TOKEN,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    // Simular um pequeno atraso para evitar ratelimits
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao acessar a API do ClickUp:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
} 