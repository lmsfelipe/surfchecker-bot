import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { User } from '../entities/User';
import { MessengerHandler } from '../services/MessengerHandler';
import { extractSurfSpot } from '../services/surfSpotExtractor';

export const indexController = {
  async createUser(req: Request, res: Response) {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userData = new User({ name, phoneNumber });
    console.log('userData ===>', userData.data);

    try {
      const user = new UserModel(userData.data);
      console.log('userModel ===>', user);

      await user.save();

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({
        error: 'Error creating user',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Error retrieving users' });
    }
  },

  async getSurfForecast(req: Request, res: Response): Promise<Response> {
    const { message, name, phoneNumber } = req.body;

    const messengerHandler = new MessengerHandler({
      message,
      phoneNumber,
      senderName: name,
    });

    if (!message || typeof message !== 'string') {
      return res
        .status(400)
        .json({ error: 'Missing or invalid required fields' });
    }

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

  // create a webhook endpoint to receive messages from whatsapp
  async webhook(req: Request, res: Response): Promise<Response> {
    console.log('Evolution API Webhook:', req.body);

    // Check if it's a message event
    if (!req.body) {
      return res
        .status(200)
        .json({ status: 'ignored', message: 'Not a message event' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Webhook received successfully',
    });

    // const message = req.body.body?.message;
    // const senderNumber = req.body.from;
    // const senderName = req.body.pushName;

    // if (!message || !senderNumber) {
    //   return res.status(400).json({
    //     error: 'Missing required fields in webhook payload',
    //   });
    // }

    // return res.status(200).json({
    //   status: 'success',
    //   message: 'Webhook received successfully',
    //   sender: senderNumber,
    // });
  },
};
