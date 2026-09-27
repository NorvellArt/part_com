import { useQuery } from '@tanstack/react-query';
import { useRepositories } from '@/infrastructure/di/repositoryContext';

export function useSearchProducts(query: string, limit = 50) {
    const { productRepository } = useRepositories();

    return useQuery({
        queryKey: ['products', 'search', query, limit],
        queryFn: ({ signal }) => productRepository.search(query, limit, signal),
        staleTime: 1000 * 60 * 2,
        enabled: true,
    });
}