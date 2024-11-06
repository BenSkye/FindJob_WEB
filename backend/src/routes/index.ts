import { Router, Request, Response } from 'express';
import accessRouter from './access';
import { apiKey, permission } from '../auth/checkAuth';
import checkoutRouter from './checkout';
import vnpayRouter from './vnpay';
import payosRouter from './payos';


const router = Router();

//check apiKey
// router.use(apiKey)
//check permission
// router.use(permission('customer'))

router.use('/v1/api/checkout', checkoutRouter);
router.use('/v1/api/user', accessRouter);
router.use('/v1/api/vnpay', vnpayRouter);
router.use('/v1/api/payos', payosRouter);

export default router;
