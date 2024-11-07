import { ITemplate } from '../interface/template.interface';
import templateModel from "../models/template.model";

class TemplateRepo {
    static findAllTemplates = async () => {
        return await templateModel.find();
    };

    static findTemplateById = async (templateId: string) => {
        return await templateModel.findById(templateId);
    };

    static createTemplate = async (template: ITemplate) => {
        return await templateModel.create(template);
    };

    static updateTemplate = async (templateId: string, template: ITemplate) => {
        return await templateModel.findByIdAndUpdate(templateId, template, { new: true });
    };

    static deleteTemplate = async (templateId: string) => {
        return await templateModel.findByIdAndDelete(templateId);
    };
}

export default TemplateRepo;