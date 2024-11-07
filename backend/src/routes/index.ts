import { Router, Request, Response } from 'express';
import accessRouter from './access';
import { apiKey, permission } from '../auth/checkAuth';
import checkoutRouter from './checkout';
import payosRouter from './payos';
import categoryRouter from './category';
import levelRouter from './level';
import jobRouter from './job';
import templateRouter from './template';
import cvRouter from './cv';
import applicationRouter from './application';


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
router.use('/v1/api/template', templateRouter);
router.use('/v1/api/cv', cvRouter);
router.use('/v1/api/application', applicationRouter);

export default router;
