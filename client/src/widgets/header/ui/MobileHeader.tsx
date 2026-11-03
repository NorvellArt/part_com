// @/widgets/mobile-header/ui/MobileHeader.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, Menu } from 'lucide-react';
import { buttonVariants } from '@/shared/components';
import { UserActionsDropdown } from '@/features/auth/ui/UserActionsDropdown'; // Импортируем наш дропдаун
import { Session } from 'next-auth';
import { MobileCatalogSheet } from '@/widgets/header-catalog-dropdown';

interface MobileHeaderProps {
    searchComponent: React.ReactNode;
    session: Session | null;
    isAdmin: boolean;
}

export function MobileHeader({
    searchComponent,
    session,
    isAdmin,
}: MobileHeaderProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    if (isSearchOpen) {
        return (
            <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-3 animate-in fade-in duration-200">
                <button
                    onClick={() => setIsSearchOpen(false)}
                    className={buttonVariants({
                        variant: 'ghost',
                        size: 'icon',
                        className: 'shrink-0',
                    })}
                    aria-label="Закрыть поиск"
                >
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </button>

                <div className="flex-1">{searchComponent}</div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
                <MobileCatalogSheet />

                <Link
                    href="/"
                    className="font-medium text-lg tracking-tight shrink-0 text-slate-900 select-none"
                >
                    <span className="font-bold text-[#1a4f95]">HD52</span>
                </Link>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className={buttonVariants({
                        variant: 'ghost',
                        size: 'icon-lg',
                    })}
                    aria-label="Открыть поиск"
                >
                    <Search className="h-5 w-5 text-slate-700" />
                </button>

                <UserActionsDropdown
                    session={session}
                    isAdmin={isAdmin}
                />
            </div>
        </div>
    );
}
