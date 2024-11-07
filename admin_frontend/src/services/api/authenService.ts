import apiClient from "./apiClient";

export const signup = async (data: unknown) => {
    try {
        const response = await apiClient.post('/user/signup', data);
        console.log('response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error signup:', error);
        return error.response.data;
        throw error;
    }
};


export const forgotPassword = async (data: any) => {
    try {
        const response = await apiClient.post('/user/forgot-password', data);
        console.log('response forgotpassword:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error forgotPassword:', error);
        return { status: error.response?.status, message: error.response?.data.message };
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await apiClient.post(`/user/reset-password/${token}`, { newPassword });
        console.log('response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error resetPassword:', error);
        // Ensure that we only return error.response.data if it exists
        return error.response ? error.response.data : { message: 'An error occurred' };
    }
};

export const verifyEmail = async (token: string) => {
    try {

        const response = await apiClient.get(`/user/verify-email?token=${token}`);
        console.log('response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error signup:', error);
        return error.response;
    }
};

