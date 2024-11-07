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

    getPayOsSubscriptionReturn = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getPayOsSubscriptionReturn(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/subscription');
        res.redirect(redirectUrl.toString());
    });

    getPayOsSubscriptionCancel = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getPayOsSubscriptionCancel(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/subscription');
        res.redirect(redirectUrl.toString());
    });

}

export default new CheckoutController();    