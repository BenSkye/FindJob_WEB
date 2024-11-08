import axios from 'axios';

export const checkPaymentStatus = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/payment/status`);
    return response.data;
};