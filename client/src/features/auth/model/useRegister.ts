'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { RegisterCredentialsDto } from '@/entities/session';

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: RegisterCredentialsDto) => {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Ошибка при регистрации');
            }

            return res.json();
        },
        onSuccess: () => {
            router.push('/login?registered=true');
        },
    });
}