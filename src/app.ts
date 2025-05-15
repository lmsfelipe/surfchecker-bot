import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { indexController } from './controllers/index';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '9080', 10);
const MONGODB_URI: string =
  process.env.MONGODB_URI || 'mongodb://mongo:27017/surfchecker';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('=========== MongoDB connected ===========');
    app.listen(PORT, () => {
      console.log(
        `>>>>>>>>>>>>> Server is running on port ${PORT} <<<<<<<<<<<<`,
      );
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Set up routes

// @ts-ignore
app.post('/surf-forecast', indexController.getSurfForecast);
// @ts-ignore
app.post('/webhook', indexController.webhook);
