'use client';

import Link from 'next/link';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { CategoryNode } from '@/entities/category/model/types';
import { Button, Separator } from '@/shared/components';

interface MobileCatalogRootsProps {
    tree: CategoryNode[];
    onSelectRoot: (root: CategoryNode) => void;
    onClose: () => void;
    onReset: () => void;
}

export function MobileCatalogRoots({
    tree,
    onSelectRoot,
    onClose,
    onReset,
}: MobileCatalogRootsProps) {
    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 h-10 rounded-xl font-medium text-xs mb-2 shrink-0 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                onClick={onReset}
            >
                <RotateCcw className="h-4 w-4 text-slate-400" />
                <span>Все товары</span>
            </Button>

            <Separator className="mb-2 bg-slate-100" />

            {tree.map((root) => (
                <div
                    key={root.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                    <Link
                        href={`/catalog/${root.slug}`}
                        onClick={onClose}
                        className="text-xs font-medium text-slate-700 flex-1 py-1 truncate"
                    >
                        {root.name}
                    </Link>
                    {root.children && root.children.length > 0 && (
                        <button
                            onClick={() => onSelectRoot(root)}
                            className="pl-4 pr-2 py-2 text-slate-400 hover:text-blue-600 cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ))}
        </>
    );
}
