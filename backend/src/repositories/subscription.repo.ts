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
        return await subscriptionModel.findOne({ userId });
    }

    async getSubscriptionById(subscriptionId: string) {
        return await subscriptionModel.findById(subscriptionId);
    }


}

export default new SubscriptionRepo();