import { userModel } from "../models/user.model";
import applicationRepo from "../repositories/application.repo";
import categoryRepo from "../repositories/category.repo";
import jobRepo from "../repositories/job.repo";


class ApplicationService {
    static sendApplication = async (jobId: string, data: any, userId: String) => {
        const job = await jobRepo.getJobById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }
        const applicationData = {
            jobId: jobId,
            candidateId: userId,
            companyId: job.companyId,
            employerId: job.employerId,
            status: 'pending',
            resume: data.resume,
            coverLetter: data.coverLetter,
        }
        const application = await applicationRepo.createApplication(applicationData);
        job.applications.push(application._id);
        await jobRepo.updateJob(job._id.toString(), { applications: job.applications });
        return application;
    }

    static getPersonalApplications = async (userId: string) => {
        return await applicationRepo.getApplicationsWithPopulate({ candidateId: userId });
    }

    static getPersonalJobHasApplied = async (userId: string) => {
        const applications = await applicationRepo.getApplications({ candidateId: userId });
        let jobIds: string[] = [];
        applications.forEach((application) => {
            jobIds.push(application.jobId.toString());
        });
        return jobIds;
    }

    static getApplicationByUserCompany = async (userId: string) => {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return await applicationRepo.getApplications({ companyId: user.companyId });
    }

}
export default ApplicationService;