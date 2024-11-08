import companyRepo from "../repositories/company.repo";
import subscriptionRepo from "../repositories/subscription.repo";


class SubscriptionService {
    static createSubscription = async (userId: string) => {
        const startDate = new Date();
        const endDate = new Date(startDate);
        const data = {
            userId,
            startDate,
            endDate,
            history: []
        }
        return await subscriptionRepo.createSubscription(data);
    }

    //gia hạn subscription
    static extendSubscription = async (userId: string, paymentId: string) => {
        // nếu status của subscription là active thì gia hạn 30 ngày kể từ endDate hiện tại
        // nếu status của subscription là expired thì gia hạn 30 ngày kể từ ngày hiện tại

        const subscription = await subscriptionRepo.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new Error('Subscription not found');
        }

        let endDate: Date;
        if (subscription.status === 'active') {
            endDate = new Date(subscription.endDate);
        } else {
            endDate = new Date();
        }
        endDate.setDate(endDate.getDate() + 30);


        //thêm paymentId vào history
        const history = subscription.history || [];
        history.push({ paymentId, endDate });
        const data = {
            endDate,
            history,
            status: 'active'
        }
        const updatedSubscription = await subscriptionRepo.updateSubscription(subscription._id.toString(), data);
        return updatedSubscription;
    }

    //hàm kiểm tra subscription có hết hạn hay không sẽ được chạy mỗi ngày bằng cron job trong file server.ts
    static checkSubscriptionExpired = async () => {
        //lấy tất cả subscription có status là active
        const subscriptions = await subscriptionRepo.getSubscriptions({ status: 'active' });
        //nếu endDate của subscription nhỏ hơn ngày hiện tại thì update status của subscription thành expired
        for (const subscription of subscriptions) {
            if (subscription.endDate < new Date()) {
                await subscriptionRepo.updateSubscription(subscription._id.toString(), { status: 'expired' });
            }
        }
        return subscriptions;
    }


    static getPersonalSubcriptions = async (userId: string) => {
        return await subscriptionRepo.getSubscriptionByUserId(userId);
    }


}
export default SubscriptionService;