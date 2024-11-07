import CVRepo from "../repositories/cv.repo";
import { ICV } from "../interface/cv.interface";

class CVService {
    static createCV = async (cv: ICV) => {
        return await CVRepo.createCV(cv);
    };

    static findCVById = async (cvId: string) => {
        return await CVRepo.findCVById(cvId);
    };

    static updateCV = async (cvId: string, cv: ICV) => {
        return await CVRepo.updateCV(cvId, cv);
    };

    static deleteCV = async (cvId: string) => {
        return await CVRepo.deleteCV(cvId);
    };
    
}

export default CVService;