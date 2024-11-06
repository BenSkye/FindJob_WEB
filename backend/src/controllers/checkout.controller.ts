import { NextFunction } from "express";
import { SuccessResponse } from "../core/success.response";
import { asyncHandler } from "../helpers/asyncHandler";
import CheckoutService from "../services/checkout.service";


class CheckoutController {
    checkoutReview = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Checkout successfully',
            metadata: await CheckoutService.checkoutReview(req.keyStore.user, req.body.product_list),
        }).send(res);
    });

    oderByUser = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Order successfully',
            metadata: await CheckoutService.oderByUser(req.keyStore.user, req.body.product_list, req.body.user_address, req.body.payment_method, req),
        }).send(res);
    });
    oderByUserCakeDesign = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Order successfully',
            metadata: await CheckoutService.oderByUserCakeDesign(req.keyStore.user, req.body.bakery_id, req.body.quantity, req.body.price, req.body.user_address, req.body.customCake),
        }).send(res);
    });
    chekoutCakeDesign = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        new SuccessResponse({
            message: 'Order cake design successfully',
            metadata: await CheckoutService.checkOutCakeDesign(req.keyStore.user, req.params.orderCakeDesignId, req),
        }).send(res);
    });

    getVnpayReturn = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getVnpayReturn(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/bill');
        Object.keys(req.query).forEach(key => {
            redirectUrl.searchParams.append(key, req.query[key]);
        });
        res.redirect(redirectUrl.toString());
    });

    getVnpayCakeDesignReturn = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getVnpayCakeDesignReturn(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/bill');
        Object.keys(req.query).forEach(key => {
            redirectUrl.searchParams.append(key, req.query[key]);
        });
        res.redirect(redirectUrl.toString());
    });

    getPayOsReturn = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getPayOsReturn(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/orderstatus');
        res.redirect(redirectUrl.toString());

    });

    getPayOsCancel = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getPayOsCancel(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/checkout');
        res.redirect(redirectUrl.toString());
    });

    getPayOsCakeDesignReturn = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getPayOsCakeDesignReturn(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/orderstatus');
        res.redirect(redirectUrl.toString());
    });

    getPayOsCakeDesignCancel = asyncHandler(async (req: any, res: any, next: NextFunction) => {
        await CheckoutService.getPayOsCakeDesignCancel(req.query)
        const redirectUrl = new URL(process.env.FRONTEND_URL + '/orderstatus');
        res.redirect(redirectUrl.toString());
    });
}

export default new CheckoutController();    