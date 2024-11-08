import { Level } from "../types/level.types";
import apiClient from "./apiClient";

interface LevelResponse {
    metadata: Level[];
    message: string;
    status: number;
}

export const adminGetLevel = async (): Promise<LevelResponse> => {
    try {
        const response = await apiClient.get('/level/list');
        return response.data;
    } catch (error: any) {
        console.error('Error get level:', error);
        throw error;
    }
};

export const adminCreateLevel = async (level: Level): Promise<LevelResponse> => {
    try {
        const response = await apiClient.post('/level/create', level);
        return response.data;
    } catch (error: any) {
        console.error('Error create level:', error);
        throw error;
    }
};

export const adminDeleteLevel = async (level: Level): Promise<LevelResponse> => {
    try {
        const response = await apiClient.delete(`/level/delete/${level._id}`);
        return response.data;
    } catch (error: any) {
        console.error('Error delete level:', error);
        throw error;
    }
};

export const adminUpdateLevel = async (level: Level): Promise<LevelResponse> => {
    try {
        const response = await apiClient.put(`/level/update/${level._id}`, level);
        return response.data;
    } catch (error: any) {
        console.error('Error update level:', error);
        throw error;
    }
};

