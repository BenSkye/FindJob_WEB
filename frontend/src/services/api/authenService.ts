import { message } from 'antd';
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


export const signupEmployer = async (data: any) => {
    try {
        // Đảm bảo data gửi đi đúng format như Postman
        const registerData = {
            email: data.email,
            name: data.name,
            password: data.password,
            address: data.address,
            companyName: data.companyName,
            phone: data.phone
        };

        // Sử dụng apiClient thay vì axiosInstance (nếu có)
        const response = await apiClient.post('/user/signup-employer', registerData);

        // Trả về response.data thay vì toàn bộ response
        return response.data;
    } catch (error: any) {
        console.log('error:', error.response);
        return error.response;
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

export const googleSignUp = async (data: GoogleSignUpData) => {
    try {
        const response = await apiClient.post(`user/google-signup`, data);
        return response;
    } catch (error: any) {
        message.error(error.message);
        throw error;
    }
};


export const getUserById = async () => {
    try {
        const response = await apiClient.get(`/user-stats/get-user-by-id`);
        return response.data;
    } catch (error: any) {
        console.error('Error getUserById:', error);
        return error.response.data;
    }
}

export const updateUserById = async (data: any) => {
    try {
        const response = await apiClient.put(`/user-stats/update-user-by-id`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error updateUserById:', error);
        return error.response.data;
    }
}

