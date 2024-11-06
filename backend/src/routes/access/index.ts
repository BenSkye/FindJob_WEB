import { Router } from 'express';
import accessController from '../../controllers/access.controller';
import router from '..';
import { authentication } from '../../auth/authUtils';

const accessRouter = Router();

//signup
accessRouter.post('/signup', accessController.signUp);
accessRouter.post('/login', accessController.login);
accessRouter.get('/verify-email', accessController.verifyEmail);
accessRouter.post('/forgot-password', accessController.forgotPassword);
accessRouter.post('/reset-password/:token', accessController.resetPassword);
//authentication//
accessRouter.use(authentication);
////////////////////////////

accessRouter.post('/logout', accessController.logout);
accessRouter.post('/handleRefreshToken', accessController.handleRefreshToken);
accessRouter.get('/get-user', accessController.getUser);


export default accessRouter;
