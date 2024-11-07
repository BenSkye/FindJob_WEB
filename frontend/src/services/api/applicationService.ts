import apiClient from "./apiClient";

const sendApplication = async (jobId: string, data: unknown) => {
    try {
        const response = await apiClient.post(`/application/send-application/${jobId}`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error sendApplication:', error);
        return error.response.data;
    }
}

export { sendApplication };

