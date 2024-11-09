import notificationRepo from "../repositories/notification.repo";
import { userModel } from "../models/user.model";

class NotificationService {
    static createNotification = async (data: any) => {
        return await notificationRepo.createNotification(data);
    }

    static getNotificationsByUserId = async (userId: string) => {
        return await notificationRepo.getNotificationsByUserId(userId);
    }

    static createNotificationForAllCandidates = async (notificationData: any) => {
        // Lấy tất cả users có role là candidate
        const candidates = await userModel.find({ roles: 'candidate' }).select('_id');
        
        // Tạo notifications cho từng candidate
        const notifications = candidates.map(candidate => ({
            userId: candidate._id,
            title: notificationData.title,
            content: notificationData.content,
            type: notificationData.type
        }));

        // Lưu tất cả notifications
        return await notificationRepo.createManyNotifications(notifications);
    }
}

export default NotificationService;