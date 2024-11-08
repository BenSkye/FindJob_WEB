export interface Job {
    _id: string;
    title: string;
    companyId: object;
    location: string;
    jobType: string;
    expiryDate: Date;
    salary: object;
    mainCategory: object;
    subCategory: string;
    isHot?: boolean;
    level?: string;
}