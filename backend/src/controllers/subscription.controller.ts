import { NextFunction, Request, Response } from 'express';
import { CREATED, SuccessResponse } from '../core/success.response';
import { asyncHandler } from '../helpers/asyncHandler';
import SubscriptionService from '../services/subscription.service';

class SubscriptionController {

    getPersonalSubcriptions = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get personal subcriptions successfully',
            metadata: await SubscriptionService.getPersonalSubcriptions(req.keyStore.user),
        }).send(res);
    });

}
export default new SubscriptionController();
