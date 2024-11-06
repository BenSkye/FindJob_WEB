import crypto from 'crypto';
import querystring from 'qs';
import { format } from 'date-fns';
import config from '../configs/vnpay';

interface VnpayConfig {
    tmnCode: string;
    hashSecret: string;
    url: string;
    returnUrl: string;
    orderType: string;
}

interface PaymentInfo {
    amount: number;
    orderId: string;  // Thêm orderId vào đây
    bankCode?: string;
    orderDescription: string;
    language: string;
    ipAddr: string;
    returnUrl: string;
}

class VnpayService {
    private config: VnpayConfig;

    constructor() {
        this.config = {
            tmnCode: config.vnpay.vnp_TmnCode,
            hashSecret: config.vnpay.vnp_HashSecret,
            url: config.vnpay.vnp_Url,
            returnUrl: config.vnpay.vnp_ReturnUrl,
            orderType: config.vnpay.vnp_OrderType
        };
    }

    createPaymentUrl(paymentInfo: PaymentInfo): string {
        const date = new Date();
        const createDate = format(date, 'yyyyMMddHHmmss');

        const vnpParams: Record<string, string | number> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.config.tmnCode,
            vnp_Locale: paymentInfo.language || 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: paymentInfo.orderId,  // Sử dụng orderId từ paymentInfo
            vnp_OrderInfo: paymentInfo.orderDescription,
            vnp_OrderType: this.config.orderType,
            vnp_Amount: paymentInfo.amount * 100,
            vnp_ReturnUrl: this.config.returnUrl + paymentInfo.returnUrl,
            vnp_IpAddr: paymentInfo.ipAddr,
            vnp_CreateDate: createDate
        };

        if (paymentInfo.bankCode) {
            vnpParams.vnp_BankCode = paymentInfo.bankCode;
        }

        const sortedParams = this.sortObject(vnpParams);
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', this.config.hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        sortedParams.vnp_SecureHash = signed;

        const paymentUrl = `${this.config.url}?${querystring.stringify(sortedParams, { encode: false })}`;
        console.log('paymentUrl', paymentUrl);
        return paymentUrl;
    }

    private sortObject(obj: any) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        const sortedObj: Record<string, string> = {};
        for (const key of str) {
            if (typeof obj[key] !== 'undefined') {
                sortedObj[key] = encodeURIComponent(String(obj[key])).replace(/%20/g, "+");
            }
        }
        return sortedObj;
    }
}

export default VnpayService;