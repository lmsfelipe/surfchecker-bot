import { Message } from '../models/message';
import { UserModel } from '../models/user.js';
import { geminiAPI } from '../interfaces/geminiAPI';

interface MessageInfo {
  phoneNumber: string;
  senderName?: string;
  message: string;
}

export class MessengerHandler {
  constructor(private readonly messageInfo: MessageInfo) {}

  private async validateRequest(): Promise<string | null> {
    if (this.messageInfo.message.length < 15) {
      return 'Message is too short. Please provide more details about the surf spot.';
    }

    const user = await UserModel.findOne({
      phoneNumber: this.messageInfo.phoneNumber,
    });

    if (user && (user.allowedRequests ?? 0) <= 0) {
      return 'No request allowed';
    }

    return null;
  }

  async getSurfForecast(): Promise<string> {
    try {
      // const validationError = await this.validateRequest();
      // if (validationError) return validationError;

      console.log('ws message ===>', this.messageInfo.message);

      const geminiResponse = await geminiAPI(
        `mensagem: ${this.messageInfo.message} pessoa: ${this.messageInfo.senderName}`,
      );

      if (!geminiResponse) {
        throw new Error('No response from Gemini API');
      }

      console.log('!! Surf Forecast Completed !!', geminiResponse);

      this.storeRequest(geminiResponse);
      return geminiResponse;
    } catch (error) {
      console.log('Error in getSurfForecast:', error);

      if (error instanceof Error) {
        return error.message;
      }

      return 'Não conseguimos encontrar as condições do mar para o pico mencionado. Tente novamente mais tarde.';
    }
  }

  async storeRequest(forecastMessage: string) {
    console.log('Storing forecast message...');

    if (!this.messageInfo.phoneNumber) {
      throw new Error('Phone number is required to store forecast');
    }

    const forecast = new Message({
      response: forecastMessage,
      senderMessage: this.messageInfo.message,
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

      user.messages?.push(forecastId);
      user.allowedRequests = currentAllowedRequests - 1;
      await user.save();
      console.log('User found and forecast saved successfully.');
    } else {
      // Create new user
      user = new UserModel({
        name: this.messageInfo.senderName || 'Unknown',
        phoneNumber: this.messageInfo.phoneNumber,
        allowedRequests: 4, // Start with 4 since we're using one request now
        messages: [forecastId],
      });

      await user.save();
      console.log('New user created and forecast saved successfully.');
    }
  }
}
