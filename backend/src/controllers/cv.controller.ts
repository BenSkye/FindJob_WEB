import CVService from "../services/cv.service";
import { Request, Response, NextFunction } from "express";
import { CREATED, SuccessResponse } from "../core/success.response";
import { asyncHandler } from "../helpers/asyncHandler";

class CVController {
    static createCV = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Create new CV successfully',
            metadata: await CVService.createCV(req.body),
        }).send(res);
    });

    static findCVById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get CV by id successfully',
            metadata: await CVService.findCVById(req.params.cvId),
        }).send(res);
    });

    static updateCV = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Update CV successfully',
            metadata: await CVService.updateCV(req.params.cvId, req.body),
        }).send(res);
    });

    static deleteCV = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Delete CV successfully',
            metadata: await CVService.deleteCV(req.params.cvId),
        }).send(res);
    })  ;
}

export default CVController;