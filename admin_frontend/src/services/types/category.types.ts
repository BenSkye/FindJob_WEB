interface SubCategory {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    subCategories: SubCategory[];
    createdAt: string;
}

export type { Category, SubCategory };
