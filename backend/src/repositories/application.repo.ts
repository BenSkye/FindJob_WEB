import { applicationModel } from "../models/application.model";


class ApplicationRepo {
    async createApplication(data: any) {
        return await applicationModel.create(data);
    }

    async getApplications(query: any) {
        return await applicationModel.find(query);
    }

    async getApplication(query: any) {
        return await applicationModel.findOne(query);
    }

    async getApplicationById(applicationId: string) {
        return await applicationModel.findById(applicationId);
    }

    async getApplicationsByJobId(jobId: string) {
        return await applicationModel.find({ jobId: jobId });
    }

}
export default new ApplicationRepo();