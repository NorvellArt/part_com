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
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/50 text-slate-800 hover:text-[#1a4f95] text-sm font-bold mb-4 border border-slate-200/60 transition-all group select-none"
            >
                <span>Посмотреть подраздел: {selectedLvl2.name}</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#1a4f95] group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>

            <div className="border-l-2 border-slate-100 pl-3 space-y-1">
                {selectedLvl2.children.map((lvl3) => (
                    <Link
                        key={lvl3.id}
                        href={`/catalog/${selectedRoot.slug}/${selectedLvl2.slug}/${lvl3.slug}`}
                        onClick={onClose}
                        className="flex items-center p-3 text-l text-slate-600 hover:text-[#256fc4] rounded-xl hover:bg-slate-50/60 transition-colors truncate block font-bold"
                    >
                        {lvl3.name}
                    </Link>
                ))}
            </div>
        </>
    );
}
