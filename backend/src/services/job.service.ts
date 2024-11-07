import { subscriptionModel } from "../models/subscription.model";
import { userModel } from "../models/user.model";
import companyRepo from "../repositories/company.repo";
import jobRepo from "../repositories/job.repo";
import { convertObjectId } from "../utils";


class JobService {
    static createJob = async (userId: string, data: any) => {
        const user = await userModel.findById(userId).select('companyId');
        if (!user) {
            throw new Error('User not found');
        }
        const jobData = {
            employerId: userId,
            companyId: user.companyId,
            title: data.title,
            requirements: data.requirements,
            description: data.description,
            salary: data.salary,
            benefits: data.benefits,
            location: data.location,
            jobType: data.jobType,
            expiryDate: data.expiryDate,
            mainCategory: data.mainCategory,
            subCategory: data.subCategory,
            isHot: data.isHot,
            level: data.level,
        }
        return await jobRepo.createJob(jobData);
    }

    static getListJobByCandidate = async (query: any) => {
        const select = ['_id', 'title', 'companyId', 'location', 'salary', 'jobType', 'status', 'isHot', 'expiryDate', 'createdAt', 'updatedAt'];
        query = { ...query, status: 'published' }
        return await jobRepo.getListJob(query, select);
    }

    static getJobById = async (jobId: string) => {
        return await jobRepo.getJobById(jobId);
    }

    static publishJobWhenActiveSubscription = async (jobId: string, userId: string) => {
        const subscription = await subscriptionModel.findOne({ userId, status: 'active' });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        const job = await jobRepo.getJobById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }
        if (job.employerId.toString() !== subscription.userId.toString()) {
            throw new Error('Job not found');
        }
        job.status = 'published';
        return await jobRepo.updateJob(jobId, job);
    }


    static publistJobWhenPayment = async (jobId: string, userId: string, paymentId: string) => {
        const job = await jobRepo.getJobById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }
        if (job.employerId.toString() !== userId.toString()) {
            throw new Error('Job not found');
        }
        const jobData = {
            status: 'published',
            paymentId: paymentId,
            isPay: true,
        }

        return await jobRepo.updateJob(jobId, jobData);
    }


}
export default JobService;