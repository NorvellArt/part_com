'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CategoryNode } from '@/entities/category/model/types';
import { ScrollArea } from '@/shared/components';

interface CategorySubTreeProps {
    selectedRoot: CategoryNode | null;
    onCloseMenu: () => void;
}

export function CategorySubTree({
    selectedRoot,
    onCloseMenu,
}: CategorySubTreeProps) {
    if (!selectedRoot) {
        return (
            <div className="col-span-8 text-center py-12 text-slate-400 text-sm font-medium my-auto select-none">
                Выберите категорию из списка слева.
            </div>
        );
    }

    return (
        <section className="col-span-8 p-6 h-full flex flex-col bg-white">
            <div className="border-b border-slate-100 pb-4 shrink-0">
                <Link
                    href={`/catalog/${selectedRoot.slug}`}
                    onClick={onCloseMenu}
                    className="text-base font-bold text-slate-900 hover:text-[#1a4f95] transition-colors inline-flex items-center gap-1.5 group select-none"
                >
                    <span>Посмотреть всю категорию: {selectedRoot.name}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#1a4f95] group-hover:translate-x-0.5 transition-all" />
                </Link>
            </div>

            {selectedRoot.children.length === 0 ? (
                <div className="text-slate-400 text-sm font-medium py-8 select-none">
                    В этой секции пока нет подкатегорий.
                </div>
            ) : (
                <ScrollArea className="flex-1 pr-2 mt-5">
                    <div className="grid grid-cols-3 gap-x-8 gap-y-6 pb-4">
                        {selectedRoot.children.map((lvl2Node) => (
                            <div
                                key={lvl2Node.id}
                                className="space-y-2.5"
                            >
                                <Link
                                    href={`/catalog/${selectedRoot.slug}/${lvl2Node.slug}`}
                                    onClick={onCloseMenu}
                                    className="font-bold text-sm text-slate-900 hover:text-[#1a4f95] block transition-colors tracking-tight leading-tight"
                                >
                                    {lvl2Node.name}
                                </Link>

                                {lvl2Node.children &&
                                    lvl2Node.children.length > 0 && (
                                        <ul className="space-y-1.5 border-l border-slate-100 pl-2.5">
                                            {lvl2Node.children.map(
                                                (lvl3Node) => (
                                                    <li key={lvl3Node.id}>
                                                        <Link
                                                            href={`/catalog/${selectedRoot.slug}/${lvl2Node.slug}/${lvl3Node.slug}`}
                                                            onClick={
                                                                onCloseMenu
                                                            }
                                                            className="text-xs text-slate-500 hover:text-[#256fc4] transition-colors block py-0.5 line-clamp-1 leading-relaxed"
                                                            title={
                                                                lvl3Node.name
                                                            }
                                                        >
                                                            {lvl3Node.name}
                                                        </Link>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </section>
    );
}
