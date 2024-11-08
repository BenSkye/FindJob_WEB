import apiClient from './apiClient';
import { Company, CompanyUpdateDto } from '../types/company.types';

export const companyApi = {
    getPersonalCompany: async (): Promise<Company> => {
        const response = await apiClient.get('/company/personal-company');
        return response.data.metadata;
    },

    getCompanyById: async (id: string): Promise<Company> => {
        const response = await apiClient.get(`/company/get-by-id/${id}`);
        return response.data.metadata;
    },

    updateCompany: async (id: string, data: CompanyUpdateDto): Promise<Company> => {
        const response = await apiClient.put(`/company/update/${id}`, data);
        return response.data.metadata;
    },

    uploadLogo: async (id: string, file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('logo', file);

        const response = await apiClient.post(`/company/upload-logo/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.metadata.logo;
    }
};
