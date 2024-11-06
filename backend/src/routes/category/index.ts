import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import { apiKey, permission } from '../../auth/checkAuth';
import categoryController from '../../controllers/category.controller';

const categoryRouter = Router();

categoryRouter.get('/list', categoryController.getListCategory);
categoryRouter.get('/get-by-id/:id', categoryController.getCategoryById);

//authentication//
categoryRouter.use(authentication);
////////////////////////////
categoryRouter.use(apiKey)
categoryRouter.use(permission('admin'));
categoryRouter.post('/create', categoryController.createCategory);
categoryRouter.put('/add-sub-category/:id', categoryController.addSubCategory);
categoryRouter.put('/add-many-sub-category/:id', categoryController.addManySubCategory);
export default categoryRouter;
