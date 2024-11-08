import { User } from "../types/user.types";
import apiClient from "./apiClient";

interface UserResponse {
    metadata: User[];
    message: string;
    status: number;
}

export const adminGetUser = async (): Promise<User[]> => {
    try {
        const response = await apiClient.get<UserResponse>("/user/get-user");
        return response.data.metadata;
    } catch (error: any) {
        console.error('Error get users:', error);
        throw error;
    }
};

