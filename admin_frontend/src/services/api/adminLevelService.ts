import { Level } from "../types/level.types";
import apiClient from "./apiClient";

export const adminGetLevel = async (): Promise<Level[]> => {
    try {
        const response = await apiClient.get('/level/');
        return response.data;
    } catch (error: any) {
        console.error('Error get level:', error);
        throw error;
    }
};