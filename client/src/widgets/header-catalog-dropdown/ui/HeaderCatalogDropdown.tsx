'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useCategoriesTree } from '@/entities/category';
import { CategoryNode } from '@/entities/category/model/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components';
import { CategoryRootsList } from './CategoryRootsList';
import { CategorySubTree } from './CategorySubTree';
import { cn } from 'cn';

export function HeaderCatalogDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: tree = [] } = useCategoriesTree();
    const [selectedRoot, setSelectedRoot] = useState<CategoryNode | null>(null);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && tree.length > 0 && !selectedRoot) {
            setSelectedRoot(tree[0]);
        }
    };

    const handleCloseMenu = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            handleCloseMenu();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    return (
        <Popover
            open={isOpen}
            onOpenChange={handleOpenChange}
        >
            <PopoverTrigger
                className={cn(
                    'group inline-flex shrink-0 items-center justify-center gap-2 font-medium h-10 px-4 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-200 text-sm border focus:outline-none cursor-pointer select-none tracking-wide',
                    isOpen
                        ? 'bg-[#1a4f95] text-white border-transparent hover:bg-[#15417b]'
                        : 'bg-white text-slate-600 border-slate-200/60 hover:bg-slate-50 hover:text-[#1a4f95] hover:border-slate-300',
                )}
            >
                <div className="transition-transform duration-200 group-data-[state=open]:rotate-90">
                    {isOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Menu className="h-4 w-4" />
                    )}
                </div>
                <span>Каталог</span>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                sideOffset={8}
                className="w-[920px] max-w-[calc(100vw-32px)] p-0 border border-slate-200/60 rounded-2xl shadow-xl overflow-hidden bg-white z-50"
            >
                {tree.length === 0 ? (
                    <div className="p-12 text-center text-sm font-medium text-slate-400/80">
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
