'use client';

import { useState } from 'react';
import { CategoryNode } from '@/entities/category/model/types';

interface CategoryTreeNodeProps {
    node: CategoryNode;
    onAddChild: (parent: CategoryNode) => void;
    onEdit: (node: CategoryNode) => void;
    onDelete: (id: string) => Promise<void>;
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
        <div className="ml-4 my-2 border-l-2 border-gray-200 pl-4">
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                    {hasChildren && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-500 hover:text-black text-xs font-bold"
                        >
                            {isOpen ? '▼' : '▶'}
                        </button>
                    )}
                    <span className="font-medium text-gray-800">
                        {node.name}
                    </span>
                    <span className="text-xs text-gray-400">/{node.slug}</span>
                </div>

                <div className="flex gap-2">
                    {/* FDD / Бизнес-требование: Запрет создания 4-го уровня (если уровень родителя >= 3) */}
                    <button
                        onClick={() => onAddChild(node)}
                        disabled={node.level >= 3}
                        className={`text-xs px-2 py-1 rounded ${
                            node.level >= 3
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        + Подкатегория
                    </button>
                    <button
                        onClick={() => onEdit(node)}
                        className="text-xs bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600"
                    >
                        Изменить
                    </button>
                    <button
                        onClick={() => onDelete(node.id)}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                        Удалить
                    </button>
                </div>
            </div>

            {isOpen && hasChildren && (
                <div className="mt-1">
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
