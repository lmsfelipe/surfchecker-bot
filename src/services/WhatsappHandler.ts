import { serperAPI } from '../interfaces/serperApi';
import { firecrawlAPI } from '../interfaces/firecrawlApi';
import { surfForecastBuilder } from './surfForecastBuilder';

export class WhatsappHandler {
  async scrapeSpotUrls(
    spotURLs: { domain: string; url: string; tagToScrape: string[] }[],
  ): Promise<string> {
    try {
      const results = await Promise.all(
        spotURLs.map(async (spot) => {
          return firecrawlAPI(spot.url, spot.tagToScrape);
        }),
      );

      console.log('scrapeSpotUrls ===>', results);
      const scrapedUrls = results.flat().join(' ');

      return scrapedUrls;
    } catch (error) {
      console.log('Error in scrapeSpotUrls:', error);
      throw new Error(
        'Scrape URLs: Não foi possível obter as informações do pico mencionado.',
      );
    }
  }

  async getSurfForecast(
    message: string,
    senderName: string | undefined,
  ): Promise<string> {
    try {
      const spotURLs = await serperAPI(message);
      console.log('spotURL ===>', spotURLs);

      const contentScraped = await this.scrapeSpotUrls(spotURLs);
      console.log('contentScraped ===>', contentScraped);

      const surfForecast = await surfForecastBuilder(
        contentScraped,
        senderName,
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
