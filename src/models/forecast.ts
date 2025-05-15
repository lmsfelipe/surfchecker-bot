import mongoose, { Schema, Document } from 'mongoose';
import { IForecast } from '../entities/Forecast';

interface IForecastModel extends Document, IForecast {}

const ForecastSchema: Schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    senderMessage: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    spot: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    _id: true,
  },
);

export const Forecast = mongoose.model<IForecastModel>(
  'Forecast',
  ForecastSchema,
);
