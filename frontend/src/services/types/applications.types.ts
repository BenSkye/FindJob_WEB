export interface Application {
    _id: string;
    jobId: {
        _id: string;
        title: string;
        location: string;
        salary: string;
        companyId: {
            _id: string;
            name: string;
        }
    };
    candidateId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    resume: string;
    coverLetter: string;
    createdAt: string;
}

export interface ApplicationUpdateDto {
    status: 'pending' | 'approved' | 'rejected';
}