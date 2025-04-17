import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { User } from '../entities/User';

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
      return res
        .status(500)
        .json({ error: 'Error creating user', message: error.message });
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
};
