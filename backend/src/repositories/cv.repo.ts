import cvModel from "../models/cv.model";
import { ICV } from "../interface/cv.interface";

class CVRepo {
    static createCV = async (cv: ICV) => {
        return await cvModel.create(cv);
    };

    static findCVById = async (cvId: string) => {
        return await cvModel.findById(cvId);
    };

    static updateCV = async (cvId: string, cv: ICV) => {
        return await cvModel.findByIdAndUpdate(cvId, cv, { new: true });
    };

    static deleteCV = async (cvId: string) => {
        return await cvModel.findByIdAndDelete(cvId);
    };
    
}

export default CVRepo;
