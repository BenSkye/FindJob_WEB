import { Router } from 'express';
import checkoutController from '../../controllers/checkout.controller';

const payosRouter = Router();

payosRouter.get('/return-subscription-payment', checkoutController.getPayOsSubscriptionReturn);
payosRouter.get('/cancel-subscription-payment', checkoutController.getPayOsSubscriptionCancel);

payosRouter.get('/return-publish-job-payment', checkoutController.getPayOsPublishJobReturn);
payosRouter.get('/cancel-publish-job-payment', checkoutController.getPayOsPublishJobCancel);



export default payosRouter;
