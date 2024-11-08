import Login from "../../pages/login/Login";
import apiClient from "./apiClient";

interface GoogleSignUpData {
    credential: string;
}


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

export const login = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/user/login', {
            email, password
        });
        console.log('response:', response.data);
        return response.data;
    }
    catch (error: any) {
        console.error('Error login:', error);
        return error.response.data;
    }
}


export const signupEmployer = async (data: unknown) => {
    try {
        const response = await apiClient.post('/user/signup-employer', data);
        return response.data;
    } catch (error: any) {
        console.error('Error loginEmployer:', error);
        return error.response.data;
    }
}

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

export const googleSignUp = async (data: GoogleSignUpData) => {
    try {
        const response = await apiClient.post(`user/google-signup`, data);
        return response;
    } catch (error) {
        throw error;
    }
};
