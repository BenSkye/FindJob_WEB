import companyRepo from "../repositories/company.repo";
import paymentRepo from "../repositories/payment.repo";


class PaymentService {
    static createPayment = async (data: any) => {
        return await paymentRepo.createPayment(data);
    }

    static getPaymentByUserId = async (userId: string) => {
        return await paymentRepo.getPaymentByUserId(userId);
    }

    static getPaymentById = async (paymentId: string) => {
        return await paymentRepo.getPaymentById(paymentId);
    }

    static getListPayment = async () => {
        return await paymentRepo.getListPayment();
    }

}
export default PaymentService;