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
        //nếu status là inactive thì gia hạn 30 ngày kể từ ngày hiện tại

        const subscription = await subscriptionRepo.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new Error('Subscription not found');
        }

        let endDate: Date;
        if (subscription.status === 'active') {
            endDate = new Date(subscription.endDate);
        } else if (subscription.status === 'expired') {
            endDate = new Date();
        } else {
            endDate = new Date();
        }
        endDate.setDate(endDate.getDate() + 30);


        //thêm paymentId vào history
        const history = subscription.history || [];
        //nếu paymentId đã tồn tại trong history thì không thêm vào
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

    static getSubscriptionStats = async () => {
        const currentDate = new Date();

        // Thống kê theo ngày (7 ngày gần nhất)
        const dailyStartDate = new Date(currentDate);
        dailyStartDate.setDate(currentDate.getDate() - 6);
        dailyStartDate.setHours(0, 0, 0, 0);

        // Thống kê theo tuần (4 tuần gần nhất)
        const weeklyStartDate = new Date(currentDate);
        weeklyStartDate.setDate(currentDate.getDate() - 28);
        weeklyStartDate.setHours(0, 0, 0, 0);

        // Thống kê theo tháng (12 tháng gần nhất)
        const monthlyStartDate = new Date(currentDate);
        monthlyStartDate.setMonth(currentDate.getMonth() - 11);
        monthlyStartDate.setHours(0, 0, 0, 0);

        const dailyStats = await subscriptionRepo.getSubscriptionStats({
            startDate: dailyStartDate,
            endDate: currentDate
        });

        const weeklyStats = await processWeeklyStats(dailyStats);
        const monthlyStats = await processMonthlyStats(dailyStats);

        return {
            daily: dailyStats,
            weekly: weeklyStats,
            monthly: monthlyStats
        };
    }

}

// Hàm helper để lấy số tuần trong năm
function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Helper function để xử lý thống kê theo tuần
const processWeeklyStats = (dailyStats: any[]) => {
    const weeklyData: { [key: string]: number } = {};

    dailyStats.forEach(stat => {
        const date = new Date(stat._id.year, stat._id.month - 1, stat._id.day);
        const weekNumber = getWeekNumber(date);
        const weekKey = `${stat._id.year}-W${weekNumber}`;

        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + stat.count;
    });

    return Object.entries(weeklyData).map(([week, count]) => ({
        week,
        count
    }));
}

// Helper function để xử lý thống kê theo tháng
const processMonthlyStats = (dailyStats: any[]) => {
    const monthlyData: { [key: string]: number } = {};

    dailyStats.forEach(stat => {
        const monthKey = `${stat._id.year}-${stat._id.month.toString().padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + stat.count;
    });

    return Object.entries(monthlyData).map(([month, count]) => ({
        month,
        count
    }));
}

export default SubscriptionService;