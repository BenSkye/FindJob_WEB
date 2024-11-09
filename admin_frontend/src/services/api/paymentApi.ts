import apiClient from "./apiClient";
import { PaymentStats } from '../types/stats.types';


export const adminGetPaymentStats = async (): Promise<PaymentStats> => {
    const response = await apiClient.get<PaymentStats>("/payment/get-payment-stats");
    return response.data;
};