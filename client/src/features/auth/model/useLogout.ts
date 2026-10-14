'use client';

import { fetchApi } from '@/shared';
import { useMutation } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';

export function useLogout() {
    const { data: session } = useSession();

    const { mutate: logout, isPending } = useMutation({
        mutationFn: async () => {
            return await fetchApi(`/api/users/revoke-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: session?.sessionId || null,
                }),
            });

        },
        onSettled: () => {
            signOut({ callbackUrl: '/' });
        },
    });

    return {
        logout,
        isPending,
    };
}
