import axios from "axios";

export const getAllTemplates = async () => {
    const response = await axios.get('http://localhost:2024/v1/api/template/get-all');
    return response.data;
};

