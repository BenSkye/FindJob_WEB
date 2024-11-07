import { NextFunction, Request, Response } from 'express';
import { CREATED, SuccessResponse } from '../core/success.response';
import { asyncHandler } from '../helpers/asyncHandler';
import CategoryService from '../services/category.service';
import ApplicationService from '../services/application.service';

class ApplicationController {
    sendApplication = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Send application successfully',
            metadata: await ApplicationService.sendApplication(req.params.jobId, req.body, req.keyStore.user),
        }).send(res);
    });

    getPersonalApplications = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get personal applications successfully',
            metadata: await ApplicationService.getPersonalApplications(req.keyStore.user),
        }).send(res);
    });

}
export default new ApplicationController();
