'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CategoryNode } from '@/entities/category/model/types';

interface MobileCatalogLvl2Props {
    selectedRoot: CategoryNode;
    onSelectLvl2: (node: CategoryNode) => void;
    onClose: () => void;
}

export function MobileCatalogLvl2({
    selectedRoot,
    onSelectLvl2,
    onClose,
}: MobileCatalogLvl2Props) {
    return (
        <>
            <Link
                href={`/catalog/${selectedRoot.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/50 text-slate-800 hover:text-[#1a4f95] text-sm font-bold mb-4 border border-slate-200/60 transition-all group select-none"
            >
                <span>Посмотреть всю категорию: {selectedRoot.name}</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#1a4f95] group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>

            {selectedRoot.children.length === 0 ? (
                <div className="text-slate-400 text-sm font-medium py-4 px-2 select-none">
                    В этой секции пока нет подкатегорий.
                </div>
            ) : (
                <div className="space-y-1">
                    {selectedRoot.children.map((lvl2) => (
                        <div
                            key={lvl2.id}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/70 transition-colors group"
                        >
                            <Link
                                href={`/catalog/${selectedRoot.slug}/${lvl2.slug}`}
                                onClick={onClose}
                                className="text-base font-bold text-slate-900 hover:text-[#1a4f95] flex-1 py-2.5 truncate transition-colors tracking-tight"
                            >
                                {lvl2.name}
                            </Link>
                            {lvl2.children && lvl2.children.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => onSelectLvl2(lvl2)}
                                    className="pl-5 pr-2 py-3 text-slate-400 hover:text-[#1a4f95] cursor-pointer transition-colors active:scale-95"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
