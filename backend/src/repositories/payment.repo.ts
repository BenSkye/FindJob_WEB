import { paymentModel } from "../models/payment.model";


class PaymentRepo {
    async createPayment(data: any) {
        return await paymentModel.create(data);
    }

    async getPaymentByUserId(userId: string) {
        return await paymentModel.find({ userId }).sort({ createdAt: -1 });
    }

    async getPaymentById(paymentId: string) {
        return await paymentModel.findById(paymentId);
    }

    async getPaymentByPaymentCode(paymentCode: number) {
        return await paymentModel.findOne({ paymentCode });
    }

    async getListPayment() {
        return await paymentModel.find().sort({ createdAt: -1 });
    }

    async deletePayment(paymentCode: string) {
        return await paymentModel.findOneAndDelete({ paymentCode });
    }

     async getPaymentsByDateRange(startDate: Date, endDate: Date) {
        return await paymentModel.find({
            paymentDate: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ paymentDate: 1 });
    }


}

export default new PaymentRepo();