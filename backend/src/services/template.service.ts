import TemplateRepo from "../repositories/template.repo";
import { ITemplate } from "../interface/template.interface";

class TemplateService {
    static findAllTemplates = async () => {
        return await TemplateRepo.findAllTemplates();
    };

    static findTemplateById = async (templateId: string) => {
        return await TemplateRepo.findTemplateById(templateId);
    };

    static createTemplate = async (template: ITemplate) => {
        return await TemplateRepo.createTemplate(template);
    };

    static updateTemplate = async (templateId: string, template: ITemplate) => {
        return await TemplateRepo.updateTemplate(templateId, template);
    };

    static deleteTemplate = async (templateId: string) => {
        return await TemplateRepo.deleteTemplate(templateId);
    };
}

export default TemplateService;