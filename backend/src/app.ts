import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import mongoose from './dbs/init.mongodb';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { userModel } from './models/user.model';
import path from 'path';

// Import routes
import indexRouter from './routes/index';
import userRouter from './routes/user';
import SubscriptionService from './services/subscription.service';
// import { ordersModel } from './models/order.model';

const app = express();

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

// Middleware
app.use(morgan('dev'));
app.use(compression());
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init db
mongoose;
// Routes
app.use('/', indexRouter);


// Error handling middleware
app.use((req, res, next) => {
  const error: any = new Error('Not Found');
  error.status = 404;
  next(error);
});
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  });
});

cron.schedule('0 0 * * *', async () => {
  //check subscription expired every day at midnight (00:00)
  await SubscriptionService.checkSubscriptionExpired();
  console.log('Checked subscription expired');
});

export default app;
