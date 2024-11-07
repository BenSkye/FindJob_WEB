import { BadRequestError } from "../core/error.response";
import VnpayService from "./vnpay.service";
import { generateOrderCode } from "../utils";
import { createPaymentLink } from "./payOs.service";
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

    // static oderByUser = async (userId: string, product_list: Object, user_address: Object, payment_method: string, req: any) => {
    //     const checkout_info = await this.checkoutReview(userId, product_list);

    //     //check if it has enough stock
    //     console.log("[1]::", checkout_info.product_list);
    //     const acquireProduct = [];
    //     for (const product of checkout_info.product_list) {
    //         const { product_id, quantity } = product;
    //         const keyLock = await acquireLock(product_id, quantity);
    //         acquireProduct.push(keyLock ? true : false);
    //         console.log('keyLock:::', keyLock);
    //         if (keyLock) {
    //             await releaseLock(keyLock);
    //         }
    //     }

    //     if (acquireProduct.includes(false)) {
    //         throw new BadRequestError('Product stock is not enough');
    //     }

    //     //create oder
    //     const order_products = [];
    //     for (const product of checkout_info.product_list) {
    //         const { product_id, quantity } = product;
    //         const product_detail = await productRepo.getProductById(product_id, ['_id', 'price', 'bakery']);
    //         if (!product_detail) {
    //             throw new BadRequestError('Product not found');
    //         }
    //         const newOrderProduct = await orderProductRepo.createOderProduct(
    //             userId, product_id, product_detail.bakery, quantity, product_detail.price * quantity, user_address, payment_method
    //         );

    //         order_products.push(newOrderProduct._id);
    //     }
    //     //lấy ngày giờ phút hiện tại đển chuyển thành ordercode có type là number
    //     const order_code = generateOrderCode();
    //     const newOder = await orderRepo.createOder(userId, order_products, checkout_info.checkout_oder, user_address, payment_method, order_code);
    //     let paymentUrl = '';
    //     if (payment_method === 'vnpay') {
    //         const ipAddr = req.headers['x-forwarded-for'] ||
    //             req.connection.remoteAddress ||
    //             req.socket.remoteAddress ||
    //             req.connection.socket.remoteAddress;
    //         console.log('ipAddr:::', ipAddr);
    //         const paymentInfo = {
    //             orderId: newOder._id.toString(),
    //             amount: checkout_info.checkout_oder.total_price,
    //             orderDescription: 'thanh toan don hang ' + newOder._id.toString(),
    //             language: 'vn',
    //             ipAddr: ipAddr,
    //             returnUrl: '/return-product-payment'
    //         }
    //         const vnpayService = new VnpayService();
    //         paymentUrl = await vnpayService.createPaymentUrl(paymentInfo);
    //         console.log('paymentUrl:::', paymentUrl);
    //     }
    //     if (payment_method === 'payos') {
    //         const cancelUrl = '/cancel-product-payment';
    //         const returnUrl = '/return-product-payment';
    //         const paymentLink = await createPaymentLink(order_code, checkout_info.checkout_oder.total_price, 'thanh toan don hang', cancelUrl, returnUrl);
    //         console.log('paymentLink:::', paymentLink);
    //         paymentUrl = paymentLink.checkoutUrl;
    //         console.log('paymentUrl:::', paymentUrl);
    //     }

    //     return {
    //         paymentUrl,
    //         newOder
    //     };
    // }

    // static checkOutCakeDesign = async (userId: string, orderProductId: string, req: any) => {
    //     const orderProduct = await orderProductRepo.getOrderProductById(orderProductId);
    //     if (!orderProduct || !orderProduct.isCustomCake || orderProduct.status !== 'confirmed') {
    //         throw new BadRequestError('Order product not found');
    //     }

    //     // const ipAddr = req.headers['x-forwarded-for'] ||
    //     //     req.connection.remoteAddress ||
    //     //     req.socket.remoteAddress ||
    //     //     req.connection.socket.remoteAddress;
    //     // console.log('ipAddr:::', ipAddr);
    //     // const paymentInfo = {
    //     //     orderId: orderProduct._id.toString(),
    //     //     amount: orderProduct.price,
    //     //     orderDescription: 'thanh toan thiet ke banh ' + orderProduct._id.toString(),
    //     //     language: 'vn',
    //     //     ipAddr: ipAddr,
    //     //     returnUrl: '/return-cake-design-payment'
    //     // }
    //     const orderCode = generateOrderCode();
    //     const updateOrderProduct = await orderProductRepo.updateOderProduct(orderProduct._id.toString(), { order_code: orderCode })
    //     const cancelUrl = '/cancel-cake-design-payment';
    //     const returnUrl = '/return-cake-design-payment';
    //     const paymentLink = await createPaymentLink(updateOrderProduct.order_code ?? 0, orderProduct.price ?? 0, 'thanh toan thiet ke banh ', cancelUrl, returnUrl);
    //     const paymentUrl = paymentLink.checkoutUrl
    //     return {
    //         paymentUrl,
    //         orderProduct
    //     };
    // }

    // static getPayOsReturn = async (reqQuery: any) => {
    //     console.log('reqQueryPayos:::', reqQuery);
    //     const order_products = [];
    //     if (reqQuery.code === '00') {
    //         //update order status and remove prouduct in cart
    //         const order = await orderRepo.getOneOrder({ order_code: reqQuery.orderCode });
    //         console.log(order)
    //         if (order) {
    //             for (const orderProductID of order.order_products) {
    //                 const orderProduct = await orderProductRepo.getOrderProductById(orderProductID.toString());
    //                 if (orderProduct) {
    //                     const updateOderProduct = await orderProductRepo.updateOderProduct(orderProduct._id.toString(), { status: 'success' });
    //                     order_products.push(updateOderProduct);
    //                     //payment success, remove product in cart
    //                     if (!orderProduct.isCustomCake && orderProduct.product_id) {
    //                         await cartRepo.removeProductFromCart(order.user_id.toString(), orderProduct.product_id._id.toString());
    //                     }
    //                 }
    //             }
    //         }
    //         else {
    //             throw new BadRequestError('Order not found');
    //         }
    //     }
    //     else {
    //         //delete order,product order and update stock
    //         const order = await orderRepo.getOneOrder({ order_code: reqQuery.orderCode });
    //         if (order) {
    //             for (const orderProductID of order.order_products) {
    //                 const orderProduct = await orderProductRepo.getOrderProductById(orderProductID.toString());
    //                 if (orderProduct) {
    //                     const quantity = orderProduct.quantity;
    //                     if (!orderProduct.isCustomCake && orderProduct.product_id) {
    //                         const updateInventory = await inventoryRepo.updateInventory(orderProduct.product_id._id.toString(), quantity);
    //                         console.log("updateInventory", updateInventory)
    //                     }
    //                     await orderProductRepo.deleteOderProduct(orderProduct._id.toString());
    //                 }
    //             }
    //             await orderRepo.deleteOder(order._id.toString());
    //         }
    //         throw new BadRequestError('Payment failed');
    //     }
    //     return {
    //         order_products
    //     }
    // }

    // static getPayOsCancel = async (reqQuery: any) => {
    //     console.log('reqQueryPayosCancel:::', reqQuery);
    //     const order = await orderRepo.getOneOrder({ order_code: reqQuery.orderCode });
    //     if (order) {
    //         for (const orderProductID of order.order_products) {
    //             const orderProduct = await orderProductRepo.getOrderProductById(orderProductID.toString());
    //             if (orderProduct) {
    //                 const quantity = orderProduct.quantity;
    //                 if (!orderProduct.isCustomCake && orderProduct.product_id) {
    //                     const updateInventory = await inventoryRepo.updateInventory(orderProduct.product_id._id.toString(), quantity);
    //                     console.log("updateInventory", updateInventory)
    //                 }
    //                 await orderProductRepo.deleteOderProduct(orderProduct._id.toString());
    //             }
    //         }
    //         await orderRepo.deleteOder(order._id.toString());
    //     }
    // }

}
export default CheckoutService;

