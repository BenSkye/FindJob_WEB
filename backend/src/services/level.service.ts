import levelRepo from "../repositories/level.repo";

class LevelService {
    async createLevel(data: any) {
        return await levelRepo.createLevel(data);
    }

    async getListLevel() {
        return await levelRepo.getListLevel();
    }

    async getLevelById(levelId: string) {
        return await levelRepo.getLevelById(levelId);
    }

    async updateLevel(levelId: string, data: any) {
        return await levelRepo.updateLevel(levelId, data);
    }

    async deleteLevel(levelId: string) {
        return await levelRepo.deleteLevel(levelId);
    }
}

export default new LevelService();
