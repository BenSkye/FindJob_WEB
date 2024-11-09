import { Router } from "express";
import NotificationController from "../../controllers/notification.controller";

const router = Router();

router.get('/:userId', NotificationController.getNotificationsByUserId);

export default router;