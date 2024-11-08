import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import apiClient from '../services/api/apiClient';
import { useJobHasApply } from '../hooks/useJobHasApply';


interface User {
    userId: string;
    username: string;
    email: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    login: (data: unknown) => Promise<any>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);


interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const checkToken = async () => {
        const accessToken = Cookies.get('authorization');
        if (accessToken) {
            const decodedUser = jwtDecode(accessToken) as User;
            if (decodedUser) {
                console.log('decodedUser', decodedUser);
                setUser(decodedUser);
            }
        }
    }
    useEffect(() => {
        checkToken();
    }, []);

    const login = async (data: unknown) => {
        try {
            const response = await apiClient.post('/user/login', data);
            const { apiKey, user, tokens } = response.data.metadata;

            Cookies.set('x-api-key', apiKey);
            Cookies.set('x-client-id', user._id);
            Cookies.set('authorization', tokens.accessToken);
            Cookies.set('x-refresh-token', tokens.refreshToken);

            const decodedUser = jwtDecode(tokens.accessToken) as User;
            console.log('decodedUser', decodedUser);
            setUser(decodedUser);

            return response.data;
        } catch (error: any) {
            console.error('Error login:', error);
            return error.response.data;
        }
    };

    const logout = async () => {
        const respone = await apiClient.post('/user/logout');
        console.log(respone);
        if (respone.status === 200) {
            Cookies.remove('x-api-key');
            Cookies.remove('x-client-id');
            Cookies.remove('authorization');
            Cookies.remove('x-refresh-token');
        }
        setUser(null);
    };

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
