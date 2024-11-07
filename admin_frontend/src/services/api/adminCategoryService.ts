import { Category, SubCategory } from "../types/category.types";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BE_APP_API_URL;

export const adminGetCategory = async (): Promise<Category[]> => {
    const response = await axios.get(`${BASE_URL}/v1/api/category/list`);
    if (response.data && response.data.metadata) {
        return response.data.metadata;
    }
    return [];
};

interface CreateCategoryDto {
    name: string;
    subCategories: { name: string }[];
}

export const adminCreateCategory = async (categoryData: CreateCategoryDto): Promise<Category> => {
    const response = await axios.post(`${BASE_URL}/v1/api/category/create`, categoryData);
    if (response.data && response.data.metadata) {
        return response.data.metadata;
    }
    throw new Error('Failed to create category');
};

