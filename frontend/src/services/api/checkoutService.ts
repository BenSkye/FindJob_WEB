import apiClient from "./apiClient";


const checkoutPublishJob = async (jobId: string) => {
    try {
        const response = await apiClient.post(`/checkout/checkout-publish-job/${jobId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error creating order:', error);
        throw error;
    }
}

const checkoutSubscription = async () => {
    try {
        const response = await apiClient.post('/checkout/checkout-subscription');
        return response.data;
    } catch (error: any) {
        console.error('Error creating order:', error);
        throw error;
    }
}

const checkoutCVBuilder = async (cvId: string) => {
    try {
        const response = await apiClient.post(`/checkout/checkout-cv-builder/${cvId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error creating order:', error);
        throw error;
    }
}

const savePaymentCodeCVBuilder = async (paymentCode: string) => {
    try {
        const response = await apiClient.post(`/checkout/save-payment-code-cv-builder/${paymentCode}`);
        return response.data;
    } catch (error: any) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export { checkoutPublishJob, checkoutSubscription, checkoutCVBuilder, savePaymentCodeCVBuilder };
