import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import { apiKey, permission } from '../../auth/checkAuth';
import applicationController from '../../controllers/application.controller';

const applicationRouter = Router();


//authentication//
applicationRouter.use(authentication);
////////////////////////////
applicationRouter.use(apiKey)
applicationRouter.use(permission('candidate'));
applicationRouter.post('/send-application/:jobId', applicationController.sendApplication);
applicationRouter.get('/personal-applications', applicationController.getPersonalApplications);
applicationRouter.get('/personal-job-has-applied', applicationController.getPersonalJobHasApplied);
export default applicationRouter;
