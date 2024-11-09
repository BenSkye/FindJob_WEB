import { BadRequestError } from '../core/error.response';
import { subscriptionModel } from "../models/subscription.model";
import { userModel } from "../models/user.model";
import applicationRepo from "../repositories/application.repo";
import companyRepo from "../repositories/company.repo";
import jobRepo from "../repositories/job.repo";
import { convertObjectId } from "../utils";
import NotificationService from './notification.service';


class JobService {
    static createJob = async (userId: string, data: any) => {
        const user = await userModel.findById(userId).select('companyId');
        if (!user) {
            throw new Error('User not found');
        }

        const company = await companyRepo.getCompanyById(user.companyId.toString());
        if (!company) {
            throw new Error('Company not found');
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

        const newJob = await jobRepo.createJob(jobData);

        // Tạo thông báo cho tất cả candidates với mức lương max
        //nếu mức lương thỏa thuận thì tạo thông báo với mức lương thỏa thuận 
        if (!data.salary.negotiable && data.salary.max) {
            await NotificationService.createNotificationForAllCandidates({
                title: 'Có việc làm mới phù hợp với bạn',
                content: `${company.name} vừa đăng tuyển vị trí ${data.title} với mức lương lên đến ${data.salary.max.toLocaleString('vi-VN')} VNĐ`,
                type: 'new_job'
            });
        }
        if (data.salary.negotiable) {
            await NotificationService.createNotificationForAllCandidates({
                title: 'Có việc làm mới phù hợp với bạn',
                content: `${company.name} vừa đăng tuyển vị trí ${data.title} với mức lương lên  thỏa thuận`,
                type: 'new_job'
            });
        }


        return newJob;
    }

    static getListJobByCandidate = async (query: any) => {
        const select = ['_id', 'title', 'companyId', 'mainCategory', 'subCategory', 'location', 'salary', 'jobType', 'status', 'isHot', 'level', 'expiryDate', 'createdAt', 'updatedAt'];
        query = { ...query, status: 'published' }
        const jobs = await jobRepo.getListJobByCandidate(query, select);
        console.log('jobs', jobs);
        return jobs;
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
            console.log('job.employerId', job.employerId.toString());
            console.log('subscription.userId', subscription.userId.toString());
            throw new Error('Job not found56');
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

    static getListApplicationsByJobId = async (jobId: string) => {
        const job = await jobRepo.getJobById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        let applications = []

        for (let applicationId of job.applications) {
            const application = await applicationRepo.getApplicationById(applicationId.toString());
            applications.push(application);
        }

        return applications;
    }

    static getPersonalJob = async (userId: string) => {
        return await jobRepo.getPersonalJob(userId);
    }

    static getCompanyJob = async (userId: string) => {
        const user = await userModel.findById(userId).select('companyId');
        if (!user) {
            throw new Error('User not found');
        }
        return await jobRepo.getCompanyJob(user.companyId.toString());
    }

    static updateJob = async (jobId: string, data: any) => {
        return await jobRepo.updateJob(jobId, data);
    }

    static getPersonalisPayTrue = async (userId: string) => {
        return await jobRepo.getJobsHasPay(userId);
    }

    static checkJobExpired = async () => {
        const jobs = await jobRepo.getJobs({ status: 'published', expiryDate: { $lte: new Date() } });
        for (let job of jobs) {
            job.status = 'expired';
            await jobRepo.updateJob(job._id.toString(), job);
        }
    }

    static async getJobStats() {
        try {
            const stats = await jobRepo.getJobStats();

            if (!stats) {
                throw new BadRequestError('Cannot get job statistics');
            }

            return {
                message: 'Get job statistics successfully',
                status: 200,
                metadata: {
                    jobStatistics: stats.jobStatistics.map(year => ({
                        year: year._id,
                        monthlyStats: year.monthlyStats.map((month: any) => ({
                            month: month.month,
                            dailyStats: month.dailyStats,
                            totalJobsInMonth: month.total
                        })),
                        totalJobsInYear: year.yearlyTotal
                    })),
                    averageApplicationsPerJob: Math.round(stats.averageApplicationsPerJob * 10) / 10, // Làm tròn đến 1 chữ số thập phân
                    topCategories: stats.topCategories
                }
            };
        } catch (error) {
            throw new BadRequestError('Error while getting job statistics');
        }
    }

}
export default JobService;