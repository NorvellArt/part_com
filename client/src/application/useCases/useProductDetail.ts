import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRepositories } from '@/infrastructure/di/repositoryContext';
import { UpdateProductInput } from '@/domain/entities/product';
import { PRODUCTS_QUERY_KEY } from '@/application/useCases/useProducts';

export function useProductDetail(id: string) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { productRepository } = useRepositories();

    const productQueryKey = ['product', id];

    const productQuery = useQuery({
        queryKey: productQueryKey,
        queryFn: () => productRepository.getById(id),
        enabled: !!id,
    });

    const updateProductMutation = useMutation({
        mutationFn: (data: UpdateProductInput) => productRepository.update(id, data),
        onSuccess: (updatedProduct) => {
            queryClient.setQueryData(productQueryKey, updatedProduct);
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        },
    });

    const deleteProductMutation = useMutation({
        mutationFn: () => productRepository.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            router.push('/');
        },
    });

    return {
        product: productQuery.data,
        isLoading: productQuery.isLoading,
        isError: productQuery.isError,
        updateProduct: updateProductMutation.mutateAsync,
        isUpdating: updateProductMutation.isPending,
        deleteProduct: deleteProductMutation.mutateAsync,
        isDeleting: deleteProductMutation.isPending,
    };
}