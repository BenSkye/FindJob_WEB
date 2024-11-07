import { Router, Request, Response } from 'express';
import accessRouter from './access';
import { apiKey, permission } from '../auth/checkAuth';
import checkoutRouter from './checkout';
import payosRouter from './payos';
import categoryRouter from './category';
import levelRouter from './level';
import jobRouter from './job';


const router = Router();

//check apiKey
// router.use(apiKey)
//check permission
// router.use(permission('customer'))

router.use('/v1/api/checkout', checkoutRouter);
router.use('/v1/api/user', accessRouter);
router.use('/v1/api/payos', payosRouter);
router.use('/v1/api/category', categoryRouter);
router.use('/v1/api/level', levelRouter);
router.use('/v1/api/job', jobRouter);

export default router;
