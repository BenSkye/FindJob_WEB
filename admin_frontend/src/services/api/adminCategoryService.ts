import { Category, SubCategory } from "../types/category.types";
import apiClient from "./apiClient";

export const adminGetCategory = async (): Promise<Category[]> => {
    try {
        const response = await apiClient.get('/category/list');
        return response.data;
    } catch (error: any) {
        console.error('Error get category:', error);
        throw error;
    }
};

interface CreateCategoryDto {
    name: string;
    subCategories: { name: string }[];
}

export const adminCreateCategory = async (categoryData: CreateCategoryDto): Promise<any> => {
    try {
        const response = await apiClient.post('/category/create', categoryData);
        return response.data;
    } catch (error: any) {
        console.error('Error create category:', error);
        throw error;
    }
};

export const addSubCategory = async (categoryId: string, subCategory: SubCategory): Promise<any> => {
    try {
        const response = await apiClient.put(`/category/add-sub-category/${categoryId}`, subCategory);
        return response.data;
    } catch (error: any) {
        console.error('Error add sub category:', error);
        throw error;
    }
};
