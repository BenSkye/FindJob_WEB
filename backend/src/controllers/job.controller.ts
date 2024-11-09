import { NextFunction, Request, Response } from 'express';
import { CREATED, SuccessResponse } from '../core/success.response';
import { asyncHandler } from '../helpers/asyncHandler';
import JobService from '../services/job.service';

class JobController {

    createJob = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Create job successfully',
            metadata: await JobService.createJob(req.keyStore.user, req.body),
        }).send(res);
    });

    getListJobByCandidate = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get list job successfully',
            metadata: await JobService.getListJobByCandidate(req.query),
        }).send(res);
    });

    getJobById = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get job by id successfully',
            metadata: await JobService.getJobById(req.params.jobId),
        }).send(res);
    });

    publishJobWhenActiveSubscription = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Publish job when active subscription successfully',
            metadata: await JobService.publishJobWhenActiveSubscription(req.params.jobId, req.keyStore.user),
        }).send(res);
    });

    getListApplicationsByJobId = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get list applications by job id successfully',
            metadata: await JobService.getListApplicationsByJobId(req.params.jobId),
        }).send(res);
    });

    getPersonalJob = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get personal job successfully',
            metadata: await JobService.getPersonalJob(req.keyStore.user),
        }).send(res);
    });

    getCompanyJob = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get company job successfully',
            metadata: await JobService.getCompanyJob(req.keyStore.user),
        }).send(res);
    });


    updateJob = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Update job successfully',
            metadata: await JobService.updateJob(req.params.jobId, req.body),
        }).send(res);
    });

    getPersonalisPayTrue = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get personal job pay true successfully',
            metadata: await JobService.getPersonalisPayTrue(req.keyStore.user),
        }).send(res);
    });

    getJobStats = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get job stats successfully',
            metadata: await JobService.getJobStats(),
        }).send(res);
    });

}
export default new JobController();
