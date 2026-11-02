import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/shared';
import { productKeys } from '@/entities/product';
import { useRouter } from 'next/navigation';

export function useDeleteProduct(id: string) {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: () =>
            fetchApi<void>(`/api/products/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
}

export function useBulkDeleteProducts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productIds: string[]) =>
            fetchApi<void>('/api/products/bulk-delete', {
                method: 'POST',
                body: JSON.stringify({ productIds }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
}