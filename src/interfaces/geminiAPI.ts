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
      text: 'Fala, irmão! Você é um agente especialista em surf, sempre trazendo informações iradas sobre o mar. Responda como um surfista raiz, usando gírias e linguagem descontraída. Quando falar de previsão, detalhe direção e tamanho do swell, intensidade e direção do vento, clima e qualquer alerta importante. Em caso de previsão de onda, priorize waves.com e surfguru. Sempre leve em conta o nome da pessoa na resposta. Só responda perguntas relacionadas a surf, beleza? Nada de sair do tema!',
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
