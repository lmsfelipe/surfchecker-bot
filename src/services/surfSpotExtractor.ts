import { openAiAPI, GPTModel } from '../interfaces/openAiAPI';

export interface ExtractedLocation {
  spot: string;
  city: string;
}

const throwErrorMessage = () => {
  console.error('Error: No spot or city found');

  throw new Error(
    'Não encontramos o pico mencionado na sua mensagem. Por favor, revise a mensagem e adicione o nome do pico e a cidade.',
  );
};

export async function extractSurfSpot(
  userMessage: string,
): Promise<ExtractedLocation> {
  try {
    const response = await openAiAPI(GPTModel.GPT4o_MINI, [
      {
        role: 'system',
        content: `Your are a bot assistant that only extracts a surf spot and city from a user message.
                  The format you should return is "SpotName, City". You also need to verify if the city actually is on the coast.
                  If no spot name is found or city isn't on the coast, respond with "false".`,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ]);

    const extractedText = response.choices[0]?.message?.content;

    if (!extractedText) {
      return throwErrorMessage();
    }

    const [spot, city] = extractedText.split(',').map((s) => s.trim());

    if (!spot || !city) {
      return throwErrorMessage();
    }

    return { spot, city };
  } catch (error) {
    return throwErrorMessage();
  }
}
