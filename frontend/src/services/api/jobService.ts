import apiClient from "./apiClient";

const getListJobByCandidate = async (query: any) => {
    try {
        const response = await apiClient.get('/job/list-job-by-candidate', { params: query });
        console.log('response:', response);
        return response.data;
    } catch (error: any) {
        console.error('Error getListJobByCandidate:', error);
        return error.response.data;
    }
}

const getHotListJobByCandidate = async (query: any) => {
    try {
        const response = await apiClient.get('/job/list-job-by-candidate?isHot=true', { params: query });
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

const createJob = async (data: any) => {
    try {
        const response = await apiClient.post('/job/create', data);
        return response.data;
    } catch (error: any) {
        console.error('Error createJob:', error);
        return error.response.data;
    }
}

export { getListJobByCandidate, getJobById, getHotListJobByCandidate, createJob };
