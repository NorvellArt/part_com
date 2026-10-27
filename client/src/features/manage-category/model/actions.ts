import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi, categoryKeys } from '@/entities/category';
import { CreateCategoryInput, UpdateCategoryInput } from '@/entities/category';

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateCategoryInput) => categoryApi.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.trees() });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string; slug: string } }) =>
            categoryApi.update(id, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: categoryKeys.trees() });
        }
    });
}

export function useMoveCategory(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newParentId: string | null) => categoryApi.move(id, newParentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.trees() });
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => categoryApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.trees() });
        },
    });
}
