import companyRepo from "../repositories/company.repo";


class CompanyService {
    static createCompany = async (data: any) => {
        return await companyRepo.createCompany(data);
    }

    static getCompanyById = async (companyId: string) => {
        return await companyRepo.getCompanyById(companyId);
    }

    static updateCompany = async (companyId: string, data: any) => {
        return await companyRepo.updateCompany(companyId, data);
    }


}
export default CompanyService;