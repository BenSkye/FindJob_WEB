import { NextFunction } from "express";
import { SuccessResponse } from "../core/success.response";
import { asyncHandler } from "../helpers/asyncHandler";
import CheckoutService from "../services/checkout.service";


class CheckoutController {

    checkoutSubscription = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Order successfully',
            metadata: await CheckoutService.checkoutSubscription(req.keyStore.user),
        }).send(res);
    });

    checkoutPublishJob = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        new SuccessResponse({
            message: 'Order successfully',
            metadata: await CheckoutService.checkoutPublishJob(req.keyStore.user, req.params.jobId),
        }).send(res);
    });

    getPayOsSubscriptionReturn = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getPayOsSubscriptionReturn(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/employer/personal-job');
        res.redirect(redirectUrl.toString());
    });

    getPayOsSubscriptionCancel = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getPayOsSubscriptionCancel(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/employer/personal-job');
        res.redirect(redirectUrl.toString());
    });

    getPayOsPublishJobReturn = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getPayOsPublishJobReturn(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/employer/personal-job');
        res.redirect(redirectUrl.toString());
    });

    getPayOsPublishJobCancel = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getPayOsPublishJobCancel(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/employer/personal-job');
        res.redirect(redirectUrl.toString());
    });

    checkoutCVBuilder = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        new SuccessResponse({
            message: 'Order successfully',
            metadata: await CheckoutService.checkoutCVBuilder(req.keyStore.user, req.params.cvId),
        }).send(res);
    });

    savePaymentCodeCVBuilder = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        new SuccessResponse({
            message: 'Order successfully',
            metadata: await CheckoutService.savePaymentCodeCVBuilder(req.keyStore.user, req.params.paymentCode),
        }).send(res);
    });


}

export default new CheckoutController();    