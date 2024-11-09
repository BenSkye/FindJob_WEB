import CVRepo from "../repositories/cv.repo";
import TemplateService from "./template.service";
import { ICV } from "../interface/cv.interface";
import { BadRequestError, NotFoundError } from "../core/error.response";

class CVService {
    static async createCV(cv: ICV) {
        // Validate template exists
        await TemplateService.findTemplateById(cv.templateId);
        
        // Validate selected fields against template fields
        const templateFields = await TemplateService.getTemplateFields(cv.templateId);
        const validFields = templateFields.map(field => field.name);
        
        const invalidFields = cv.selectedFields.filter(field => !validFields.includes(field));
        if (invalidFields.length) {
            throw new BadRequestError(`Invalid fields selected: ${invalidFields.join(', ')}`);
        }

        return await CVRepo.createCV(cv);
    }

    static async findCVById(cvId: string) {
        const cv = await CVRepo.findCVById(cvId);
        if (!cv) throw new NotFoundError('CV not found');
        return cv;
    }

    static async findCVsByUserId(userId: string) {
        return await CVRepo.findCVsByUserId(userId);
    }

    static async updateCV(cvId: string, cv: Partial<ICV>) {
        const existingCV = await this.findCVById(cvId);
        if (!existingCV) throw new NotFoundError('CV not found');

        if (cv.templateId) {
            // If template is being changed, validate new template
            await TemplateService.findTemplateById(cv.templateId);
        }

        return await CVRepo.updateCV(cvId, cv);
    }

    static async deleteCV(cvId: string) {
        const cv = await this.findCVById(cvId);
        if (!cv) throw new NotFoundError('CV not found');
        
        return await CVRepo.deleteCV(cvId);
    }

    static async updateCVStatus(cvId: string, status: ICV['status']) {
        const cv = await this.findCVById(cvId);
        if (!cv) throw new NotFoundError('CV not found');

        return await CVRepo.updateCVStatus(cvId, status);
    }

    static async updateCVContent(
        cvId: string,
        content: ICV['content'],
        selectedFields: string[]
    ) {
        const cv = await this.findCVById(cvId);
        if (!cv) throw new NotFoundError('CV not found');

        // Validate selected fields against template fields
        const templateFields = await TemplateService.getTemplateFields(cv.templateId.toString());
        const validFields = templateFields.map(field => field.name);

        const invalidFields = selectedFields.filter(field => !validFields.includes(field));
        if (invalidFields.length) {
            throw new BadRequestError(`Invalid fields selected: ${invalidFields.join(', ')}`);
        }

        return await CVRepo.updateCVContent(cvId, content, selectedFields);
    }

    static async findCVByUserId(userId: string) {
        return await CVRepo.findCVByUserId(userId);
    }
}

export default CVService;