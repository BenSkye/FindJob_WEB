import { UserStats } from '../interface/userStats.interface';
import { userModel } from "../models/user.model";

const findByEmail = async (email: string, select = { email: 1, password: 1, name: 1, status: 1, roles: 1 }) => {
    return await userModel.findOne({ email }).select(select).lean();
};

const getUserStats = async (): Promise<UserStats> => {
    // Lấy timestamp cho các khoảng thời gian
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Đầu tuần
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Đầu tháng

    // Thống kê candidates
    const totalCandidates = await userModel.countDocuments({
        roles: 'candidate'
    });

    const newCandidatesToday = await userModel.countDocuments({
        roles: 'candidate',
        createdAt: { $gte: startOfToday }
    });

    const newCandidatesThisWeek = await userModel.countDocuments({
        roles: 'candidate',
        createdAt: { $gte: startOfWeek }
    });

    const newCandidatesThisMonth = await userModel.countDocuments({
        roles: 'candidate',
        createdAt: { $gte: startOfMonth }
    });

    // Thống kê employers
    const totalEmployers = await userModel.countDocuments({
        roles: 'employer'
    });

    const newEmployersToday = await userModel.countDocuments({
        roles: 'employer',
        createdAt: { $gte: startOfToday }
    });

    const newEmployersThisWeek = await userModel.countDocuments({
        roles: 'employer',
        createdAt: { $gte: startOfWeek }
    });

    const newEmployersThisMonth = await userModel.countDocuments({
        roles: 'employer',
        createdAt: { $gte: startOfMonth }
    });

    return {
        candidates: {
            total: totalCandidates,
            newToday: newCandidatesToday,
            newThisWeek: newCandidatesThisWeek,
            newThisMonth: newCandidatesThisMonth
        },
        employers: {
            total: totalEmployers,
            newToday: newEmployersToday,
            newThisWeek: newEmployersThisWeek,
            newThisMonth: newEmployersThisMonth
        }
    };
};

const getUserById = async (userId: string) => {
    console.log('userId', userId);
    const user = await userModel.findById(userId).lean();
    console.log('user', user);
    return user;
};

const updateUserById = async (userId: string, user: any) => {
    return await userModel.findByIdAndUpdate(userId, user, { new: true }).lean();
};

export { findByEmail, getUserStats, getUserById, updateUserById };