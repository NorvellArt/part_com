'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CategoryNode } from '@/entities/category/model/types';

interface MobileCatalogLvl3Props {
    selectedRoot: CategoryNode;
    selectedLvl2: CategoryNode;
    onClose: () => void;
}

export function MobileCatalogLvl3({
    selectedRoot,
    selectedLvl2,
    onClose,
}: MobileCatalogLvl3Props) {
    return (
        <>
            <Link
                href={`/catalog/${selectedRoot.slug}/${selectedLvl2.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-900 text-xs font-bold mb-3 border border-slate-200/60"
            >
                <span>Посмотреть подраздел: {selectedLvl2.name}</span>
                <ChevronRight className="h-4 w-4" />
            </Link>

            <div className="border-l border-slate-100 pl-2 space-y-0.5">
                {selectedLvl2.children.map((lvl3) => (
                    <Link
                        key={lvl3.id}
                        href={`/catalog/${selectedRoot.slug}/${selectedLvl2.slug}/${lvl3.slug}`}
                        onClick={onClose}
                        className="flex items-center p-2.5 text-xs text-slate-600 hover:text-blue-600 rounded-xl hover:bg-slate-50/50 transition-colors truncate block"
                    >
                        {lvl3.name}
                    </Link>
                ))}
            </div>
        </>
    );
}
