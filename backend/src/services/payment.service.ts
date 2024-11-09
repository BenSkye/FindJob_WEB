import companyRepo from "../repositories/company.repo";
import paymentRepo from "../repositories/payment.repo";
import { PaymentStats } from "../interface/paymentStats";


class PaymentService {
    static createPayment = async (data: any) => {
        return await paymentRepo.createPayment(data);
    }

    static getPaymentByUserId = async (userId: string) => {
        return await paymentRepo.getPaymentByUserId(userId);
    }

    static getPaymentById = async (paymentId: string) => {
        return await paymentRepo.getPaymentById(paymentId);
    }

    static getListPayment = async () => {
        return await paymentRepo.getListPayment();
    }

    static getPaymentStats = async (): Promise<PaymentStats> => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Lấy tất cả payment trong tháng
        const monthlyPayments = await paymentRepo.getPaymentsByDateRange(startOfMonth, endOfDay);

        // Tính toán thống kê cho ngày hiện tại
        const todayPayments = monthlyPayments.filter(payment => 
            payment.paymentDate >= today && payment.paymentDate <= endOfDay
        );

        // Tính toán thống kê cho tuần hiện tại
        const weekPayments = monthlyPayments.filter(payment => 
            payment.paymentDate >= startOfWeek && payment.paymentDate <= endOfDay
        );

        const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);
    tenDaysAgo.setHours(0, 0, 0, 0);

    const tenDaysLater = new Date(today);
    tenDaysLater.setDate(today.getDate() + 10);
    tenDaysLater.setHours(23, 59, 59, 999);

    // Tạo mảng các ngày trong khoảng
    const dateRange = [];
    for (let d = new Date(tenDaysAgo); d <= tenDaysLater; d.setDate(d.getDate() + 1)) {
            dateRange.push(new Date(d).toISOString().split('T')[0]);
        }

        // Tạo map để nhóm payment theo ngày
        const dailyPaymentsMap = monthlyPayments.reduce((acc, payment) => {
            const dateStr = payment.paymentDate.toISOString().split('T')[0];
            if (!acc[dateStr]) {
                acc[dateStr] = {
                    totalPayments: 0,
                    totalAmount: 0
                };
            }
            acc[dateStr].totalPayments += 1;
            acc[dateStr].totalAmount += payment.amount;
            return acc;
        }, {} as Record<string, { totalPayments: number; totalAmount: number }>);

        return {
            today: {
                totalPayments: todayPayments.length,
                totalAmount: todayPayments.reduce((sum, p) => sum + p.amount, 0)
            },
            thisWeek: {
                totalPayments: weekPayments.length,
                totalAmount: weekPayments.reduce((sum, p) => sum + p.amount, 0)
            },
            thisMonth: {
                totalPayments: monthlyPayments.length,
                totalAmount: monthlyPayments.reduce((sum, p) => sum + p.amount, 0)
            },
             dailyStats: dateRange.map(date => ({
            date,
            totalPayments: dailyPaymentsMap[date]?.totalPayments || 0,
            totalAmount: dailyPaymentsMap[date]?.totalAmount || 0
        }))
        };
    }

}
export default PaymentService;