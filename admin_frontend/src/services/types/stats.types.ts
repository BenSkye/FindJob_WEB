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

export interface UserStats {
    candidates: {
        total: number;
        newToday: number;
        newThisWeek: number;
        newThisMonth: number;
    };
    employers: {
        total: number;
        newToday: number;
        newThisWeek: number;
        newThisMonth: number;
    };
}

export interface SubscriptionStats {
    totalSubscriptions: number;
    totalRevenue: number;
    monthlyStats: Array<{
        month: number;
        totalSubscriptions: number;
        totalRevenue: number;
    }>;
}

export interface JobStats {
  jobStatistics: Array<{
    year: number;
    monthlyStats: Array<{
      month: number;
      dailyStats: Array<{
        day: number;
        count: number;
      }>;
      totalJobsInMonth: number;
    }>;
    totalJobsInYear: number;
  }>;
  averageApplicationsPerJob: number;
  topCategories: Array<{
    categoryName: string;
    jobCount: number;
  }>;
}
