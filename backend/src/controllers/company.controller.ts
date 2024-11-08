import { NextFunction, Request, Response } from 'express';
import { CREATED, SuccessResponse } from '../core/success.response';
import { asyncHandler } from '../helpers/asyncHandler';
import CategoryService from '../services/category.service';
import CompanyService from '../services/company.service';

class CompanyController {

    getCompanyById = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get company by id successfully',
            metadata: await CompanyService.getCompanyById(req.params.id),
        }).send(res);
    });

    updateCompany = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Update company successfully',
            metadata: await CompanyService.updateCompany(req.params.id, req.body),
        }).send(res);
    });

    getPersonalCompany = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get personal company successfully',
            metadata: await CompanyService.getPersonalCompany(req.user.userId),
        }).send(res);
    });

}
export default new CompanyController();
