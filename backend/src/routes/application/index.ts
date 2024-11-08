import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import { apiKey, permission } from '../../auth/checkAuth';
import applicationController from '../../controllers/application.controller';

const applicationRouter = Router();


//authentication//
applicationRouter.use(authentication);
////////////////////////////
applicationRouter.use(apiKey)
applicationRouter.post('/send-application/:jobId', permission('candidate'), applicationController.sendApplication);
applicationRouter.get('/personal-applications', permission('candidate'), applicationController.getPersonalApplications);
applicationRouter.get('/personal-job-has-applied', permission('candidate'), applicationController.getPersonalJobHasApplied);
applicationRouter.get('/user-company-applications', permission('employer'), applicationController.getApplicationByUserCompany);
export default applicationRouter;
