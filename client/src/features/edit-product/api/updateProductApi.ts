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