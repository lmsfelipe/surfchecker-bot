import { serperAPI } from '../interfaces/serperApi';
import { firecrawlAPI } from '../interfaces/firecrawlApi';
import { surfForecastBuilder } from './surfForecastBuilder';

export class WhatsappHandler {
  async getSurfForecast(
    message: string,
    senderName: string | undefined,
  ): Promise<string> {
    try {
      console.log('ws message ===>', message);

      const spotURL = await serperAPI(message);
      console.log('spotURL ===>', spotURL);

      const contentScraped = await firecrawlAPI(
        spotURL.url,
        spotURL.tagToScrape,
      );
      console.log('contentScraped ===>', contentScraped);

      const surfForecast = await surfForecastBuilder(
        contentScraped,
        senderName,
        message,
      );

      console.log('!! Surf Forecast Completed !!');
      return surfForecast;
    } catch (error) {
      console.log('Error in getSurfForecast:', error);

      if (error instanceof Error) {
        return error.message;
      }

      return 'Não conseguimos encontrar as condições do mar para o pico mencionado. Tente novamente mais tarde.';
    }
  }

  // Gather user and response infos from IA and whatsapp message
  // Decrease the user allowed requests
  // Store infos on DB
  async storeRequest() {}
}
