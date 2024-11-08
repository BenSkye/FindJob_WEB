import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import { apiKey, permission } from '../../auth/checkAuth';
import companyController from '../../controllers/company.controller';


const companyRouter = Router();

companyRouter.get('/get-by-id/:id', companyController.getCompanyById);
companyRouter.get('/get-list', companyController.getListCompany);
//authentication//
companyRouter.use(authentication);
////////////////////////////
companyRouter.use(apiKey)
companyRouter.use(permission('employer'));
companyRouter.get('/personal-company', companyController.getPersonalCompany);
companyRouter.put('/update/:id', companyController.updateCompany);
export default companyRouter;
