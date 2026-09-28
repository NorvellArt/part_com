import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRepositories } from '@/infrastructure/di/repositoryContext';
import { UpdateProductInput } from '@/domain/entities/product';

export const PRODUCTS_QUERY_KEY = ['products'];

export function useProducts(query: string, limit = 50) {
    const queryClient = useQueryClient();
    const { productRepository } = useRepositories();

    const productsQuery = useQuery({
        queryKey: ['products', 'search', query, limit],
        queryFn: ({ signal }) => productRepository.search(query, limit, signal),
        staleTime: 1000 * 60 * 2,
        enabled: true,
    });

    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
            productRepository.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        },
    });

    const deleteProductMutation = useMutation({
        mutationFn: (id: string) => productRepository.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        },
    });

    const importExcelMutation = useMutation({
        mutationFn: (file: File) => productRepository.importFromExcel(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        },
    });

    return {
        products: productsQuery.data ?? [],
        isLoading: productsQuery.isLoading,
        isError: productsQuery.isError,
        error: productsQuery.error,
        updateProduct: updateProductMutation.mutateAsync,
        isUpdating: updateProductMutation.isPending,
        deleteProduct: deleteProductMutation.mutateAsync,
        isDeleting: deleteProductMutation.isPending,
        importExcel: importExcelMutation.mutateAsync,
        isImporting: importExcelMutation.isPending,
    };
}