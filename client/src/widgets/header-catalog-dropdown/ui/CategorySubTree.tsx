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
            <div className="col-span-9 text-center py-12 text-slate-400 text-xs my-auto">
                Выберите категорию из списка слева.
            </div>
        );
    }

    return (
        <section className="col-span-9 p-6 h-full flex flex-col">
            <div className="border-b border-slate-100 pb-3 shrink-0">
                <Link
                    href={`/catalog/${selectedRoot.slug}`}
                    onClick={onCloseMenu}
                    className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 group"
                >
                    <span>Посмотреть всю категорию: {selectedRoot.name}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </Link>
            </div>

            {selectedRoot.children.length === 0 ? (
                <div className="text-slate-400 text-xs py-8">
                    В этой секции пока нет подкатегорий.
                </div>
            ) : (
                <ScrollArea className="flex-1 pr-2 mt-4">
                    <div className="grid grid-cols-3 gap-x-8 gap-y-8 pb-4">
                        {selectedRoot.children.map((lvl2Node) => (
                            <div
                                key={lvl2Node.id}
                                className="space-y-2"
                            >
                                {/* Уровень 2: Жирный заголовок */}
                                <Link
                                    href={`/catalog/${selectedRoot.slug}/${lvl2Node.slug}`}
                                    onClick={onCloseMenu}
                                    className="font-bold text-xs text-slate-900 hover:text-blue-600 block transition-colors tracking-tight"
                                >
                                    {lvl2Node.name}
                                </Link>

                                {/* Уровень 3: Ссылки списком */}
                                {lvl2Node.children &&
                                    lvl2Node.children.length > 0 && (
                                        <ul className="space-y-1.5 border-l border-slate-100 pl-2">
                                            {lvl2Node.children.map(
                                                (lvl3Node) => (
                                                    <li key={lvl3Node.id}>
                                                        <Link
                                                            href={`/catalog/${selectedRoot.slug}/${lvl2Node.slug}/${lvl3Node.slug}`}
                                                            onClick={
                                                                onCloseMenu
                                                            }
                                                            className="text-[11px] text-slate-500 hover:text-blue-600 transition-colors block py-0.5 line-clamp-1"
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
