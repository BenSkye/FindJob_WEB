export interface Company {
    _id: string;
    name: string;
    logo?: string;
    description?: string;
    companySize?: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
    website?: string;
    email?: string;
    address?: string;
    phone?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    taxNumber?: string;
    mainCategory?: string;
}

export interface CompanyUpdateDto {
    name?: string;
    logo?: string;
    description?: string;
    companySize?: string;
    website?: string;
    email?: string;
    address?: string;
    phone?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    taxNumber?: string;
    mainCategory?: string;
}