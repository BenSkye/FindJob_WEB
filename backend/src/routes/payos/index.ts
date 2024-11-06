import { Router } from 'express';
import checkoutController from '../../controllers/checkout.controller';

const payosRouter = Router();

payosRouter.get('/return-product-payment', checkoutController.getPayOsReturn);
payosRouter.get('/cancel-product-payment', checkoutController.getPayOsCancel);
payosRouter.get('/return-cake-design-payment', checkoutController.getPayOsCakeDesignReturn);
payosRouter.get('/cancel-cake-design-payment', checkoutController.getPayOsCakeDesignCancel);




export default payosRouter;
