import { companyModel } from "../models/company.model";
import { subscriptionModel } from "../models/subscription.model";


class SubscriptionRepo {
    async createSubscription(data: any) {
        return await subscriptionModel.create(data);
    }

    async updateSubscription(subscriptionId: string, data: any) {
        return await subscriptionModel.findByIdAndUpdate(subscriptionId, data, { new: true });
    }

    async getSubscriptions(query: any) {
        return await subscriptionModel.find(query);
    }

    async getSubscriptionByUserId(userId: string) {
        return await subscriptionModel.findOne({ userId }).populate({
            path: 'history.paymentId',
            model: 'Payment'
        });;
    }

    async getSubscriptionById(subscriptionId: string) {
        return await subscriptionModel.findById(subscriptionId);
    }

   async getSubscriptionStats(timeRange: { startDate: Date, endDate: Date }) {
    return await subscriptionModel.aggregate([
        {
            $match: {
                createdAt: { $gte: timeRange.startDate, $lte: timeRange.endDate }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
        }
    ]);
}


}

export default new SubscriptionRepo();