import { NextRequest, NextResponse } from 'next/server'
import { triggerWebhooks, FormType } from '@/config/webhooks'

export async function POST(req: NextRequest) {
  try {
    // Extrair dados do corpo da requisição
    const data = await req.json()
    
    console.log('API generate-prompt recebeu dados:', data);
    
    // Verificar os campos obrigatórios comuns
    if (!data.nomeEmpresa || !data.tempoMercado || !data.localizacao || 
        !data.nomeAssistente || !data.generoBot || 
        !data.regrasCriticas || !data.proibicoesAbsolutas || !data.exemplosConversas) {
      return NextResponse.json(
        { error: 'Campos básicos obrigatórios não preenchidos' }, 
        { status: 400 }
      )
    }
    
    // Map tipoFormulario to formType if it exists (to support the n8n workflow)
    if (data.tipoFormulario) {
      switch (data.tipoFormulario) {
        case 'formCarros':
          data.formType = 'automoveis';
          break;
        case 'formEnergiaSolar':
          data.formType = 'energia-solar';
          break;
        case 'formOutros':
          data.formType = 'outros';
          break;
        default:
          // Keep existing formType if available
          if (!data.formType) {
            data.formType = 'outros'; // Default fallback
          }
      }
    }
    
    // Verificar campos específicos por tipo de formulário
    let camposValidos = true;
    let mensagemErro = '';
    
    switch (data.formType) {
      case 'automoveis':
        if (!data.tiposVeiculos || !data.marcasTrabalhadas || !data.formasPagamento ||
            !data.diferenciais || !data.taxasAdicionais) {
          camposValidos = false;
          mensagemErro = 'Campos específicos para automóveis são obrigatórios';
        }
        break;
        
      case 'energia-solar':
        if (!data.tiposSistemas || !data.marcasEquipamentos || !data.formasPagamento ||
            !data.diferenciais || !data.beneficiosEconomicos) {
          camposValidos = false;
          mensagemErro = 'Campos específicos para energia solar são obrigatórios';
        }
        break;
        
      case 'outros':
        if (!data.tipoServico || !data.publico || !data.formasPagamento ||
            !data.diferenciais || !data.precosServicos || !data.politicasCancelamento) {
          camposValidos = false;
          mensagemErro = 'Campos específicos para outros serviços são obrigatórios';
        }
        break;
    }
    
    if (!camposValidos) {
      return NextResponse.json({ error: mensagemErro }, { status: 400 });
    }
    
    // Gerar o prompt baseado nos dados recebidos
    console.log('Gerando prompt para formType:', data.formType);
    const prompt = generatePromptTemplate(data);
    
    // Enviar para o webhook
    console.log('Enviando dados para webhook:', data.formType);
    
    // Trigger webhooks asynchronously (don't wait for them to complete)
    triggerWebhooks(data.formType, {
      formData: data,
      prompt: prompt,
      timestamp: new Date().toISOString(),
      formType: data.formType,
      tipoFormulario: data.tipoFormulario // Include this for backwards compatibility
    }).catch(error => {
      console.error('Error triggering webhooks:', error);
    });
    
    // Retornar o prompt gerado
    return NextResponse.json({ prompt }, { status: 200 })
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' }, 
      { status: 500 }
    )
  }
}

function generatePromptTemplate(data: any) {
  // Determinar pronomes baseados no gênero escolhido
  const pronomes = {
    'feminino': { subjetivo: 'ela', possessivo: 'sua', objetivo: 'a' },
    'masculino': { subjetivo: 'ele', possessivo: 'seu', objetivo: 'o' },
    'neutro': { subjetivo: 'ele/ela', possessivo: 'seu/sua', objetivo: 'o/a' }
  }
  
  const genero = data.generoBot as keyof typeof pronomes
  const { subjetivo, possessivo, objetivo } = pronomes[genero] || pronomes.neutro
  
  // Seção de características específicas por tipo de formulário
  let caracteristicas = '';
  let tipoNegocio = '';
  
  switch (data.formType) {
    case 'automoveis':
      tipoNegocio = 'veículos';
      caracteristicas = `## CARACTERÍSTICAS DA LOJA
- **Tipos de Veículos**: ${data.tiposVeiculos}
- **Marcas Trabalhadas**: ${data.marcasTrabalhadas}
- **Formas de Pagamento**: ${data.formasPagamento}
- **Diferenciais**: ${data.diferenciais}
- **Taxas Adicionais**: ${data.taxasAdicionais}`;
      break;
      
    case 'energia-solar':
      tipoNegocio = 'sistemas de energia solar';
      caracteristicas = `## CARACTERÍSTICAS DA EMPRESA
- **Tipos de Sistemas**: ${data.tiposSistemas}
- **Marcas de Equipamentos**: ${data.marcasEquipamentos}
- **Formas de Pagamento**: ${data.formasPagamento}
- **Diferenciais**: ${data.diferenciais}
- **Benefícios Econômicos**: ${data.beneficiosEconomicos}`;
      break;
      
    case 'outros':
      tipoNegocio = 'serviços';
      caracteristicas = `## CARACTERÍSTICAS DA EMPRESA
- **Tipo de Serviço/Produto**: ${data.tipoServico}
- **Público-Alvo**: ${data.publico}
- **Preços e Serviços**: ${data.precosServicos}
- **Formas de Pagamento**: ${data.formasPagamento}
- **Diferenciais**: ${data.diferenciais}
- **Políticas de Cancelamento**: ${data.politicasCancelamento}`;
      break;
      
    case 'formulario-de-criacao-de-prompt':
      // Direct passthrough, no template needed as this will be processed by n8n
      return data.prompt || 'Prompt to be generated by n8n workflow';
  }
  
  return `# INSTRUÇÕES PARA O ASSISTENTE VIRTUAL ${data.nomeAssistente.toUpperCase()} DA ${data.nomeEmpresa.toUpperCase()}

## IDENTIDADE DO ASSISTENTE
- **Nome**: ${data.nomeAssistente}
- **Função**: Assistente Virtual da ${data.nomeEmpresa}
- **Tempo de Mercado da Empresa**: ${data.tempoMercado}
- **Localização/Região**: ${data.localizacao}

${caracteristicas}

## PERSONALIDADE DO ASSISTENTE
${data.nomeAssistente} deve se comportar de maneira profissional e atenciosa, sempre mantendo um tom cordial. ${subjetivo.charAt(0).toUpperCase() + subjetivo.slice(1)} representa a ${data.nomeEmpresa} e deve transmitir confiança e conhecimento sobre ${tipoNegocio}. ${subjetivo.charAt(0).toUpperCase() + subjetivo.slice(1)} deve ser prestativ${objetivo} e focad${objetivo} em ajudar os clientes a encontrar ${data.formType === 'automoveis' ? 'o veículo ideal' : data.formType === 'energia-solar' ? 'a solução de energia solar ideal' : 'o serviço ideal'} para suas necessidades.

## REGRAS CRÍTICAS
${data.regrasCriticas}

## PROIBIÇÕES ABSOLUTAS
${data.proibicoesAbsolutas}

## EXEMPLOS DE RESPOSTAS
${data.exemplosConversas}

## INFORMAÇÕES DE CONTATO
- **Email**: ${data.emailContato || 'Não fornecido'}
- **Site**: ${data.siteEmpresa || 'Não fornecido'}

## OBSERVAÇÕES ADICIONAIS
${data.observacoesAdicionais || 'Nenhuma observação adicional.'}

Este prompt foi gerado automaticamente pela Central de Formulários da Carbone Company.`
} 