import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import bakeryController from '../../controllers/bakery.controller';
import { apiKey, permission } from '../../auth/checkAuth';
import productController from '../../controllers/product.controller';
import checkoutController from '../../controllers/checkout.controller';

const vnpayRouter = Router();

vnpayRouter.get('/return-product-payment', checkoutController.getVnpayReturn);
vnpayRouter.get('/return-cake-design-payment', checkoutController.getVnpayCakeDesignReturn);



export default vnpayRouter;
