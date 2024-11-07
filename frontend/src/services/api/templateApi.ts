import axios from "axios";

export const getAllTemplates = async () => {
    const response = await axios.get('http://localhost:2024/v1/api/template/get-all');
    return response.data;
};

export const getTemplateById = async (templateId: string) => {
    const response = await axios.get(`http://localhost:2024/v1/api/template/${templateId}`);
    return response.data;
};

