export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    logo?: string;
    tags?: string[];
    isHot?: boolean;
    level?: string;
    category?: string;
}