import { categoryModel } from "../models/category.model";


class CategoryRepo {
    async createCategory(data: any) {
        const categoryData = {
            name: data.name
        }
        let newCategory;
        newCategory = await categoryModel.create(categoryData);
        for (let subCategory of data.subCategories) {
            newCategory = await categoryModel.findByIdAndUpdate(newCategory?._id,
                { $push: { subCategories: subCategory } }, { new: true });
        }
        return newCategory;
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