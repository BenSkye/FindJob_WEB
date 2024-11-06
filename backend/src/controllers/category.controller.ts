import { NextFunction, Request, Response } from 'express';
import { CREATED, SuccessResponse } from '../core/success.response';
import { asyncHandler } from '../helpers/asyncHandler';
import CategoryService from '../services/category.service';

class CategoryController {
    createCategory = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Create new category successfully',
            metadata: await CategoryService.createCategory(req.body),
        }).send(res);
    });

    addSubCategory = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Add sub category successfully',
            metadata: await CategoryService.addSubCategory(req.params.id, req.body),
        }).send(res);
    });

    addManySubCategory = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Add many sub category successfully',
            metadata: await CategoryService.addManySubCategory(req.params.id, req.body),
        }).send(res);
    });

    getListCategory = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get list category successfully',
            metadata: await CategoryService.getListCategory(),
        }).send(res);
    });

    getCategoryById = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get category by id successfully',
            metadata: await CategoryService.getCategoryById(req.params.id),
        }).send(res);
    });

}
export default new CategoryController();
