import categoryRepo from "../repositories/category,repo";


class CategoryService {
    static createCategory = async (data: any) => {
        return await categoryRepo.createCategory(data);
    }

    static addSubCategory = async (categoryId: string, subCategory: any) => {
        return await categoryRepo.addSubCategory(categoryId, subCategory);
    }

    static addManySubCategory = async (categoryId: string, subCategories: any) => {
        for (let subCategory of subCategories) {
            await categoryRepo.addSubCategory(categoryId, subCategory);
        }
        return true;
    }

    static getListCategory = async () => {
        return await categoryRepo.getListCategory();
    }

    static getCategoryById = async (categoryId: string) => {
        return await categoryRepo.getCategoryById(categoryId);
    }

}
export default CategoryService;