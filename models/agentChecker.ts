import mongoose, { Schema, Document } from 'mongoose';
import { IAgentChecker } from '../entities/AgentChecker';

interface IAgentCheckerModel extends Document, IAgentChecker {}

const AgentCheckerSchema: Schema = new Schema(
  {
    response: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    spot: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const AgentChecker = mongoose.model<IAgentCheckerModel>(
  'AgentChecker',
  AgentCheckerSchema,
);
