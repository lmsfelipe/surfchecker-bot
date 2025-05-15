import { openAiAPI, GPTModel } from '../interfaces/openAiAPI';

export interface ExtractedLocation {
  spot: string;
  city: string;
  state: string;
}

const throwErrorMessage = () => {
  console.error('Erro: Nenhum pico ou cidade encontrado');

  throw new Error(
    'Não encontramos o pico mencionado na sua mensagem. Por favor, revise a mensagem e adicione o nome do pico e a cidade.',
  );
};

export async function extractSurfSpot(
  userMessage: string,
): Promise<ExtractedLocation | false> {
  try {
    const response = await openAiAPI(GPTModel.GPT4o, [
      {
        role: 'system',
        content: `Você é um assistente que extrai o pico de surf, cidade e estado de uma mensagem do usuário.`,
      },
      {
        role: 'user',
        content: `O formato que você deve retornar é "pico, cidade, estado".
                  Se não encontrar pico, cidade ou estado, responda com string false.
                  Se você não conseguir encontrar nenhum pico, cidade ou estado, tente pelo menos extrair o pico de surf da mensagem.`,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ]);

    const extractedText = response.choices[0]?.message?.content;

    console.log('extractedText ===>', extractedText);

    if (!extractedText) {
      return throwErrorMessage();
    }

    if (extractedText === 'false') {
      return false;
    }

    const [spot, city, state] = extractedText.split(',').map((s) => s.trim());

    if (!spot && !city && !state) {
      return throwErrorMessage();
    }

    return { spot, city, state };
  } catch (error) {
    return throwErrorMessage();
  }
}
