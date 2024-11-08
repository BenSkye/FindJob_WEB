import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import { apiKey, permission } from '../../auth/checkAuth';
import subscriptionController from '../../controllers/subscription.controller';
const subscriptionRouter = Router();


//authentication//
subscriptionRouter.use(authentication);
////////////////////////////
subscriptionRouter.use(apiKey)
subscriptionRouter.get('/personal', permission('employer'), subscriptionController.getPersonalSubcriptions);

export default subscriptionRouter;
