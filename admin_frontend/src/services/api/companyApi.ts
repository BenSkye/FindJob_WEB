import { Company } from "../types/company.types"
import apiClient from "./apiClient";

interface CompanyResponse {
    metadata: Company[];
    message: string;
    status: number;
}

export const adminGetListCompany = async (): Promise<Company[]> => {
    try {
        const response = await apiClient.get<CompanyResponse>("/company/get-list");
        return response.data.metadata;
    } catch (error: any) {
        console.error('Error get list company:', error);
        throw error;
    }
};
