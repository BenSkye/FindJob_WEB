import axios from "axios";
const API_URL = import.meta.env.VITE_BE_APP_API_URL


interface GoogleSignUpData {
    credential: string;
}
export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/v1/api/user/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
};

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    address?: string;
}

export const register = async (data: RegisterPayload) => {
    try {
        const response = await axios.post(`${API_URL}/v1/api/user/register`, data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response;
        }
        throw error;
    }
};
export const googleSignUp = async (data: GoogleSignUpData) => {
    try {
        const response = await axios.post(`${API_URL}/v1/api/user/google-signup`, data);
        return response;
    } catch (error) {
        throw error;
    }
};


