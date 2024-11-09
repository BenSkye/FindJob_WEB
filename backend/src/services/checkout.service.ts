import { BadRequestError } from "../core/error.response";
import VnpayService from "./vnpay.service";
import { generateOrderCode } from "../utils";
import { createPaymentLink, creatPaymentLinkFE } from "./payOs.service";
import subscriptionRepo from "../repositories/subscription.repo";
import paymentRepo from "../repositories/payment.repo";
import SubscriptionService from "./subscription.service";
import JobService from "./job.service";
import jobRepo from "../repositories/job.repo";
class CheckoutService {

    static checkoutSubscription = async (userId: string) => {
        const subscription = await subscriptionRepo.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new BadRequestError('Subscription not found');
        }
        // tạo payment
        const paymentCode = generateOrderCode();
        const paymentData = {
            userId,
            amount: 50000,
            paymentCode,
            paymentDate: new Date()
        }
        const paymentNew = await paymentRepo.createPayment(paymentData);
        const cancelUrl = '/cancel-subscription-payment';
        const returnUrl = '/return-subscription-payment';
        const paymentLink = await createPaymentLink(paymentCode, paymentNew.amount, 'thanh toan goi 30 ngay', cancelUrl, returnUrl);
        console.log('paymentLink:::', paymentLink);
        const paymentUrl = paymentLink.checkoutUrl;
        console.log('paymentUrl:::', paymentUrl);
        return {
            paymentUrl
        };
    }

    static getPayOsSubscriptionReturn = async (reqQuery: any) => {
        console.log('reqQueryPayos:::', reqQuery);
        let updateSubscription = null;
        if (reqQuery.code === '00') {
            //gia hạn subscription
            const paymentCode = reqQuery.orderCode;
            const payment = await paymentRepo.getPaymentByPaymentCode(paymentCode);
            if (!payment) {
                throw new BadRequestError('Payment not found');
            }
            const subscription = await subscriptionRepo.getSubscriptionByUserId(payment.userId.toString());
            if (!subscription) {
                throw new BadRequestError('Subscription not found');
            }
            const paymentHasExtend = subscription.history.find((history: any) => history.paymentId.toString() === payment._id.toString());
            if (paymentHasExtend) {
                return null;
            }
            updateSubscription = await SubscriptionService.extendSubscription(payment.userId.toString(), payment._id.toString());
            if (!updateSubscription) {
                throw new BadRequestError('Update subscription failed');
            }
        } else {
            //delete payment
            await paymentRepo.deletePayment(reqQuery.orderCode);
        }
        return {
            updateSubscription
        };
    }

    static getPayOsSubscriptionCancel = async (reqQuery: any) => {
        console.log('reqQueryPayosCancel:::', reqQuery);
        await paymentRepo.deletePayment(reqQuery.orderCode);
    }


    static checkoutPublishJob = async (userId: string, jobId: string) => {
        const paymentCode = generateOrderCode();
        const paymentData = {
            userId,
            amount: 5000,
            paymentCode,
            paymentDate: new Date()
        }
        const paymentNew = await paymentRepo.createPayment(paymentData);
        const cancelUrl = '/cancel-publish-job-payment';
        const returnUrl = '/return-publish-job-payment';
        await JobService.publistJobWhenPayment(jobId, userId, paymentNew._id.toString());
        const paymentLink = await createPaymentLink(paymentCode, paymentNew.amount, 'thanh toan dang tin', cancelUrl, returnUrl);
        const paymentUrl = paymentLink.checkoutUrl;
        return {
            paymentUrl
        };
    }

    static getPayOsPublishJobReturn = async (reqQuery: any) => {
        let jobUpdate = null;
        if (reqQuery.code === '00') {
            const paymentCode = reqQuery.orderCode;
            const payment = await paymentRepo.getPaymentByPaymentCode(paymentCode);
            if (!payment) {
                throw new BadRequestError('Payment not found');
            }
            jobUpdate = await jobRepo.getJob({ paymentId: payment._id.toString() });
        } else {
            //delete payment and update lại job
            const paymentCode = reqQuery.orderCode;
            const payment = await paymentRepo.getPaymentByPaymentCode(paymentCode);
            if (!payment) {
                throw new BadRequestError('Payment not found');
            }
            const job = await jobRepo.getJob({ paymentId: payment._id.toString() });
            if (!job) {
                throw new BadRequestError('Job not found');
            }
            const jobData = {
                status: 'draft',
                paymentId: null,
                isPay: false,
            }
            jobUpdate = await jobRepo.updateJob(job._id.toString(), jobData);
            await paymentRepo.deletePayment(reqQuery.orderCode);
        }
        return {
            jobUpdate
        };
    }

    static getPayOsPublishJobCancel = async (reqQuery: any) => {
        console.log('reqQueryPayosPublishJobCancel:::', reqQuery);
        const paymentCode = reqQuery.orderCode;
        const payment = await paymentRepo.getPaymentByPaymentCode(paymentCode);
        if (!payment) {
            throw new BadRequestError('Payment not found');
        }
        const job = await jobRepo.getJob({ paymentId: payment._id.toString() });
        if (!job) {
            throw new BadRequestError('Job not found');
        }
        const jobData = {
            status: 'draft',
            paymentId: null,
            isPay: false,
        }
        await jobRepo.updateJob(job._id.toString(), jobData);
        await paymentRepo.deletePayment(reqQuery.orderCode);
    }


    static checkoutCVBuilder = async (userId: string, cvId: string) => {
        const paymentCode = generateOrderCode();
        const paymentData = {
            userId,
            amount: 5000,
            paymentCode,
            paymentDate: new Date()
        }
        const items = [
            {
                name: 'CV builder',
                quantity: 1,
                price: 5000,
                cvId
            },
        ]
        const cancelUrl = '/cv-profile';
        const returnUrl = '/cv-profile';
        const paymentLink = await creatPaymentLinkFE(paymentCode, paymentData.amount, 'thanh toan CV builder', cancelUrl, returnUrl, items);
        const paymentUrl = paymentLink.checkoutUrl;
        return {
            paymentUrl,
            paymentCode
        };
    }

    static savePaymentCodeCVBuilder = async (userId: string, paymentCode: string,) => {
        const paymentData = {
            userId,
            amount: 5000,
            paymentCode,
            paymentDate: new Date()
        }
        const payment = await paymentRepo.createPayment(paymentData);
        return payment;
    }


}
export default CheckoutService;

