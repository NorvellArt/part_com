import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/shared/api/httpClient';
import { PagedResult } from '@/shared/types/pagination';
import {
    Product,
    CreateProductInput,
    UpdateProductInput,
    ProductSearchParams
} from '@/entities/product/model/types';

export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (params: ProductSearchParams) => [...productKeys.lists(), params] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
};

export const productApi = {
    search: async ({ query, page = 1, pageSize = 20 }: ProductSearchParams, signal?: AbortSignal) => {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        params.set('page', page.toString());
        params.set('pageSize', pageSize.toString());

        return fetchApi<PagedResult<Product>>(`/api/products/search?${params.toString()}`, { signal });
    },

    getById: async (id: string) => {
        return fetchApi<Product>(`/api/products/${id}`);
    },

    create: async (input: CreateProductInput) => {
        return fetchApi<Product>('/api/products', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },

    update: async (id: string, input: UpdateProductInput) => {
        return fetchApi<void>(`/api/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(input),
        });
    },

    delete: async (id: string) => {
        return fetchApi<void>(`/api/products/${id}`, {
            method: 'DELETE',
        });
    },
};

export function useProducts(params: ProductSearchParams) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: ({ signal }) => productApi.search(params, signal),
        placeholderData: (previousData) => previousData,
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productApi.getById(id),
        enabled: Boolean(id),
    });
}