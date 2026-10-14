'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
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
        onSuccess: async (_data, variables) => {
            try {
                const result = await signIn('credentials', {
                    email: variables.email,
                    password: variables.password,
                    redirect: false,
                });

                if (result?.error) {
                    router.push('/login');
                } else {
                    router.push('/');
                    router.refresh();
                }
            } catch (error) {
                console.error('Ошибка автоматического входа после регистрации:', error);
                router.push('/login');
            }
        },
    });
}
