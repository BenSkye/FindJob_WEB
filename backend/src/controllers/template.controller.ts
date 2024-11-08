import TemplateService from "../services/template.service";
import { Request, Response, NextFunction } from "express";
import { CREATED, SuccessResponse } from "../core/success.response";
import { asyncHandler } from "../helpers/asyncHandler";

class TemplateController {
    static findAllTemplates = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const activeOnly = req.query.activeOnly !== 'false';
        new SuccessResponse({
            message: 'Get all templates successfully',
            metadata: await TemplateService.findAllTemplates(activeOnly),
        }).send(res);
    });

    static findTemplateById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get template by id successfully',
            metadata: await TemplateService.findTemplateById(req.params.templateId),
        }).send(res);
    });

    static createTemplate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Create new template successfully',
            metadata: await TemplateService.createTemplate(req.body),
        }).send(res);
    });
        
    static updateTemplate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Update template successfully',
            metadata: await TemplateService.updateTemplate(req.params.templateId, req.body),
        }).send(res);
    }); 

    static deleteTemplate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Delete template successfully',
            metadata: await TemplateService.deleteTemplate(req.params.templateId),
        }).send(res);
    }); 

    static getTemplateFields = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get template fields successfully',
            metadata: await TemplateService.getTemplateFields(req.params.templateId),
        }).send(res);
    });
}

export default TemplateController;