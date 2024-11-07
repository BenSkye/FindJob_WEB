import { companyModel } from "../models/company.model";


class CompanyRepo {
    async createCompany(data: any) {
        return await companyModel.create(data);
    }

    async getCompanyById(companyId: string) {
        return await companyModel.findById(companyId);
    }

    async updateCompany(companyId: string, data: any) {
        return await companyModel.findByIdAndUpdate(companyId, data, { new: true });
    }

}

export default new CompanyRepo();