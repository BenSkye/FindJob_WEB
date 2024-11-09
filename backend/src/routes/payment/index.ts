import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import { apiKey, permission } from '../../auth/checkAuth';
import paymentController from '../../controllers/payment.controller';

const paymentRouter = Router();


//authentication//
paymentRouter.use(authentication);
////////////////////////////
paymentRouter.use(apiKey)
paymentRouter.get('/get-personal-payment', paymentController.getPaymentByUserId);
paymentRouter.get('/get-by-id/:id', paymentController.getPaymentById);
paymentRouter.get('/get-list', permission('admin'), paymentController.getListPayment);
paymentRouter.get('/get-payment-stats', permission('admin'), paymentController.getPaymentStats);
export default paymentRouter;
