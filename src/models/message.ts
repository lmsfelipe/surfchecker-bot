import mongoose, { Schema, Document } from 'mongoose';
import { IMessage } from '../entities/Message';

interface IMessageModel extends Document, IMessage {}

const MessageSchema: Schema = new Schema(
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
  },
  {
    timestamps: true,
    _id: true,
  },
);

export const Message = mongoose.model<IMessageModel>('Message', MessageSchema);
