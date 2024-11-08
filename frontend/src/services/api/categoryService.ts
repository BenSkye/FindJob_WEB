import apiClient from "./apiClient";


const getListCategory = async () => {
    try {
        const response = await apiClient.get('/category/list');
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export { getListCategory };
