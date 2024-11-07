import { categoryModel } from "../models/category.model";


class CategoryRepo {
    async createCategory(data: any) {
        return await categoryModel.create(data);
    }

    async addSubCategory(categoryId: string, subCategory: any) {
        return await categoryModel.findByIdAndUpdate(categoryId,
            {
                $push: { subCategories: subCategory }
            }, { new: true });
    }

    async getListCategory() {
        return await categoryModel.find();
    }

    async getCategoryById(categoryId: string) {
        return await categoryModel.findById(categoryId);
    }

}

export default new CategoryRepo();