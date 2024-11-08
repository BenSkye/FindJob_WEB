import TemplateRepo from "../repositories/template.repo";
import { ITemplate } from "../interface/template.interface";
import { BadRequestError, NotFoundError } from "../core/error.response";

class TemplateService {
    static findAllTemplates = async (activeOnly: boolean = true) => {
        const filter = activeOnly ? { isActive: true } : {};
        return await TemplateRepo.findAllTemplates(filter);
    };

    static findTemplateById = async (templateId: string) => {
        const template = await TemplateRepo.findTemplateById(templateId);
        if (!template) throw new NotFoundError('Template not found');
        return template;
    };

    static createTemplate = async (template: ITemplate) => {
        // Validate fields structure
        if (!template.fields?.length) {
            throw new BadRequestError('Template must have at least one field');
        }
        return await TemplateRepo.createTemplate(template);
    };

    static updateTemplate = async (templateId: string, template: Partial<ITemplate>) => {
        const existingTemplate = await this.findTemplateById(templateId);
        if (!existingTemplate) throw new NotFoundError('Template not found');
        
        return await TemplateRepo.updateTemplate(templateId, template);
    };

    static deleteTemplate = async (templateId: string) => {
        const template = await this.findTemplateById(templateId);
        if (!template) throw new NotFoundError('Template not found');
        
        return await TemplateRepo.deleteTemplate(templateId);
    };

    static getTemplateFields = async (templateId: string) => {
        const fields = await TemplateRepo.getTemplateFields(templateId);
        if (!fields.length) throw new NotFoundError('Template fields not found');
        return fields;
    };
}

export default TemplateService;