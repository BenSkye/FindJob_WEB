export interface ITemplateField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'array' | 'number' | 'image';
    required: boolean;
    order: number;
    section: 'personal' | 'professional' | 'education' | 'skills' | 'experience';
}

export interface ITemplate {
    _id?: string;
    name: string;
    thumbnail: string;
    fields: ITemplateField[];
    htmlStructure: string;
    cssStyles: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}