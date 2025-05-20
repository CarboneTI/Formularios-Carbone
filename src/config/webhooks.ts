/**
 * Webhook Configuration File
 * 
 * This file contains the configuration for webhooks that are triggered when forms are submitted.
 * Each form type can have multiple webhook endpoints that will be called when the form is submitted.
 */

// Webhook interface definition
export interface WebhookConfig {
  url: string;
  headers?: Record<string, string>;
  enabled: boolean;
  description: string;
}

// Type for all supported form types
export type FormType = 'automoveis' | 'energia-solar' | 'outros' | 'formulario-de-criacao-de-prompt';

// Mapping of form types to their webhook configurations
export const webhooks: Record<FormType, WebhookConfig[]> = {
  'automoveis': [
    {
      url: 'https://example.com/webhook/automoveis',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      enabled: false, // Disabled by default
      description: 'Webhook for automobile forms - sends data to CRM system'
    }
  ],
  'energia-solar': [
    {
      url: 'https://example.com/webhook/energia-solar',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      enabled: false, // Disabled by default
      description: 'Webhook for solar energy forms - sends data to lead management system'
    }
  ],
  'outros': [
    {
      url: 'https://example.com/webhook/outros',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      enabled: false, // Disabled by default
      description: 'Webhook for other service forms - sends data to general CRM'
    }
  ],
  'formulario-de-criacao-de-prompt': [
    {
      url: 'https://autogrowth.cabonesolucoes.com.br/webhook/2e418174-0f99-403f-9539-2d1dacbceaa2-formulario-de-criacao-de-prompt-automatizado',
      headers: {},
      enabled: true, // Enabled by default 
      description: 'Webhook for prompt creation form - processes form data with n8n workflow'
    }
  ]
};

/**
 * Sends data to all enabled webhooks for a specific form type
 * 
 * @param formType The type of form that was submitted
 * @param data The form data to send to the webhook endpoints
 * @returns Array of results from webhook calls
 */
export async function triggerWebhooks(formType: FormType, data: any): Promise<any[]> {
  const results = [];
  const webhooksForType = webhooks[formType] || [];
  
  // Skip if no webhooks or none are enabled
  if (webhooksForType.length === 0) {
    console.log(`No webhooks configured for form type: ${formType}`);
    return [];
  }
  
  console.log(`Attempting to trigger ${webhooksForType.length} webhooks for form type: ${formType}`);
  
  // Process each enabled webhook
  for (const webhook of webhooksForType) {
    if (!webhook.enabled) {
      console.log(`Skipping disabled webhook: ${webhook.url}`);
      continue; // Skip disabled webhooks
    }
    
    try {
      console.log(`Sending data to webhook: ${webhook.url} (${webhook.description})`);
      
      // Criar um objeto de resultado para simular a resposta do webhook quando em localhost
      // Isso ajuda a testar a UI mesmo quando o webhook real não pode ser alcançado
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log('Ambiente de desenvolvimento detectado. Simulando chamada de webhook...');
        
        // Simular um pequeno atraso para imitar uma chamada de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const simulatedResult = {
          success: true,
          status: 200,
          url: webhook.url,
          description: webhook.description,
          simulated: true
        };
        
        console.log('Simulação de webhook bem-sucedida', simulatedResult);
        results.push(simulatedResult);
        continue; // Pular a chamada real
      }
      
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...webhook.headers
        },
        body: JSON.stringify(data)
      });
      
      const responseText = await response.text();
      let responseData = '';
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = responseText;
      }
      
      console.log(`Webhook response: ${response.status} ${response.statusText}`, responseData);
      
      const result = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: webhook.url,
        description: webhook.description,
        responseData: responseData
      };
      
      if (!response.ok) {
        console.error(`Webhook error (${webhook.url}): ${response.status} ${response.statusText}`);
      }
      
      results.push(result);
    } catch (error) {
      console.error(`Error triggering webhook (${webhook.url}):`, error);
      results.push({
        success: false,
        url: webhook.url,
        description: webhook.description,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  return results;
} 