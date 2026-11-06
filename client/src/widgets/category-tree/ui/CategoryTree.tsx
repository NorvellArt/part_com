'use client';

import { useRef, useMemo, useCallback } from 'react';
import {
    DndProvider,
    Tree,
    NodeModel,
    TreeMethods,
    DropOptions,
} from '@minoru/react-dnd-treeview';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Loader2, AlertCircle, FolderPlus } from 'lucide-react';

import { CategoryNode, useCategoriesTree } from '@/entities/category';
import {
    Button,
    Alert,
    AlertTitle,
    AlertDescription,
    toast,
} from '@/shared/components';

import {
    useCategoryActions,
    useMoveCategory,
} from '@/features/manage-category';
import { CategoryTreeNode } from './CategoryTreeNode';
import { CategoryFormModal } from '@/features/manage-category/ui/CategoryFormModal';
import { flattenTree } from '../lib/flattenTree';

// 1. СТАБИЛЬНЫЕ СТАТИЧЕСКИЕ КЛАССЫ И СОРТИРОВКА (ВЫНЕСЕНЫ ИЗ КОМПОНЕНТА)
const TREE_CLASSES = {
    root: 'space-y-2 p-2 pt-2 pb-4 rounded-xl min-h-[400px] transition-colors duration-200',
    placeholder: 'relative',
    dropTarget:
        'border border-dashed rounded-lg scale-[0.99] bg-[var(--color-brand-light)] border-[var(--color-brand)]',
    draggingSource: 'opacity-10 pointer-events-none',
};

const sortTreeNodes = (a: NodeModel<any>, b: NodeModel<any>) =>
    (a.data?.sortOrder ?? 0) - (b.data?.sortOrder ?? 0);

export function CategoryTree() {
    const { data: tree = [], isLoading, isError, error } = useCategoriesTree();
    const moveCategoryMutation = useMoveCategory();
    const treeRef = useRef<TreeMethods>(null);
    const actions = useCategoryActions(treeRef);

    const flatData = useMemo(() => {
        if (!tree || tree.length === 0) return [];
        return flattenTree(tree);
    }, [tree]);

    const handleDrop = useCallback(
        (
            newTree: NodeModel<CategoryNode>[],
            options: DropOptions<CategoryNode>,
        ) => {
            const { dragSourceId, dropTargetId, destinationIndex, dragSource } =
                options;
            if (dragSourceId === undefined || !dragSource) return;

            const newParentId =
                dropTargetId === 'root' || dropTargetId === undefined
                    ? null
                    : (dropTargetId as string);
            const newSortOrder = destinationIndex ?? 0;
            const oldParentId =
                dragSource.parent === 'root'
                    ? null
                    : (dragSource.parent as string);
            const oldSortOrder = (dragSource.data as CategoryNode).sortOrder;

            if (oldParentId === newParentId && oldSortOrder === newSortOrder)
                return;

            moveCategoryMutation.mutate(
                {
                    id: dragSourceId as string,
                    data: { newParentId, newSortOrder },
                },
                {
                    onSuccess: () => {
                        if (newParentId) treeRef.current?.open(newParentId);
                    },
                    onError: (err: any) => {
                        toast.add({
                            type: 'error',
                            title: err.message || 'Ошибка перемещения',
                            priority: 'high',
                        });
                    },
                },
            );
        },
        [moveCategoryMutation],
    );

    // СУПЕР-ОПТИМИЗИРОВАННЫЙ КOЛЛБЭК: Работает за O(1) и не вызывает ререндеров useCollector
    const handleCanDrop = useCallback(
        (
            currentTree: NodeModel<CategoryNode>[],
            options: DropOptions<CategoryNode>,
        ) => {
            const { dragSource, dropTargetId, dropTarget } = options;
            if (!dragSource || dragSource.id === dropTargetId) return false;

            // Считываем уровень текущего элемента напрямую из сохраненного data
            const currentDragNodeLevel = (dragSource.data as any)?.level ?? 1;

            // Определяем уровень, на который элемент встанет в случае успешного дропа
            let futureExpectedLevel = 1; // Если бросаем в корень ('root')

            if (
                dropTargetId !== 'root' &&
                dropTargetId !== undefined &&
                dropTarget
            ) {
                // Если мы навели на какую-то другую ноду:
                // Будущий уровень элемента равен уровню этой ноды + 1 (если закидываем внутрь)
                const targetNodeLevel = (dropTarget.data as any)?.level ?? 1;
                futureExpectedLevel = targetNodeLevel + 1;
            }

            // Разрешаем перемещение только в том случае, если уровень элемента не поменяется
            return currentDragNodeLevel === futureExpectedLevel;
        },
        [],
    );

    const renderPlaceholder = useCallback(
        (node: NodeModel<CategoryNode>, { depth }: { depth: number }) => (
            <div
                style={{ marginLeft: depth * 24 }}
                className="relative py-1 z-30"
            >
                <div
                    style={{ backgroundColor: 'var(--color-brand)' }}
                    className="h-1 w-full rounded relative shadow-[0_0_8px_rgba(var(--brand),0.6)] before:content-[''] before:absolute before:w-3 before:h-3 before:rounded-full before:-top-1 before:-left-1 before:z-40"
                />
            </div>
        ),
        [],
    );

    const renderNode = useCallback(
        (node: NodeModel<CategoryNode>, params: any) => (
            <CategoryTreeNode
                node={node}
                params={params}
                onAddChild={actions.openAddChild}
                onEdit={actions.openEdit}
                onDelete={actions.handleDelete}
            />
        ),
        [actions.openAddChild, actions.openEdit, actions.handleDelete],
    );

    if (isLoading) {
        return (
            <div className="flex justify-center p-12 gap-2 text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-brand)]" />
                <span className="text-sm font-medium">
                    Загрузка каталога...
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
                    {(error as any)?.message || 'Не удалось загрузить данные.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
                <h2 className="text-lg font-semibold text-slate-900">
                    Структура категорий
                </h2>
                <Button
                    onClick={actions.openCreateRoot}
                    className="gap-2 shadow-sm text-white transition-colors bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-active)]"
                >
                    <FolderPlus className="h-4 w-4" /> Корневая категория
                </Button>
            </div>

            {flatData.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg text-slate-400 bg-slate-50/50">
                    Дерево пусто.
                </div>
            ) : (
                <DndProvider
                    backend={HTML5Backend}
                    debugMode={false}
                >
                    <div className="overflow-x-auto min-h-[300px] relative pt-1">
                        <Tree
                            key="super-stable-tree"
                            ref={treeRef}
                            tree={flatData}
                            rootId="root"
                            onDrop={handleDrop}
                            initialOpen={true}
                            dropTargetOffset={10}
                            sort={sortTreeNodes}
                            canDrop={handleCanDrop}
                            placeholderRender={renderPlaceholder}
                            classes={TREE_CLASSES}
                            render={renderNode}
                        />
                    </div>
                </DndProvider>
            )}

            <CategoryFormModal
                isOpen={actions.isModalOpen}
                onClose={actions.closeModal}
                onSave={actions.handleSave}
                editNode={actions.activeEdit}
                parentNode={actions.activeParent}
            />
        </div>
    );
}
