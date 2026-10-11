'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { RegisterCredentialsDto } from '@/entities/session';
import { fetchApi } from '@/shared';

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: RegisterCredentialsDto) => {
            return await fetchApi('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
        },
        onSuccess: () => {
            router.push('/login?registered=true');
        },
    });
}