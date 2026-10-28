import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/shared';
import { productKeys, Product } from '@/entities/product';

export interface UpdateProductDto {
    brand: string;
    itemNumber: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export function useUpdateProduct(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: UpdateProductDto) =>
            fetchApi<Product>(`/api/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify(dto),
            }),
        onSuccess: (updatedProduct) => {
            queryClient.setQueryData(productKeys.detail(id), updatedProduct);
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
}

export function useUploadProductImage(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) =>
            fetchApi<{ imageUrl: string }>(`/api/products/${id}/image`, {
                method: 'POST',
                body: formData,
            }),
        onSuccess: (response) => {
            queryClient.setQueryData<Product | undefined>(productKeys.detail(id), (oldProduct) => {
                if (!oldProduct) return undefined;
                return {
                    ...oldProduct,
                    imageUrl: response.imageUrl,
                };
            });
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
}

// 3. Новый хук для полного удаления изображения товара
export function useDeleteProductImage(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            fetchApi<void>(`/api/products/${id}/image`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.setQueryData<Product | undefined>(productKeys.detail(id), (oldProduct) => {
                if (!oldProduct) return undefined;
                return {
                    ...oldProduct,
                    imageUrl: null,
                };
            });
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
}