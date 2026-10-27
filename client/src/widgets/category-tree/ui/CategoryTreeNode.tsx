'use client';

import { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    FolderPlus,
    Pencil,
    Trash2,
} from 'lucide-react';
import { CategoryNode } from '@/entities/category/model/types';
import { Button } from '@/shared/components';

interface CategoryTreeNodeProps {
    node: CategoryNode;
    onAddChild: (parent: CategoryNode) => void;
    onEdit: (node: CategoryNode) => void;
    onDelete: (id: string) => void;
}

export function CategoryTreeNode({
    node,
    onAddChild,
    onEdit,
    onDelete,
}: CategoryTreeNodeProps) {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="ml-4 my-1 border-l-2 border-slate-100 pl-4">
            <div className="flex items-center justify-between p-2 hover:bg-slate-50/80 rounded-lg bg-white border border-slate-200/60 shadow-sm transition-colors group">
                <div className="flex items-center gap-2">
                    {hasChildren ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-slate-500 hover:text-slate-900"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    ) : (
                        <div className="w-5" />
                    )}
                    <span className="font-medium text-sm text-slate-800">
                        {node.name}
                    </span>
                    <span className="text-xs text-slate-400 select-all font-mono">
                        /{node.slug}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        Lvl {node.level}
                    </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        disabled={node.level >= 3}
                        onClick={() => onAddChild(node)}
                    >
                        <FolderPlus className="h-3.5 w-3.5" />
                        <span className="text-xs">Подкатегория</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={() => onEdit(node)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={hasChildren}
                        onClick={() => onDelete(node.id)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {isOpen && hasChildren && (
                <div className="mt-1 space-y-1">
                    {node.children.map((child) => (
                        <CategoryTreeNode
                            key={child.id}
                            node={child}
                            onAddChild={onAddChild}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
