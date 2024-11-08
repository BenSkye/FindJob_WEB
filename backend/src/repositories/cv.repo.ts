import cvModel from "../models/cv.model";
import { ICV } from "../interface/cv.interface";

class CVRepo {
    static createCV = async (cv: ICV) => {
        return await cvModel.create(cv);
    };

    static findCVById = async (cvId: string) => {
        return await cvModel.findById(cvId)
            .populate('templateId', 'name fields htmlStructure cssStyles');
    };

    static findCVsByUserId = async (userId: string) => {
        return await cvModel.find({ userId })
            .populate('templateId', 'name thumbnail');
    };

    static updateCV = async (cvId: string, cv: Partial<ICV>) => {
        return await cvModel.findByIdAndUpdate(
            cvId, 
            cv, 
            { new: true }
        ).populate('templateId', 'name fields htmlStructure cssStyles');
    };

    static deleteCV = async (cvId: string) => {
        return await cvModel.findByIdAndDelete(cvId);
    };

    static updateCVStatus = async (cvId: string, status: ICV['status']) => {
        return await cvModel.findByIdAndUpdate(
            cvId,
            { status },
            { new: true }
        );
    };

    static updateCVContent = async (
        cvId: string, 
        content: ICV['content'],
        selectedFields: string[]
    ) => {
        return await cvModel.findByIdAndUpdate(
            cvId,
            { content, selectedFields },
            { new: true }
        ).populate('templateId', 'name fields htmlStructure cssStyles');
    };
}

export default CVRepo;