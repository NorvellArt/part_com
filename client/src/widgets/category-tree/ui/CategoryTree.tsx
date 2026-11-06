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

const ROOT_ID = 'root';

const TREE_CLASSES = {
    root: 'space-y-2 p-2 pt-2 pb-4 rounded-xl min-h-[400px] transition-colors duration-200',
    placeholder: 'relative',
    dropTarget:
        'border border-dashed rounded-lg scale-[0.99] bg-[var(--color-brand-light)] border-[var(--color-brand)]',
    draggingSource: 'opacity-10 pointer-events-none',
};

export function CategoryTree() {
    const { data: tree = [], isLoading, isError, error } = useCategoriesTree();
    const moveCategoryMutation = useMoveCategory();
    const treeRef = useRef<TreeMethods>(null);
    const actions = useCategoryActions(treeRef);

    const flatData = useMemo<NodeModel<CategoryNode>[]>(() => {
        const result: NodeModel<CategoryNode>[] = [];

        const flatten = (
            nodes: CategoryNode[],
            parentId: string | number = ROOT_ID,
            level = 1,
        ) => {
            const sortedNodes = [...nodes].sort(
                (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
            );

            sortedNodes.forEach((node, index) => {
                result.push({
                    id: node.id,
                    parent: parentId,
                    text: node.name,
                    data: {
                        ...node,
                        level,
                        sortOrder: index,
                    },
                });

                if (node.children?.length) {
                    flatten(node.children, node.id, level + 1);
                }
            });
        };

        flatten(tree);

        return result;
    }, [tree]);

    const handleCanDrop = useCallback(
        (
            tree: NodeModel<CategoryNode>[],
            { dragSource, dropTargetId }: DropOptions<CategoryNode>,
        ) => {
            if (!dragSource) {
                return false;
            }
            
            return dragSource.parent === dropTargetId;
        },
        [],
    );

    const handleDrop = useCallback(
        (
            newTree: NodeModel<CategoryNode>[],
            options: DropOptions<CategoryNode>,
        ) => {
            const { dragSourceId, dragSource } = options;

            if (!dragSource || dragSourceId === undefined) {
                return;
            }

            const sourceId = dragSourceId as string;

            const newParentId = dragSource.parent;

            const siblings = newTree.filter(
                (node) => node.parent === newParentId,
            );

            const newSortOrder = siblings.findIndex(
                (node) => node.id === dragSourceId,
            );

            if (newSortOrder === -1) {
                return;
            }

            const oldSortOrder = dragSource.data?.sortOrder ?? 0;

            if (oldSortOrder === newSortOrder) {
                return;
            }

            moveCategoryMutation.mutate(
                {
                    id: sourceId,
                    data: {
                        newParentId:
                            newParentId === ROOT_ID
                                ? null
                                : (newParentId as string),
                        newSortOrder,
                    },
                },
                {
                    onSuccess: () => {
                        if (newParentId !== ROOT_ID) {
                            treeRef.current?.open(newParentId);
                        }
                    },
                    onError: (err: Error) => {
                        toast.add({
                            type: 'error',
                            title: err.message || 'Ошибка изменения порядка',
                            priority: 'high',
                        });
                    },
                },
            );
        },
        [moveCategoryMutation],
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
                    {(error as Error)?.message ||
                        'Не удалось загрузить данные.'}
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
                    <FolderPlus className="h-4 w-4" />
                    Корневая категория
                </Button>
            </div>

            {flatData.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg text-slate-400 bg-slate-50/50">
                    Дерево пусто.
                </div>
            ) : (
                <DndProvider backend={HTML5Backend}>
                    <div className="overflow-x-auto min-h-[300px] relative pt-1">
                        <Tree
                            ref={treeRef}
                            tree={flatData}
                            rootId={ROOT_ID}
                            onDrop={handleDrop}
                            canDrop={handleCanDrop}
                            sort={false}
                            insertDroppableFirst={false}
                            initialOpen={true}
                            dropTargetOffset={10}
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
