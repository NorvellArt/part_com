export interface Category {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    level: number;
}

export interface CategoryNode {
    id: string;
    name: string;
    slug: string;
    level: number;
    children: CategoryNode[];
}

export interface CreateCategoryInput {
    name: string;
    slug: string;
    parentId: string | null;
}

export interface UpdateCategoryInput {
    name: string;
    slug: string;
}
