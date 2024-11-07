import { Category, SubCategory } from "../types/category.types";
import axios from "axios";
import apiClient from "./apiClient";
const BASE_URL = import.meta.env.VITE_BE_APP_API_URL;

export const adminGetCategory = async (): Promise<Category[]> => {
    try {
        const response = await apiClient.get('/category/list');
        console.log('response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error get category:', error);
        return error.response.data;
        throw error;
    }

};

interface CreateCategoryDto {
    name: string;
    subCategories: { name: string }[];
}

export const adminCreateCategory = async (categoryData: CreateCategoryDto): Promise<Category> => {
    try {
        const response = await apiClient.post('/category/create', categoryData);
        console.log('response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error create category:', error);
        return error.response.data;
        throw error;
    }
};

