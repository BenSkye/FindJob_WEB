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