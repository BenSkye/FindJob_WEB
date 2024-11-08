import { userModel } from "../models/user.model";
import companyRepo from "../repositories/company.repo";


class CompanyService {
    static createCompany = async (data: any) => {
        return await companyRepo.createCompany(data);
    }

    static getCompanyById = async (companyId: string) => {
        return await companyRepo.getCompanyById(companyId);
    }

    static getPersonalCompany = async (userId: string) => {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return await companyRepo.getCompanyById(user?.companyId.toString());
    }

    static updateCompany = async (companyId: string, data: any) => {
        return await companyRepo.updateCompany(companyId, data);
    }


}
export default CompanyService;