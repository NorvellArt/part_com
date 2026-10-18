'use client';

import { LayoutGrid, RotateCcw, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CategoryNode } from '@/entities/category/model/types';
import { Button, Separator, ScrollArea } from '@/shared/components';
import { cn } from 'cn';

interface CategoryRootsListProps {
    tree: CategoryNode[];
    selectedRoot: CategoryNode | null;
    onSelectRoot: (node: CategoryNode) => void;
    onCloseMenu: () => void;
}

export function CategoryRootsList({
    tree,
    selectedRoot,
    onSelectRoot,
    onCloseMenu,
}: CategoryRootsListProps) {
    const router = useRouter();

    const handleReset = () => {
        onCloseMenu();
        router.push('/catalog');
    };

    return (
        <aside className="col-span-3 border-r border-slate-100 bg-slate-50/50 p-3 flex flex-col h-full">
            <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 px-3 mb-2 shrink-0">
                <LayoutGrid className="h-3.5 w-3.5 text-blue-600" />
                <span>Разделы каталога</span>
            </div>

            <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 h-9 rounded-xl font-medium text-xs mb-2 shrink-0 border-slate-200 text-slate-600 hover:bg-white transition-colors"
                onClick={handleReset}
            >
                <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                <span>Все товары</span>
            </Button>

            <Separator className="mb-2 bg-slate-200/60 shrink-0" />

            <ScrollArea className="flex-1 pr-1">
                <div className="space-y-0.5">
                    {tree.map((rootNode) => {
                        const isSelected = selectedRoot?.id === rootNode.id;
                        return (
                            <button
                                key={rootNode.id}
                                type="button"
                                onMouseEnter={() => onSelectRoot(rootNode)}
                                onClick={() => onSelectRoot(rootNode)}
                                className={cn(
                                    'w-full flex items-center justify-between text-left text-xs px-3 py-2.5 rounded-xl font-medium transition-all border border-transparent group',
                                    isSelected
                                        ? 'bg-white text-blue-600 font-semibold shadow-sm border-slate-200/60'
                                        : 'text-slate-600 hover:bg-white hover:text-slate-900',
                                )}
                            >
                                <span className="line-clamp-1">
                                    {rootNode.name}
                                </span>
                                <ChevronRight
                                    className={cn(
                                        'h-3.5 w-3.5 opacity-20 group-hover:opacity-100 transition-opacity shrink-0 ml-1',
                                        isSelected &&
                                            'text-blue-600 opacity-100',
                                    )}
                                />
                            </button>
                        );
                    })}
                </div>
            </ScrollArea>
        </aside>
    );
}
