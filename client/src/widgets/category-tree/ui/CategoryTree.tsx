'use client';

import { useState } from 'react';
import { useCategoriesTree } from '@/entities/category';
import {
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from '@/features/manage-category/model/actions';
import { CategoryFormModal } from '@/features/manage-category/ui/CategoryFormModal';
import { CategoryTreeNode } from './CategoryTreeNode';
import { CategoryNode } from '@/entities/category/model/types';

export function CategoryTree() {
    const { data: tree = [], isLoading, isError, error } = useCategoriesTree();

    const createCategoryMutation = useCreateCategory();
    const deleteCategoryMutation = useDeleteCategory();

    const updateCategoryMutation = useUpdateCategory('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeParent, setActiveParent] = useState<CategoryNode | null>(null);
    const [activeEdit, setActiveEdit] = useState<CategoryNode | null>(null);

    const handleOpenCreateRoot = () => {
        setActiveParent(null);
        setActiveEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenAddChild = (parent: CategoryNode) => {
        setActiveParent(parent);
        setActiveEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (node: CategoryNode) => {
        setActiveParent(null);
        setActiveEdit(node);
        setIsModalOpen(true);
    };

    const handleSave = async (name: string, slug: string) => {
        if (activeEdit) {
            updateCategoryMutation.mutate(
                { name, slug },
                {
                    onSuccess: () => setIsModalOpen(false),
                    onError: (err: any) => alert(err.message),
                },
            );
        } else {
            createCategoryMutation.mutate(
                {
                    name,
                    slug,
                    parentId: activeParent ? activeParent.id : null,
                },
                {
                    onSuccess: () => setIsModalOpen(false),
                    onError: (err: any) => alert(err.message),
                },
            );
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Вы уверены, что хотите удалить категорию?')) return;

        deleteCategoryMutation.mutate(id, {
            onError: (err: any) => alert(err.message),
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Загрузка структуры каталога...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-500">
                Ошибка: {(error as any)?.message}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Структура категорий
                </h2>
                <button
                    onClick={handleOpenCreateRoot}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                    + Корневая категория
                </button>
            </div>

            {tree.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    Дерево категорий пусто.
                </div>
            ) : (
                <div className="-ml-4">
                    {tree.map((rootNode) => (
                        <CategoryTreeNode
                            key={rootNode.id}
                            node={rootNode}
                            onAddChild={handleOpenAddChild}
                            onEdit={handleOpenEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <CategoryFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editNode={activeEdit}
                parentNode={activeParent}
            />
        </div>
    );
}
