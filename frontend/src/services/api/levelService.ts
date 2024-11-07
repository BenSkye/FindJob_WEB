import apiClient from "./apiClient";


const getListLevel = async () => {
    try {
        const response = await apiClient.get('/level/list');
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export { getListLevel };

