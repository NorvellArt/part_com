'use client';

import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useLogout } from '@/features/auth/model/useLogout';

export function LogoutButton() {
    const { logout, isPending } = useLogout();

    return (
        <Button
            onClick={() => logout()}
            disabled={isPending}
            variant="outline"
            size="sm"
            className="gap-2"
        >
            {isPending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Выход...</span>
                </>
            ) : (
                <>
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    <span>Выйти</span>
                </>
            )}
        </Button>
    );
}
