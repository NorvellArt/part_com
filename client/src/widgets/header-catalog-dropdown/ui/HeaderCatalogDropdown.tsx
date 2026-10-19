'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useCategoriesTree } from '@/entities/category';
import { CategoryNode } from '@/entities/category/model/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components';
import { CategoryRootsList } from './CategoryRootsList';
import { CategorySubTree } from './CategorySubTree';
import { cn } from 'cn';

export function HeaderCatalogDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: tree = [], isLoading } = useCategoriesTree();
    const [selectedRoot, setSelectedRoot] = useState<CategoryNode | null>(null);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && tree.length > 0 && !selectedRoot) {
            setSelectedRoot(tree[0]);
        }
    };

    const handleCloseMenu = () => setIsOpen(false);

    return (
        <Popover
            open={isOpen}
            onOpenChange={handleOpenChange}
        >
            <PopoverTrigger
                className={cn(
                    'group inline-flex shrink-0 items-center justify-center gap-2 font-semibold h-10 px-4 rounded-xl shadow-sm transition-all text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer',
                    isOpen
                        ? 'bg-blue-600 text-white border-transparent hover:bg-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                )}
            >
                {isOpen ? (
                    <X className="h-4 w-4" />
                ) : (
                    <Menu className="h-4 w-4" />
                )}
                <span>Каталог</span>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                sideOffset={12}
                className="w-[100%] p-0 border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden bg-white z-50"
            >
                {isLoading ? (
                    <div className="p-12 text-center text-xs text-slate-400 font-medium">
                        Загрузка структуры каталога...
                    </div>
                ) : tree.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-400">
                        Каталог временно пуст.
                    </div>
                ) : (
                    <div className="grid grid-cols-12 h-[500px]">
                        <CategoryRootsList
                            tree={tree}
                            selectedRoot={selectedRoot}
                            onSelectRoot={setSelectedRoot}
                            onCloseMenu={handleCloseMenu}
                        />

                        <CategorySubTree
                            selectedRoot={selectedRoot}
                            onCloseMenu={handleCloseMenu}
                        />
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
