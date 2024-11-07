import { levelModel } from "../models/level.model";

class LevelRepo {
    async createLevel(data: any) {
        return await levelModel.create(data);
    }

    async getListLevel() {
        return await levelModel.find();
    }

    async getLevelById(levelId: string) {
        return await levelModel.findById(levelId);
    }

    async updateLevel(levelId: string, data: any) {
        return await levelModel.findByIdAndUpdate(levelId, data, { new: true });
    }

    async deleteLevel(levelId: string) {
        return await levelModel.findByIdAndDelete(levelId);
    }

    async getLevelByName(name: string) {
        return await levelModel.findOne({ name });
    }
}

export default new LevelRepo();