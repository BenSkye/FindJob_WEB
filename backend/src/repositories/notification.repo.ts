import notificationModel from "../models/notification.model";

class NotificationRepo {
    async createNotification(data: any) {
        return await notificationModel.create(data);
    }

    async getNotificationsByUserId(userId: string) {
        return await notificationModel.find({ userId });
    }
}

export default new NotificationRepo();