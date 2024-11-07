import { NextFunction, Request, Response } from 'express';
import { CREATED, SuccessResponse } from '../core/success.response';
import { asyncHandler } from '../helpers/asyncHandler';
import PaymentService from '../services/payment.service';

class PaymentController {

    getPaymentById = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get payment by id successfully',
            metadata: await PaymentService.getPaymentById(req.params.id),
        }).send(res);
    });

    getPaymentByUserId = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get payment by user id successfully',
            metadata: await PaymentService.getPaymentByUserId(req.keyStore.user),
        }).send(res);
    });

    getListPayment = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get list payment successfully',
            metadata: await PaymentService.getListPayment(),
        }).send(res);
    });

}
export default new PaymentController();
