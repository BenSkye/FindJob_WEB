import { userModel } from "../models/user.model";

const findByEmail = async (email: string, select = { email: 1, password: 1, name: 1, status: 1, roles: 1 }) => {
    return await userModel.findOne({ email }).select(select).lean();
};

export { findByEmail };