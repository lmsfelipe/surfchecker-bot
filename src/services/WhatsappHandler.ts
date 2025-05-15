import { serperAPI } from '../interfaces/serperApi';
import { firecrawlAPI } from '../interfaces/firecrawlApi';
import { surfForecastBuilder } from './surfForecastBuilder';
import { extractSurfSpot } from './surfSpotExtractor';
import { Forecast } from '../models/forecast';
import { UserModel } from '../models/user.js';

interface MessageInfo {
  phoneNumber?: string;
  senderName?: string;
  message: string;
}

export class WhatsappHandler {
  constructor(private readonly messageInfo: MessageInfo) {}

  async getSurfForecast(): Promise<string> {
    try {
      console.log('ws message ===>', this.messageInfo.message);

      const spotURL = await serperAPI(this.messageInfo.message);
      console.log('spotURL ===>', spotURL);

      const contentScraped = await firecrawlAPI(
        spotURL.url,
        spotURL.tagToScrape,
      );
      console.log('contentScraped ===>', contentScraped);

      const surfForecast = await surfForecastBuilder(
        contentScraped,
        this.messageInfo.senderName,
        this.messageInfo.message,
      );

      console.log('!! Surf Forecast Completed !!');
      this.storeRequest(surfForecast);
      return surfForecast;
    } catch (error) {
      console.log('Error in getSurfForecast:', error);

      if (error instanceof Error) {
        return error.message;
      }

      return 'Não conseguimos encontrar as condições do mar para o pico mencionado. Tente novamente mais tarde.';
    }
  }

  async storeRequest(forecastMessage: string) {
    if (!this.messageInfo.phoneNumber) {
      throw new Error('Phone number is required to store forecast');
    }

    // extract the spot, city and state from the message using the surfSpotExtractor
    const response = await extractSurfSpot(this.messageInfo.message);

    if (response === false) {
      throw new Error('Failed to extract surf spot information.');
    }

    const { spot, city, state } = response;

    console.log('spot ===>', spot, 'city ===>', city, 'state ===>', state);

    const forecast = new Forecast({
      response: forecastMessage,
      senderMessage: this.messageInfo.message,
      city,
      state,
      spot,
    });

    const savedForecast = await forecast.save();
    const forecastId = savedForecast._id;

    // Try to find existing user
    let user = await UserModel.findOne({
      phoneNumber: this.messageInfo.phoneNumber,
    });

    if (user) {
      // Update existing user
      const currentAllowedRequests = user.allowedRequests ?? 5;

      user.forecasts?.push(forecastId);
      user.allowedRequests = currentAllowedRequests - 1;
      await user.save();
      console.log('User found and forecast saved successfully.');
    } else {
      // Create new user
      user = new UserModel({
        name: this.messageInfo.senderName || 'Unknown',
        phoneNumber: this.messageInfo.phoneNumber,
        allowedRequests: 4, // Start with 4 since we're using one request now
        forecasts: [forecastId],
      });

      await user.save();
      console.log('New user created and forecast saved successfully.');
    }
  }
}
