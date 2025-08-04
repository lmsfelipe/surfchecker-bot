import { Request, Response } from 'express';
import { MessengerHandler } from '../services/MessengerHandler';
import { extractSurfSpot } from '../services/surfSpotExtractor';
import { evolutionApiService } from '../interfaces/evolutionApi';
import { randomWaitingMessage } from '../utils/randomWaitingMessage';

export const indexController = {
  async getSurfForecast(req: Request, res: Response): Promise<Response> {
    const { message, name, phoneNumber } = req.body;

    if (!message || typeof message !== 'string') {
      return res
        .status(400)
        .json({ error: 'Missing or invalid required fields' });
    }

    const messengerHandler = new MessengerHandler({
      message,
      phoneNumber,
      senderName: name,
    });

    try {
      const surfForecast = await messengerHandler.getSurfForecast();

      return res.status(200).json({ message: surfForecast });
    } catch (error) {
      return res.status(500).json({ error: 'Error retrieving users' });
    }
  },

  async extractLocation(req: Request, res: Response): Promise<Response> {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string',
      });
    }

    try {
      const location = await extractSurfSpot(message);
      return res.status(200).json(location);
    } catch (error) {
      return res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Error extracting location',
      });
    }
  },

  async webhook(req: Request, res: Response) {
    console.log('Evolution API Webhook:', req.body);

    const messageData = req.body?.data;
    const message = messageData?.message?.conversation;

    if (!message) {
      return res
        .status(400)
        .json({ error: 'Message is required in the request body' });
    }

    const extractPhone = (id: string) => id.split('@')[0];
    const phoneNumber = extractPhone(
      messageData.key.senderPn || messageData.key.remoteJid,
    );
    const senderName = messageData.pushName || '';

    const messengerHandler = new MessengerHandler({
      message,
      phoneNumber,
      senderName,
    });

    try {
      const waitingMessage = randomWaitingMessage();

      await evolutionApiService.sendTextMessage({
        number: phoneNumber,
        text: waitingMessage,
      });

      const surfForecast = await messengerHandler.getSurfForecast();

      // Send the response back via Evolution API
      const resp = await evolutionApiService.sendTextMessage({
        number: phoneNumber,
        text: surfForecast,
      });

      console.log('Response from Evolution API:', resp);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error in webhook:', error);
      return res
        .status(500)
        .json({ error: 'Error processing webhook request' });
    }
  },

  async sendMessage(req: Request, res: Response): Promise<Response> {
    const { number, text } = req.body;

    console.log('Send Message Request:', req.body);

    if (!number || !text) {
      return res.status(400).json({
        error: 'Both number and text are required',
      });
    }

    try {
      const response = await evolutionApiService.sendTextMessage({
        number,
        text,
      });

      return res.status(200).json(response);
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Failed to send message',
      });
    }
  },
};
