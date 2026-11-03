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
                className="w-full justify-start gap-2 h-11 rounded-xl font-medium text-sm mb-3 shrink-0 border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:text-[#1a4f95] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                onClick={onReset}
            >
                <RotateCcw className="h-4 w-4 text-slate-400" />
                <span>Все товары</span>
            </Button>

            <Separator className="mb-3 bg-slate-100/80" />

            <div className="space-y-0.5">
                {tree.map((root) => (
                    <div
                        key={root.id}
                        className="flex items-center justify-between p-1 px-2 rounded-xl hover:bg-slate-50/70 transition-colors group"
                    >
                        <Link
                            href={`/catalog/${root.slug}`}
                            onClick={onClose}
                            className="text-xs font-semibold text-slate-700 hover:text-[#1a4f95] flex-1 py-1 truncate transition-colors"
                        >
                            {root.name}
                        </Link>
                        {root.children && root.children.length > 0 && (
                            <button
                                type="button"
                                onClick={() => onSelectRoot(root)}
                                className="pl-4 pr-2 py-1.5 text-slate-400 hover:text-[#1a4f95] cursor-pointer transition-colors active:scale-95"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
