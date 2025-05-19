import { request } from './axiosRequest';

interface SendMessageRequest {
  number: string;
  text: string;
}

const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;

export const evolutionApiService = {
  async sendTextMessage(data: SendMessageRequest): Promise<any> {
    try {
      const response = await request.post(
        `${EVOLUTION_API_URL}/message/sendText/checker`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            apikey: EVOLUTION_API_KEY,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error in sendTextMessage:', error);
        throw new Error(`Failed to send message: ${error.message}`);
      }
      throw error;
    }
  },
};
