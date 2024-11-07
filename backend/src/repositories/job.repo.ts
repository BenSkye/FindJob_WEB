import { jobModel } from "../models/job.model";


class JobRepo {
    async createJob(data: any) {
        return await jobModel.create(data);
    }

    async getListJob(query: any, select: string[] = []) {
        console.log('query', query)
        if (query.skip && query.limit) {
            const { skip, limit, ...searchQuery } = query;
            return await jobModel.find(searchQuery).populate('companyId').populate('mainCategory', 'name').populate('level', 'name').select(select.join(' ')).skip(skip).limit(limit).sort({ createdAt: -1 });
        }
        return await jobModel.find(query).populate('companyId').populate('mainCategory', 'name').populate('level').select(select.join(' ')).sort({ createdAt: -1 });
    }

    async getJob(query: any) {
        return await jobModel.findOne(query);
    }

    async getJobById(jobId: string) {
        return await jobModel.findById(jobId).populate('companyId').populate('mainCategory', 'name').populate('level', 'name');
    }

    async updateJob(jobId: string, data: any) {
        return await jobModel.findByIdAndUpdate(jobId, data, { new: true });
    }

}

export default new JobRepo();