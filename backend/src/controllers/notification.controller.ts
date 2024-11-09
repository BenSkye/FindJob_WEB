import NotificationService from "../services/notification.service";
import { asyncHandler } from "../helpers/asyncHandler";
import { CREATED, SuccessResponse } from "../core/success.response";
import { NextFunction, Request, Response } from "express";

class NotificationController {
    createNotification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Create notification successfully',
            metadata: await NotificationService.createNotification(req.body),
        }).send(res);
    });

    getNotificationsByUserId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get notifications by user id successfully',
            metadata: await NotificationService.getNotificationsByUserId(req.params.userId),
        }).send(res);
    });
}

export default new NotificationController();