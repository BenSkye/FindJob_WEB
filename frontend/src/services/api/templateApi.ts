import apiClient from "./apiClient";

export const getAllTemplates = async () => {
    const response = await apiClient.get('/template/get-all');
    return response.data;
};

export const getTemplateById = async (templateId: string) => {
    const response = await apiClient.get(`/template/${templateId}`);
    return response.data;
};

