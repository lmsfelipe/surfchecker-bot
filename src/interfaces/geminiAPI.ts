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
      text: `você é um agente responsável por extrair dados atuais de previsão de onda e responder em linguagem de surfista, em português, as informações que o usuário demanda. Responder com dados detalhados sobre direção do swell e intensidade e direção do vento para a previsão de surf. Levar em consideração o nome da pessoa. Levar em consideração clima e alertas climáticos. Importante, limitar as perguntas apenas no contexto de surf!.`,
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
