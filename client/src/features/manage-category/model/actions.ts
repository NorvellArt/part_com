import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi, categoryKeys, CategoryNode } from '@/entities/category';
import { CreateCategoryInput, MoveCategoryInput } from '@/entities/category';
import { useState } from 'react';
import { toast } from '@/shared/components';

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

export function useMoveCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: MoveCategoryInput }) =>
            categoryApi.move(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.trees() });
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

export function useCategoryActions(treeRef: any) {
    const createCategoryMutation = useCreateCategory();
    const deleteCategoryMutation = useDeleteCategory();
    const updateCategoryMutation = useUpdateCategory();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeParent, setActiveParent] = useState<CategoryNode | null>(null);
    const [activeEdit, setActiveEdit] = useState<CategoryNode | null>(null);

    const openCreateRoot = () => {
        setActiveParent(null);
        setActiveEdit(null);
        setIsModalOpen(true);
    };

    const openAddChild = (parent: CategoryNode) => {
        setActiveParent(parent);
        setActiveEdit(null);
        setIsModalOpen(true);
    };

    const openEdit = (node: CategoryNode) => {
        setActiveParent(null);
        setActiveEdit(node);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSave = (name: string, slug: string) => {
        const options = {
            onSettled: closeModal,
            onSuccess: () => {
                if (activeParent) treeRef.current?.open(activeParent.id);
            },
            onError: (err: any) => toast.add({ type: 'error', title: err.message, priority: 'high' }),
        };

        if (activeEdit) {
            updateCategoryMutation.mutate({ id: activeEdit.id, data: { name, slug } }, options);
        } else {
            if (activeParent && (activeParent.level ?? 1) >= 3) {
                toast.add({ type: 'error', title: 'Достигнута максимальная глубина вложенности (3 уровня)', priority: 'high' });
                return;
            }
            createCategoryMutation.mutate({ name, slug, parentId: activeParent ? activeParent.id : null }, options);
        }
    };

    const handleDelete = (node: CategoryNode) => {
        if (node.children && node.children.length > 0) return;
        if (!confirm(`Вы уверены, что хотите удалить категорию "${node.name}"?`)) return;

        deleteCategoryMutation.mutate(node.id, {
            onError: (err: any) => toast.add({ type: 'error', title: err.message, priority: 'high' }),
        });
    };

    return {
        isModalOpen,
        activeParent,
        activeEdit,
        openCreateRoot,
        openAddChild,
        openEdit,
        closeModal,
        handleSave,
        handleDelete,
    };
}
