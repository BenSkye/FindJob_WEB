import { ICV } from '../types/cv.types';
import apiClient from "./apiClient";

export const createCv = async (cvData: ICV) => {
    const response = await apiClient.post('/cv/create', cvData);
    return response.data;
};

export const getCvById = async (cvId: string) => {
    const response = await apiClient.get(`/cv/user/${cvId}`);
    return response.data;
};

export const updateCv = async (cvId: string, cvData: ICV) => {
    const response = await apiClient.put(`/cv/${cvId}`, cvData);
    return response.data;
};

export const getCvByUserId = async (userId: string) => {
    const response = await apiClient.get(`/cv/user/${userId}`);
    return response.data;
};
