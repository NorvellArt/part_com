'use client';

import { NodeModel, RenderParams } from '@minoru/react-dnd-treeview';
import {
    GripVertical,
    FolderPlus,
    Pencil,
    Trash2,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';
import { CategoryNode } from '@/entities/category/model/types';
import { Button } from '@/shared/components';

interface CategoryTreeNodeProps {
    node: NodeModel<CategoryNode>;
    params: RenderParams;
    onAddChild: (parent: CategoryNode) => void;
    onEdit: (node: CategoryNode) => void;
    onDelete: (node: CategoryNode) => void;
}

export function CategoryTreeNode({
    node,
    params,
    onAddChild,
    onEdit,
    onDelete,
}: CategoryTreeNodeProps) {
    const originalNode = node.data!;
    const hasChildren =
        originalNode.children && originalNode.children.length > 0;

    return (
        <div
            style={{ marginLeft: params.depth * 24 }}
            className="py-[3px] my-[1px] transition-all duration-200"
        >
            <div
                className={`flex items-center justify-between p-2.5 rounded-lg border shadow-sm select-none bg-white transition-all duration-150 group
                    ${
                        params.isDragging
                            ? 'shadow-md border-blue-400 opacity-40 bg-blue-50/10'
                            : 'border-slate-200/80 hover:bg-slate-50/80'
                    }
                    ${
                        params.isDropTarget
                            ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-500/10 scale-[1.01]'
                            : ''
                    }
                `}
            >
                <div className="flex items-center gap-2">
                    <div
                        ref={
                            params.handleRef as React.RefObject<HTMLDivElement>
                        }
                        className={`p-1 rounded transition-colors cursor-grab active:cursor-grabbing
                            ${params.isDragging ? 'text-blue-600 bg-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}
                        `}
                        title="Перетащить категорию"
                    >
                        <GripVertical className="h-4 w-4" />
                    </div>

                    {hasChildren ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-slate-500 hover:text-slate-900"
                            onClick={params.onToggle}
                        >
                            {params.isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    ) : (
                        <div className="w-5" />
                    )}

                    <span className="font-medium text-sm text-slate-800">
                        {node.text}
                    </span>
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline select-all">
                        /{originalNode.slug}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        Lvl {originalNode.level}
                    </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-1.5 text-blue-600 hover:bg-blue-50 disabled:opacity-40"
                        disabled={originalNode.level >= 3}
                        onClick={() => onAddChild(originalNode)}
                    >
                        <FolderPlus className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600"
                        onClick={() => onEdit(originalNode)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        disabled={hasChildren}
                        onClick={() => onDelete(originalNode)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
