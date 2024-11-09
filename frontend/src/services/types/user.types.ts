export interface User {
    name: string;
    email: string;
    avatar?: string;
    password: string;
    phone: string;
    role: string;
    address?: string;
}

export interface Employer extends User {
    companyName: string;
}
