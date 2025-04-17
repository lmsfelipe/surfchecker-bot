import { openAiAPI, GPTModel } from '../interfaces/openAiAPI';

export interface ExtractedLocation {
  spot: string;
  city: string;
}

export async function extractSurfSpot(
  userMessage: string,
): Promise<ExtractedLocation | false> {
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
      console.error('extractSurfSpot => No content in the response');
      return false;
    }

    const [spot, city] = extractedText.split(',').map((s) => s.trim());

    return spot && city ? { spot, city } : false;
  } catch (error) {
    console.error('extractSurfSpot => Error extracting surf spot:', error);
    return false;
  }
}
