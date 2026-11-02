'use client';

import { Loader2, LogOut } from 'lucide-react';
import { useLogout } from '@/features/auth/model/useLogout';
import { DropdownMenuItem } from '@/shared/components/ui/dropdown-menu';

export function LogoutButton() {
    const { logout, isPending } = useLogout();

    return (
        <DropdownMenuItem
            onClick={(e) => {
                if (isPending) {
                    e.preventDefault();
                    return;
                }
                logout();
            }}
            disabled={isPending}
            className="cursor-pointer flex items-center gap-2 w-full"
        >
            {isPending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Выход...</span>
                </>
            ) : (
                <>
                    <LogOut className="h-4 w-4" />
                    <span>Выйти</span>
                </>
            )}
        </DropdownMenuItem>
    );
}
