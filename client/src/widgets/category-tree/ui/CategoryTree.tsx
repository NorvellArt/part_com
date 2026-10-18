'use client';

import { useState } from 'react';
import { FolderPlus, Loader2, AlertCircle } from 'lucide-react';
import { useCategoriesTree } from '@/entities/category';
import {
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from '@/features/manage-category/model/actions';
import { CategoryFormModal } from '@/features/manage-category/ui/CategoryFormModal';
import { CategoryTreeNode } from './CategoryTreeNode';
import { CategoryNode } from '@/entities/category/model/types';
import {
    Button,
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components';

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

    const handleSave = (name: string, slug: string) => {
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

    const handleDelete = (id: string) => {
        if (!confirm('Вы уверены, что хотите удалить категорию?')) return;

        deleteCategoryMutation.mutate(id, {
            onError: (err: any) => alert(err.message),
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-sm font-medium">
                    Загрузка структуры каталога...
                </span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert
                variant="destructive"
                className="my-4"
            >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка загрузки</AlertTitle>
                <AlertDescription>
                    {(error as any)?.message ||
                        'Не удалось загрузить дерево категорий.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Структура категорий
                    </h2>
                </div>
                <Button
                    onClick={handleOpenCreateRoot}
                    className="gap-2 shadow-sm"
                >
                    <FolderPlus className="h-4 w-4" />
                    Корневая категория
                </Button>
            </div>

            {tree.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg text-slate-400 bg-slate-50/50">
                    Дерево категорий пусто. Создайте первую категорию, чтобы
                    начать.
                </div>
            ) : (
                <div className="-ml-4 space-y-1">
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
