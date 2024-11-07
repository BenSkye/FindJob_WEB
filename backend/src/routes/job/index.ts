import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import { apiKey, permission } from '../../auth/checkAuth';
import categoryController from '../../controllers/category.controller';
import jobController from '../../controllers/job.controller';

const jobRouter = Router();

jobRouter.get('/list-job-by-candidate', jobController.getListJobByCandidate);
jobRouter.get('/get-job-by-id/:jobId', jobController.getJobById);

//authentication//
jobRouter.use(authentication);
////////////////////////////
jobRouter.use(apiKey)
jobRouter.post('/create', permission('employer'), jobController.createJob);
jobRouter.put('/publish-job-when-active-subscription/:jobId', permission('employer'), jobController.publishJobWhenActiveSubscription);
jobRouter.get('/list-applications-by-job-id/:jobId', permission('employer'), jobController.getListApplicationsByJobId);
export default jobRouter;
