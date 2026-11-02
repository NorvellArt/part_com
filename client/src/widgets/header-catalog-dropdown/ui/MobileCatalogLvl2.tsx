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
                className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 text-blue-600 text-xs font-bold mb-3 border border-blue-100/50"
            >
                <span>Посмотреть всю категорию: {selectedRoot.name}</span>
                <ChevronRight className="h-4 w-4" />
            </Link>

            {selectedRoot.children.length === 0 ? (
                <div className="text-slate-400 text-xs py-4 px-2">
                    В этой секции пока нет подкатегорий.
                </div>
            ) : (
                selectedRoot.children.map((lvl2) => (
                    <div
                        key={lvl2.id}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                        <Link
                            href={`/catalog/${selectedRoot.slug}/${lvl2.slug}`}
                            onClick={onClose}
                            className="text-xs font-bold text-slate-900 flex-1 py-1 truncate"
                        >
                            {lvl2.name}
                        </Link>
                        {lvl2.children && lvl2.children.length > 0 && (
                            <button
                                onClick={() => onSelectLvl2(lvl2)}
                                className="pl-4 pr-2 py-2 text-slate-400 hover:text-blue-600 cursor-pointer"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))
            )}
        </>
    );
}
