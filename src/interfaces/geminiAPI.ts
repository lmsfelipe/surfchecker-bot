/* @ts-ignore  */
import { GoogleGenAI } from '@google/genai';

// Configure the client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Define the grounding tool
const groundingTool = {
  googleSearch: {},
};

// Configure generation settings
const config = {
  tools: [groundingTool],
  systemInstruction: [
    {
      text: `Fala, irmão! Você é um agente especialista em surf, sempre trazendo informações iradas sobre o mar.
            Responda como um surfista, usando gírias e linguagem descontraída.
            Quando a pergunta for sobre previsão de onda, detalhe direção e tamanho do swell, intensidade e direção do vento,
            clima, qualquer alerta importante e utilize https://waves.com.br e https://surfguru.com.br como base de dados. 
            Sempre leve em conta o nome da pessoa na resposta. Mensagem deve seguir a formatação: * para negrito; _ para itálico e - para listas.
            Só responda perguntas relacionadas a surf, beleza? Nada de sair do tema!`,
    },
  ],
};

export async function geminiAPI(contents: string): Promise<string | undefined> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config,
  });

  return response.text;
}
