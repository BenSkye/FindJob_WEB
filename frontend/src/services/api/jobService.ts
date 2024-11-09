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

const getPersonalJob = async () => {
    try {
        const response = await apiClient.get('/job/personal-job');
        return response.data;
    } catch (error: any) {
        console.error('Error getPersonalJob:', error);
        return error.response.data;
    }
}

const getCompanyJob = async () => {
    try {
        const response = await apiClient.get('/job/company-job');
        return response.data;
    } catch (error: any) {
        console.error('Error getCompanyJob:', error);
        return error.response.data;
    }
}

const updateJob = async (jobId: string, data: any) => {
    try {
        const response = await apiClient.put(`/job/update/${jobId}`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error updateJob:', error);
        return error.response.data;
    }
}

const publishJobWhenActiveSubscription = async (jobId: string) => {
    try {
        const response = await apiClient.put(`/job/publish-job-when-active-subscription/${jobId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error publishJob:', error);
        return error.response.data;
    }
}


const getJobApplications = async (jobId: string) => {
    try {
        const response = await apiClient.get(`/job/list-applications-by-job-id/${jobId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error getJobApplications:', error);
        return error.response.data;
    }
}

const getPersonalJobHasPay = async () => {
    try {
        const response = await apiClient.get('/job/personal-job-has-pay');
        console.log('response101', response);
        return response.data;
    } catch (error: any) {
        console.error('Error getPersonalJobHasPay:', error);
        return error.response.data;
    }
}


export {
    getListJobByCandidate, getJobById, getHotListJobByCandidate,
    createJob, getPersonalJob, getCompanyJob, updateJob, publishJobWhenActiveSubscription,
    getJobApplications, getPersonalJobHasPay
};
