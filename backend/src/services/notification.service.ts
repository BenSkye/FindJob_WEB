import notificationRepo from "../repositories/notification.repo";

class NotificationService {
    static createNotification = async (data: any) => {
        return await notificationRepo.createNotification(data);
    }

    static getNotificationsByUserId = async (userId: string) => {
        return await notificationRepo.getNotificationsByUserId(userId);
    }
}

export default NotificationService;