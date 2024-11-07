import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import { apiKey, permission } from '../../auth/checkAuth';
import checkoutController from '../../controllers/checkout.controller';

const checkoutRouter = Router();



//authentication//
checkoutRouter.use(authentication);
////////////////////////////
checkoutRouter.use(apiKey)
checkoutRouter.post('/checkout-subscription', checkoutController.checkoutSubscription);

export default checkoutRouter;
