import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/shared/api/httpClient';
import {
    Category,
    CategoryNode,
    CreateCategoryInput,
    UpdateCategoryInput
} from '@/entities/category';

export const categoryKeys = {
    all: ['categories'] as const,
    trees: () => [...categoryKeys.all, 'tree'] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const categoryApi = {
    getTree: async (signal?: AbortSignal) => {
        return fetchApi<CategoryNode[]>('/api/categories/tree', { signal });
    },

    getById: async (id: string) => {
        return fetchApi<Category>(`/api/categories/${id}`);
    },

    create: async (input: CreateCategoryInput) => {
        return fetchApi<Category>('/api/categories', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },

    update: async (id: string, input: UpdateCategoryInput) => {
        return fetchApi<void>(`/api/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(input),
        });
    },

    move: async (id: string, newParentId: string | null) => {
        return fetchApi<void>(`/api/categories/${id}/move`, {
            method: 'PUT',
            body: JSON.stringify(newParentId),
        });
    },

    delete: async (id: string) => {
        return fetchApi<void>(`/api/categories/${id}`, {
            method: 'DELETE',
        });
    },
};

export function useCategoriesTree() {
    return useQuery({
        queryKey: categoryKeys.trees(),
        queryFn: ({ signal }) => categoryApi.getTree(signal),
        placeholderData: (previousData) => previousData,
    });
}

export function useCategory(id: string) {
    return useQuery({
        queryKey: categoryKeys.detail(id),
        queryFn: () => categoryApi.getById(id),
        enabled: Boolean(id),
    });
}
