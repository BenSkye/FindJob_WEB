import { Router } from 'express';
import accessController from '../../controllers/access.controller';
import { authentication } from '../../auth/authUtils';
import { permission } from '../../auth/checkAuth';
import { apiKey } from '../../auth/checkAuth';

const userRouter = Router();

userRouter.use(authentication);
userRouter.use(apiKey);
// userRouter.use(permission('admin'));

userRouter.get('/get-user-stats', permission('admin'), accessController.getUserStats);

export default userRouter;
