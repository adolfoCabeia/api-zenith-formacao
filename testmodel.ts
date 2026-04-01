// testmodel.ts
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testAPI() {
  console.log('API Key presente:', API_KEY ? 'Sim (primeiros 10 chars: ' + API_KEY.substring(0, 10) + '...)' : 'NÃO');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  console.log('URL:', url.replace(API_KEY || '', '***'));
  
  try {
    const res = await fetch(url);
    console.log('Status:', res.status);
    console.log('StatusText:', res.statusText);
    
    const data = await res.json();
    console.log('Resposta completa:', JSON.stringify(data, null, 2));
    
    if (data.models) {
      console.log('\nModelos encontrados:');
      data.models.forEach((m: any) => {
        console.log(`- ${m.name} (${m.displayName})`);
      });
    } else {
      console.log('\nNenhum modelo listado. Possíveis causas:');
      console.log('1. API key inválida ou sem permissão');
      console.log('2. Projeto Google Cloud não habilitou Gemini API');
      console.log('3. Billing não configurado');
    }
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

testAPI();