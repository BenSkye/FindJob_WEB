import { userModel } from "../models/user.model";

export default class UserRepo {
    
    static statisUser = async (query: any, select: string[] = []) => {
        return await userModel.find(query).select(select);
    }

}