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
        <aside className="col-span-4 border-r border-slate-100 bg-slate-50/50 p-4 flex flex-col h-full select-none">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800 px-2 mb-3 shrink-0 tracking-wide uppercase text-[11px] opacity-80">
                <LayoutGrid className="h-4 w-4 text-[#1a4f95]" />
                <span>Разделы каталога</span>
            </div>

            <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 h-10 rounded-xl font-medium text-sm mb-3 shrink-0 border-slate-200/60 text-slate-600 hover:bg-white hover:text-[#1a4f95] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                onClick={handleReset}
            >
                <RotateCcw className="h-4 w-4 text-slate-400" />
                <span>Все товары</span>
            </Button>

            <Separator className="mb-3 bg-slate-200/50 shrink-0" />

            <ScrollArea className="flex-1 pr-1">
                <div className="space-y-1">
                    {tree.map((rootNode) => {
                        const isSelected = selectedRoot?.id === rootNode.id;
                        return (
                            <button
                                key={rootNode.id}
                                type="button"
                                onMouseEnter={() => onSelectRoot(rootNode)}
                                onClick={() => onSelectRoot(rootNode)}
                                className={cn(
                                    'w-full flex items-center justify-between text-left text-sm px-3 py-2.5 rounded-xl font-medium transition-all border border-transparent group cursor-pointer',
                                    isSelected
                                        ? 'bg-white text-[#1a4f95] font-semibold shadow-sm border-slate-200/60'
                                        : 'text-slate-600 hover:bg-white hover:text-slate-900',
                                )}
                            >
                                <span className="line-clamp-1">
                                    {rootNode.name}
                                </span>
                                <ChevronRight
                                    className={cn(
                                        'h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:text-[#1a4f95] transition-all shrink-0 ml-1',
                                        isSelected &&
                                            'text-[#1a4f95] opacity-100 translate-x-0.5',
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
