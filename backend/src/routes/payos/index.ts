import { Router } from 'express';
import checkoutController from '../../controllers/checkout.controller';

const payosRouter = Router();

payosRouter.get('/return-subscription-payment', checkoutController.getPayOsSubscriptionReturn);
payosRouter.get('/cancel-subscription-payment', checkoutController.getPayOsSubscriptionCancel);



export default payosRouter;
