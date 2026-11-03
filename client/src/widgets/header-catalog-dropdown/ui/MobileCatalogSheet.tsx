'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, LayoutGrid, RotateCcw, ChevronRight } from 'lucide-react';
import { useCategoriesTree } from '@/entities/category';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    buttonVariants,
    Button,
    Separator,
} from '@/shared/components/';

export function MobileCatalogSheet() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { data: tree = [] } = useCategoriesTree();

    const handleClose = () => setIsOpen(false);

    return (
        <Sheet
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <SheetTrigger
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                aria-label="Открыть каталог"
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-slate-700" />
                ) : (
                    <Menu className="h-6 w-6 text-slate-700" />
                )}
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-full sm:max-w-md p-0 border-r-0 flex flex-col h-full bg-white select-none"
            >
                <SheetHeader className="p-4 border-b border-slate-100 flex flex-row items-center gap-2 space-y-0 h-16 shrink-0">
                    <SheetTitle className="text-left text-sm font-bold text-slate-800 flex items-center gap-2 tracking-wide uppercase text-[11px] opacity-80">
                        <LayoutGrid className="h-4 w-4 text-[#1a4f95]" />
                        <span>Разделы каталога</span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 h-11 rounded-xl font-medium text-sm border-slate-200/60 text-slate-600 hover:bg-slate-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                        onClick={() => {
                            handleClose();
                            router.push('/catalog');
                        }}
                    >
                        <RotateCcw className="h-4 w-4 text-slate-400" />
                        <span>Все товары</span>
                    </Button>

                    <Separator className="bg-slate-100/80" />

                    {tree.length === 0 ? (
                        <div className="p-8 text-center text-sm font-medium text-slate-400">
                            Каталог временно пуст.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {tree.map((root) => (
                                <div
                                    key={root.id}
                                    className="space-y-3"
                                >
                                    <Link
                                        href={`/catalog/${root.slug}`}
                                        onClick={handleClose}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-900 font-bold text-sm hover:bg-slate-100/50 hover:text-[#1a4f95] transition-colors group"
                                    >
                                        <span>{root.name}</span>
                                    </Link>

                                    {root.children &&
                                        root.children.length > 0 && (
                                            <div className="pl-2 space-y-4 border-l border-slate-100/80 ml-2">
                                                {root.children.map((lvl2) => (
                                                    <div
                                                        key={lvl2.id}
                                                        className="space-y-1"
                                                    >
                                                        <Link
                                                            href={`/catalog/${root.slug}/${lvl2.slug}`}
                                                            onClick={
                                                                handleClose
                                                            }
                                                            className="text-xs font-bold text-slate-800 hover:text-[#1a4f95] block px-2 py-1 transition-colors leading-tight"
                                                        >
                                                            {lvl2.name}
                                                        </Link>

                                                        {lvl2.children &&
                                                            lvl2.children
                                                                .length > 0 && (
                                                                <div className="pl-2 space-y-0.5">
                                                                    {lvl2.children.map(
                                                                        (
                                                                            lvl3,
                                                                        ) => (
                                                                            <Link
                                                                                key={
                                                                                    lvl3.id
                                                                                }
                                                                                href={`/catalog/${root.slug}/${lvl2.slug}/${lvl3.slug}`}
                                                                                onClick={
                                                                                    handleClose
                                                                                }
                                                                                className="text-xs text-slate-500 hover:text-[#256fc4] hover:bg-slate-50/80 block py-1.5 px-2 rounded-lg transition-all truncate leading-relaxed"
                                                                            >
                                                                                {
                                                                                    lvl3.name
                                                                                }
                                                                            </Link>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
