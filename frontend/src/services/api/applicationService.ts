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

const getPersonalJobHasApplied = async () => {
    try {
        const response = await apiClient.get('/application/personal-job-has-applied');
        return response.data;
    } catch (error: any) {
        console.error('Error getPersonalJobHasApplied:', error);
        return error.response.data;
    }
}

export { sendApplication, getPersonalJobHasApplied };

