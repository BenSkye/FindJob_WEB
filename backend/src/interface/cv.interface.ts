export interface ICV {
    _id?: string;
    userId: string;
    templateId: string;
    content: Map<string, any>;  // Hoặc Record<string, any>
    selectedFields: string[];
    status: 'draft' | 'active' | 'inactive';
    isPaid: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Interface phụ để type checking cho content (tùy chọn)
export interface ICVContent {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    level?: string;
    jobTitle?: string;
    jobType?: string;
    jobDescription?: string;
    skills?: string[];
    experiences?: Array<{
        title?: string;
        company?: string;
        duration?: string;
        description?: string;
    }>;
    education?: Array<{
        school?: string;
        degree?: string;
        duration?: string;
        description?: string;
    }>;
    salaryExpectation?: number;
    // Có thể thêm các field khác tùy theo yêu cầu
}