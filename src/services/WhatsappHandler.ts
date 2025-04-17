import { Message } from 'whatsapp-web.js';
import { ExtractedLocation, extractSurfSpot } from './surfSpotExtractor';
import { serperAPI } from '../interfaces/serperApi';
import { firecrawlAPI } from '../interfaces/firecrawlApi';
import { surfForecastBuilder } from './surfForecastBuilder';

export class WhatsappHandler {
  async extractSurfSpotFromMessage(
    message: Message,
  ): Promise<ExtractedLocation | false> {
    return extractSurfSpot(message.body);
  }

  async getSurfForecast(message: Message): Promise<string> {
    const surfSpot = await this.extractSurfSpotFromMessage(message);

    if (!surfSpot) {
      return 'Não encontramos o pico mencionado na sua mensagem. Por favor, revise a mensagem e adicione o nome do pico e a cidade.';
    }

    const spotURL = await serperAPI(surfSpot);
    const contentScraped = await firecrawlAPI(spotURL.data.organic[0].link);

    if (!contentScraped.markdown) {
      return 'Não conseguimos encontrar as condições do mar para o pico mencionado. Tente novamente mais tarde.';
    }

    const surfForecast = await surfForecastBuilder(contentScraped.markdown);

    return surfForecast;
  }

  // Gather user and response infos from IA and whatsapp message
  // Decrease the user allowed requests
  // Store infos on DB
  async storeRequest() {}
}
