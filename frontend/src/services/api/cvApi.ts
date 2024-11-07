import axios from "axios";
import { ICv } from '../types/cv.types';

export const createCv = async (cvData: ICv) => {
    const response = await axios.post('http://localhost:2024/v1/api/cv/create', cvData);
    return response.data;
};

export const getCvById = async (cvId: string) => {
    const response = await axios.get(`http://localhost:2024/v1/api/cv/user/${cvId}`);
    return response.data;
};

export const updateCv = async (cvId: string, cvData: ICv) => {
    const response = await axios.put(`http://localhost:2024/v1/api/cv/${cvId}`, cvData);
    return response.data;
};
