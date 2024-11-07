import { jobModel } from "../models/job.model";


class JobRepo {
    async createJob(data: any) {
        return await jobModel.create(data);
    }

    async getListJob(query: any, select: string[] = []) {
        console.log('query', query)
        if (query.skip && query.limit) {
            const { skip, limit, ...searchQuery } = query;
            return await jobModel.find(searchQuery).populate('companyId').select(select.join(' ')).skip(skip).limit(limit).sort({ createdAt: -1 });
        }
        return await jobModel.find(query).populate('companyId').select(select.join(' ')).sort({ createdAt: -1 });
    }

    async getJob(query: any) {
        return await jobModel.findOne(query);
    }

    async getJobById(jobId: string) {
        return await jobModel.findById(jobId);
    }

    async updateJob(jobId: string, data: any) {
        return await jobModel.findByIdAndUpdate(jobId, data, { new: true });
    }

}

export default new JobRepo();