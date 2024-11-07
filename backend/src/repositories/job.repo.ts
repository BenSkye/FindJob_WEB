import { jobModel } from "../models/job.model";


class JobRepo {
    async createJob(data: any) {
        return await jobModel.create(data);
    }

    async getJobById(jobId: string) {
        return await jobModel.findById(jobId);
    }

    async updateJob(jobId: string, data: any) {
        return await jobModel.findByIdAndUpdate(jobId, data, { new: true });
    }

}

export default new JobRepo();