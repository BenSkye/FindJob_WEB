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

const getPersonalApplications = async () => {
    try {
        const response = await apiClient.get('/application/personal-applications');
        return response.data;
    } catch (error: any) {
        console.error('Error getPersonalApplications:', error);
        return error.response.data;
    }
}

const getEmployerApplications = async () => {
    try {
        const response = await apiClient.get('/application/employer-applications');
        return response.data.metadata;
    } catch (error: any) {
        console.error('Error getEmployerApplications:', error);
        return error.response.data;
    }
}

const updateApplicationStatus = async (applicationId: string, data: { status: string }) => {
    try {
        const response = await apiClient.patch(`/application/update-status/${applicationId}`, data);
        return response.data.metadata;
    } catch (error: any) {
        console.error('Error updateApplicationStatus:', error);
        return error.response.data;
    }
}

const getApplicationsByJobId = async (jobId: string) => {
    try {
        const response = await apiClient.get(`/application/job/${jobId}`);
        return response.data.metadata;
    } catch (error: any) {
        console.error('Error getApplicationsByJobId:', error);
        return error.response.data;
    }
}

const getApplicationByUserCompany = async () => {
    try {
        const response = await apiClient.get('/application/user-company-applications');
        return response.data;
    } catch (error: any) {
        console.error('Error getApplicationByUserCompany:', error);
        return error.response.data;
    }
}

export {
    sendApplication,
    getPersonalJobHasApplied,
    getPersonalApplications,
    getEmployerApplications,
    updateApplicationStatus,
    getApplicationsByJobId,
    getApplicationByUserCompany
};

