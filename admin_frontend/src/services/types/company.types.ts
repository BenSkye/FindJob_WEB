interface Company {
    _id: string;
    name: string;
    logo: string;
    description: string;
    companySize: string;
    website: string | null;
    email: string;
    address: string | null;
    phone: string | null;
    facebook: string;
    linkedin: string | null;
    twitter: string | null;
    taxNumber: string;
    category: any;
}

export type { Company };
