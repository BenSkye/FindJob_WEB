import { User } from "../types/user.types";
import apiClient from "./apiClient";
import { Company } from '../../services/types/company.types';

interface UserResponse {
    metadata: User[];
    message: string;
    status: number;
}

interface CompanyResponse {
    metadata: Company[];
    message: string;
    status: number;
}

// Thêm interface mới để bao gồm thông tin company
interface UserWithCompany extends User {
  company?: Company;
}

export const adminGetUser = async (): Promise<UserWithCompany[]> => {
    try {
        const [usersResponse, companiesResponse] = await Promise.all([
            apiClient.get<UserResponse>("/user/get-user"),
            apiClient.get<CompanyResponse>("/company/get-list")
        ]);

        const users = usersResponse.data.metadata;
        const companies = companiesResponse.data.metadata;

        // Map users với company tương ứng
        const usersWithCompany = users.map(user => ({
            ...user,
            company: companies.find(company => company._id === user.companyId)
        }));

        return usersWithCompany;
    } catch (error: any) {
        console.error('Error get users:', error);
        throw error;
    }
};

export const adminGetUserStats = async (): Promise<any> => {
    try {
        const response = await apiClient.get<any>("/user-stats/get-user-stats");
        return response.data;
    } catch (error: any) {
        console.error('Error get user stats:', error);
        throw error;
    }
};

