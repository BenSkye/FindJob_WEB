import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import { apiKey, permission } from '../../auth/checkAuth';
import companyController from '../../controllers/company.controller';

const companyRouter = Router();

companyRouter.get('/get-by-id/:id', companyController.getCompanyById);

//authentication//
companyRouter.use(authentication);
////////////////////////////
companyRouter.use(apiKey)
companyRouter.use(permission('employer'));
companyRouter.put('/update/:id', companyController.updateCompany);
export default companyRouter;