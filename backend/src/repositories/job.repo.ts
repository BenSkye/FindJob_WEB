import { jobModel } from "../models/job.model";


class JobRepo {
    async createJob(data: any) {
        return await jobModel.create(data);
    }

    async getListJob(query: any, select: string[] = []) {
        console.log('query', query)
        if (query.skip && query.limit) {
            const { skip, limit, ...searchQuery } = query;
            return await jobModel.find(searchQuery)
                .populate('companyId')
                .populate('mainCategory', 'name')
                .populate('level', 'name')
                .select(select.join(' '))
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
        }
        return await jobModel.find(query)
            .populate('companyId')
            .populate('mainCategory', 'name')
            .populate('level')
            .select(select.join(' '))
            .sort({ createdAt: -1 });
    }

    async getListJobByCandidate(query: any, select: string[] = []) {
        console.log('query', query);
        const { skip, limit, title, level, jobType, location, mainCategory, subCategory, ...otherQuery } = query;

        // Build the search query
        const searchQuery: any = { ...otherQuery };

        if (title) {
            searchQuery.title = { $regex: title, $options: 'i' }; // Case-insensitive regex for similar strings
        }

        if (location) {
            searchQuery.location = { $regex: location, $options: 'i' }; // Case-insensitive regex for similar strings
        }

        //nếu level và jobType là mảng
        if (level) {
            searchQuery.level = { $in: level };
        }

        if (jobType) {
            searchQuery.jobType = { $in: jobType };
        }

        if (mainCategory) {
            searchQuery.mainCategory = mainCategory;
        }

        if (subCategory) {
            searchQuery.subCategory = subCategory;
        }

        const totalCount = await jobModel.countDocuments(searchQuery);

        const queryBuilder = jobModel.find(searchQuery)
            .populate('companyId')
            .populate('mainCategory', 'name')
            .populate('level', 'name')
            .select(select.join(' '))
            .sort({ createdAt: -1 }).lean();

        if (skip !== undefined && limit !== undefined) {
            queryBuilder.skip(skip).limit(limit);
        }
        const results = await queryBuilder;
        return { results, totalCount };
    }

    async getJob(query: any) {
        return await jobModel.findOne(query);
    }

    async getJobs(query: any) {
        return await jobModel.find(query);
    }

    async getJobsHasPay(userId: string) {
        return await jobModel.find({ employerId: userId, isPay: true }).populate('paymentId');
    }

    async getPersonalJob(userId: string) {
        return await jobModel.find({ employerId: userId });
    }

    async getCompanyJob(companyId: string) {
        return await jobModel.find({ companyId });
    }

    async getJobById(jobId: string) {
        return await jobModel.findById(jobId).populate('companyId').populate('mainCategory', 'name').populate('level', 'name');
    }

    async updateJob(jobId: string, data: any) {
        return await jobModel.findByIdAndUpdate(jobId, data, { new: true });
    }

}

export default new JobRepo();