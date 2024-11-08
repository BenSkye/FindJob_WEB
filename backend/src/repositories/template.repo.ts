import { ITemplate } from '../interface/template.interface';
import templateModel from "../models/template.model";

class TemplateRepo {
    static findAllTemplates = async (filter: { isActive?: boolean } = {}) => {
        return await templateModel.find(filter);
    };

    static findTemplateById = async (templateId: string) => {
        return await templateModel.findById(templateId);
    };

    static createTemplate = async (template: ITemplate) => {
        return await templateModel.create(template);
    };

    static updateTemplate = async (templateId: string, template: Partial<ITemplate>) => {
        return await templateModel.findByIdAndUpdate(
            templateId, 
            template, 
            { new: true }
        );
    };

    static deleteTemplate = async (templateId: string) => {
        return await templateModel.findByIdAndDelete(templateId);
    };

    static getTemplateFields = async (templateId: string) => {
        const template = await templateModel.findById(templateId);
        return template?.fields || [];
    };
}

export default TemplateRepo;