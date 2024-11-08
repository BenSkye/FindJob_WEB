import apiClient from "./apiClient";

const getPersonalSubcriptions = async () => {
    try {
        const response = await apiClient.get('/subscription/personal');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching personal subcriptions:', error);
        return error.response.data;
    }
}


export {
    getPersonalSubcriptions
}
