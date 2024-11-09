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

      async getJobStats() {
        const [jobStats, avgApplications, topCategories] = await Promise.all([
            // Thống kê số lượng job theo ngày/tháng/năm
            jobModel.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            day: { $dayOfMonth: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: "$_id.year",
                            month: "$_id.month"
                        },
                        dailyStats: {
                            $push: {
                                day: "$_id.day",
                                count: "$count"
                            }
                        },
                        monthlyTotal: { $sum: "$count" }
                    }
                },
                {
                    $group: {
                        _id: "$_id.year",
                        monthlyStats: {
                            $push: {
                                month: "$_id.month",
                                dailyStats: "$dailyStats",
                                total: "$monthlyTotal"
                            }
                        },
                        yearlyTotal: { $sum: "$monthlyTotal" }
                    }
                },
                { $sort: { "_id": -1 } }
            ]),

            // Trung bình số lượng applications cho mỗi job
            jobModel.aggregate([
                {
                    $project: {
                        applicationCount: { $size: "$applications" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgApplications: { $avg: "$applicationCount" }
                    }
                }
            ]),

            // Top 5 categories được sử dụng nhiều nhất
            jobModel.aggregate([
                {
                    $lookup: {
                        from: 'Categories',
                        localField: 'mainCategory',
                        foreignField: '_id',
                        as: 'categoryInfo'
                    }
                },
                {
                    $unwind: '$categoryInfo'
                },
                {
                    $group: {
                        _id: '$mainCategory',
                        categoryName: { $first: '$categoryInfo.name' },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 5
                }
            ])
        ]);

        return {
            jobStatistics: jobStats,
            averageApplicationsPerJob: avgApplications[0]?.avgApplications || 0,
            topCategories: topCategories.map(cat => ({
                categoryName: cat.categoryName,
                jobCount: cat.count
            }))
        };
    }

}

export default new JobRepo();