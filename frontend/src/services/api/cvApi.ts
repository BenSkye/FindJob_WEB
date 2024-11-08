import axios from "axios";
import { ICV } from '../types/cv.types';

export const createCv = async (cvData: ICV) => {
    const response = await axios.post('http://localhost:2024/v1/api/cv/create', cvData);
    return response.data;
};

export const getCvById = async (cvId: string) => {
    const response = await axios.get(`http://localhost:2024/v1/api/cv/user/${cvId}`);
    return response.data;
};

export const updateCv = async (cvId: string, cvData: ICV) => {
    const response = await axios.put(`http://localhost:2024/v1/api/cv/${cvId}`, cvData);
    return response.data;
};

export const getCvByUserId = async (userId: string) => {
    const response = await axios.get(`http://localhost:2024/v1/api/cv/user/${userId}`);
    return response.data;
};
