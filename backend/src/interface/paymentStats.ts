export interface PaymentStats {
    today: {
        totalPayments: number;
        totalAmount: number;
    };
    thisWeek: {
        totalPayments: number;
        totalAmount: number;
    };
    thisMonth: {
        totalPayments: number;
        totalAmount: number;
    };
    dailyStats: Array<{
        date: string;
        totalPayments: number;
        totalAmount: number;
    }>;
}