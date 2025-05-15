import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../entities/User';

interface IUserModel extends Document, IUser {}

const UserSchema: Schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    allowedRequests: {
      type: Number,
      required: false,
      default: 5,
    },
    favoriteSpot: {
      type: String,
      required: false,
    },
    forecasts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Forecast',
      },
    ],
  },
  {
    timestamps: true,
    _id: true,
  },
);

export const UserModel = mongoose.model<IUserModel>('User', UserSchema);
