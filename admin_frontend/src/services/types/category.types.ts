interface SubCategory {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
    subCategories: SubCategory[];
    createdAt: string;
}

export type { Category, SubCategory };
