import apiClient from "./apiClient";

const getListJobByCandidate = async () => {
    try {
        const response = await apiClient.get('/job/list-job-by-candidate');
        console.log('response:', response);
        return response.data;
    } catch (error: any) {
        console.error('Error getListJobByCandidate:', error);
        return error.response.data;
    }
}

const getJobById = async (jobId: string) => {
    try {
        const response = await apiClient.get(`/job/get-job-by-id/${jobId}`);
        console.log('response:', response);
        return response.data;
    } catch (error: any) {
        console.error('Error getJobById:', error);
        return error.response.data;
    }
}

export { getListJobByCandidate, getJobById };
