import { BadRequestError } from "../core/error.response";
import cartRepo from "../repositories/cart.repo"
import orderRepo from "../repositories/order.repo";
import productRepo from "../repositories/product.repo";
import { acquireLock, releaseLock } from "./redis.service";
import orderProductRepo from "../repositories/oder_product.repo";
import VnpayService from "./vnpay.service";
import inventoryRepo from "../repositories/inventory.repo";
import { generateOrderCode } from "../utils";
import { createPaymentLink } from "./payOs.service";
class CheckoutService {
    static checkoutReview = async (userId: String, product_list: any) => {
        const cart = await cartRepo.findCart({ user_id: userId });
        if (!cart) {
            throw new BadRequestError('Cart not found');
        }
        const checkout_oder = {
            total_price: 0,
        }

        // calculate total price
        for (const product of product_list) {
            const product_detail = await productRepo.getProductById(product.product_id, ['price']);
            if (!product_detail) {
                throw new BadRequestError('Product not found');
            }
            checkout_oder.total_price += product_detail.price * product.quantity;
        }
        return {
            product_list,
            checkout_oder
        };
    }

    static oderByUser = async (userId: string, product_list: Object, user_address: Object, payment_method: string, req: any) => {
        const checkout_info = await this.checkoutReview(userId, product_list);

        //check if it has enough stock
        console.log("[1]::", checkout_info.product_list);
        const acquireProduct = [];
        for (const product of checkout_info.product_list) {
            const { product_id, quantity } = product;
            const keyLock = await acquireLock(product_id, quantity);
            acquireProduct.push(keyLock ? true : false);
            console.log('keyLock:::', keyLock);
            if (keyLock) {
                await releaseLock(keyLock);
            }
        }

        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Product stock is not enough');
        }

        //create oder
        const order_products = [];
        for (const product of checkout_info.product_list) {
            const { product_id, quantity } = product;
            const product_detail = await productRepo.getProductById(product_id, ['_id', 'price', 'bakery']);
            if (!product_detail) {
                throw new BadRequestError('Product not found');
            }
            const newOrderProduct = await orderProductRepo.createOderProduct(
                userId, product_id, product_detail.bakery, quantity, product_detail.price * quantity, user_address, payment_method
            );

            order_products.push(newOrderProduct._id);
        }
        //lấy ngày giờ phút hiện tại đển chuyển thành ordercode có type là number
        const order_code = generateOrderCode();
        const newOder = await orderRepo.createOder(userId, order_products, checkout_info.checkout_oder, user_address, payment_method, order_code);
        let paymentUrl = '';
        if (payment_method === 'vnpay') {
            const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
            console.log('ipAddr:::', ipAddr);
            const paymentInfo = {
                orderId: newOder._id.toString(),
                amount: checkout_info.checkout_oder.total_price,
                orderDescription: 'thanh toan don hang ' + newOder._id.toString(),
                language: 'vn',
                ipAddr: ipAddr,
                returnUrl: '/return-product-payment'
            }
            const vnpayService = new VnpayService();
            paymentUrl = await vnpayService.createPaymentUrl(paymentInfo);
            console.log('paymentUrl:::', paymentUrl);
        }
        if (payment_method === 'payos') {
            const cancelUrl = '/cancel-product-payment';
            const returnUrl = '/return-product-payment';
            const paymentLink = await createPaymentLink(order_code, checkout_info.checkout_oder.total_price, 'thanh toan don hang', cancelUrl, returnUrl);
            console.log('paymentLink:::', paymentLink);
            paymentUrl = paymentLink.checkoutUrl;
            console.log('paymentUrl:::', paymentUrl);
        }

        return {
            paymentUrl,
            newOder
        };
    }

    static oderByUserCakeDesign = async (userId: string, bakeryId: string, quantity: number, price: number, address: Object, customCake: any) => {
        const newOderProduct = await orderProductRepo.createOrderCakeDesign(userId, bakeryId, quantity, price, address, customCake, generateOrderCode());
        const newOder = await orderRepo.createOder(userId, [newOderProduct._id], { total_price: price * quantity }, address, '', generateOrderCode());
        return newOderProduct;
    }

    static checkOutCakeDesign = async (userId: string, orderProductId: string, req: any) => {
        const orderProduct = await orderProductRepo.getOrderProductById(orderProductId);
        if (!orderProduct || !orderProduct.isCustomCake || orderProduct.status !== 'confirmed') {
            throw new BadRequestError('Order product not found');
        }

        // const ipAddr = req.headers['x-forwarded-for'] ||
        //     req.connection.remoteAddress ||
        //     req.socket.remoteAddress ||
        //     req.connection.socket.remoteAddress;
        // console.log('ipAddr:::', ipAddr);
        // const paymentInfo = {
        //     orderId: orderProduct._id.toString(),
        //     amount: orderProduct.price,
        //     orderDescription: 'thanh toan thiet ke banh ' + orderProduct._id.toString(),
        //     language: 'vn',
        //     ipAddr: ipAddr,
        //     returnUrl: '/return-cake-design-payment'
        // }
        const orderCode = generateOrderCode();
        const updateOrderProduct = await orderProductRepo.updateOderProduct(orderProduct._id.toString(), { order_code: orderCode })
        const cancelUrl = '/cancel-cake-design-payment';
        const returnUrl = '/return-cake-design-payment';
        const paymentLink = await createPaymentLink(updateOrderProduct.order_code ?? 0, orderProduct.price ?? 0, 'thanh toan thiet ke banh ', cancelUrl, returnUrl);
        const paymentUrl = paymentLink.checkoutUrl
        return {
            paymentUrl,
            orderProduct
        };
    }

    static getVnpayCakeDesignReturn = async (reqQuery: any) => {
        console.log('reqQuery:::', reqQuery);
        const order_products = [];
        if (reqQuery.vnp_ResponseCode === '00') {
            const orderProduct = await orderProductRepo.getOrderProductById(reqQuery.vnp_TxnRef);
            if (orderProduct) {
                const updateOderProduct = await orderProductRepo.updateOderProduct(orderProduct._id.toString(), { status: 'success' });
                order_products.push(updateOderProduct);
            }
        } else {
            throw new BadRequestError('Payment failed');
        }
        return {
            order_products
        }
    }

    static getVnpayReturn = async (reqQuery: any) => {
        console.log('reqQuery:::', reqQuery);
        const order_products = [];
        if (reqQuery.vnp_ResponseCode === '00') {
            //update order status and remove prouduct in cart
            const order = await orderRepo.getOderById(reqQuery.vnp_TxnRef);
            console.log(order)
            if (order) {
                for (const orderProductID of order.order_products) {
                    const orderProduct = await orderProductRepo.getOrderProductById(orderProductID.toString());
                    if (orderProduct) {
                        const updateOderProduct = await orderProductRepo.updateOderProduct(orderProduct._id.toString(), { status: 'success' });
                        order_products.push(updateOderProduct);
                        //payment success, remove product in cart
                        if (!orderProduct.isCustomCake && orderProduct.product_id) {
                            await cartRepo.removeProductFromCart(order.user_id.toString(), orderProduct.product_id._id.toString());
                        }
                    }
                }
            }
            else {
                throw new BadRequestError('Order not found');
            }
        }
        else {
            //delete order,product order and update stock
            const order = await orderRepo.getOderById(reqQuery.vnp_TxnRef);
            if (order) {
                for (const orderProductID of order.order_products) {
                    const orderProduct = await orderProductRepo.getOrderProductById(orderProductID.toString());
                    if (orderProduct) {
                        const quantity = orderProduct.quantity;
                        if (!orderProduct.isCustomCake && orderProduct.product_id) {
                            const updateInventory = await inventoryRepo.updateInventory(orderProduct.product_id._id.toString(), quantity);
                            console.log("updateInventory", updateInventory)
                        }
                        await orderProductRepo.deleteOderProduct(orderProduct._id.toString());
                    }
                }
                await orderRepo.deleteOder(order._id.toString());
            }
            throw new BadRequestError('Payment failed');
        }
        return {
            order_products
        }
    }

    static getPayOsReturn = async (reqQuery: any) => {
        console.log('reqQueryPayos:::', reqQuery);
        const order_products = [];
        if (reqQuery.code === '00') {
            //update order status and remove prouduct in cart
            const order = await orderRepo.getOneOrder({ order_code: reqQuery.orderCode });
            console.log(order)
            if (order) {
                for (const orderProductID of order.order_products) {
                    const orderProduct = await orderProductRepo.getOrderProductById(orderProductID.toString());
                    if (orderProduct) {
                        const updateOderProduct = await orderProductRepo.updateOderProduct(orderProduct._id.toString(), { status: 'success' });
                        order_products.push(updateOderProduct);
                        //payment success, remove product in cart
                        if (!orderProduct.isCustomCake && orderProduct.product_id) {
                            await cartRepo.removeProductFromCart(order.user_id.toString(), orderProduct.product_id._id.toString());
                        }
                    }
                }
            }
            else {
                throw new BadRequestError('Order not found');
            }
        }
        else {
            //delete order,product order and update stock
            const order = await orderRepo.getOneOrder({ order_code: reqQuery.orderCode });
            if (order) {
                for (const orderProductID of order.order_products) {
                    const orderProduct = await orderProductRepo.getOrderProductById(orderProductID.toString());
                    if (orderProduct) {
                        const quantity = orderProduct.quantity;
                        if (!orderProduct.isCustomCake && orderProduct.product_id) {
                            const updateInventory = await inventoryRepo.updateInventory(orderProduct.product_id._id.toString(), quantity);
                            console.log("updateInventory", updateInventory)
                        }
                        await orderProductRepo.deleteOderProduct(orderProduct._id.toString());
                    }
                }
                await orderRepo.deleteOder(order._id.toString());
            }
            throw new BadRequestError('Payment failed');
        }
        return {
            order_products
        }
    }

    static getPayOsCancel = async (reqQuery: any) => {
        console.log('reqQueryPayosCancel:::', reqQuery);
        const order = await orderRepo.getOneOrder({ order_code: reqQuery.orderCode });
        if (order) {
            for (const orderProductID of order.order_products) {
                const orderProduct = await orderProductRepo.getOrderProductById(orderProductID.toString());
                if (orderProduct) {
                    const quantity = orderProduct.quantity;
                    if (!orderProduct.isCustomCake && orderProduct.product_id) {
                        const updateInventory = await inventoryRepo.updateInventory(orderProduct.product_id._id.toString(), quantity);
                        console.log("updateInventory", updateInventory)
                    }
                    await orderProductRepo.deleteOderProduct(orderProduct._id.toString());
                }
            }
            await orderRepo.deleteOder(order._id.toString());
        }
    }

    static getPayOsCakeDesignReturn = async (reqQuery: any) => {
        const order_products: any[] = [];
        if (reqQuery.code === '00') {
            const orderProduct = await orderProductRepo.getOneOrderProduct({ order_code: reqQuery.orderCode });
            if (orderProduct) {
                const updateOderProduct = await orderProductRepo.updateOderProduct(orderProduct._id.toString(), { status: 'success' });
                order_products.push(updateOderProduct);
            }
        } else {
            throw new BadRequestError('Payment failed');
        }
        return {
            order_products
        }
    }

    static getPayOsCakeDesignCancel = async (reqQuery: any) => {
        const orderProduct = await orderProductRepo.getOneOrderProduct({ order_code: reqQuery.orderCode });
        return orderProduct;
    }
}
export default CheckoutService;

