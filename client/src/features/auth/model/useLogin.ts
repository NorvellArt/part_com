'use client';

import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { LoginCredentialsDto } from '@/entities/session';
import { useRouter, useSearchParams } from 'next/navigation';

export function useLogin() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    return useMutation({
        mutationFn: async (credentials: LoginCredentialsDto) => {
            const result = await signIn('credentials', {
                email: credentials.email,
                password: credentials.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error('Неверный Email или пароль');
            }

            return result;
        },
        onSuccess: () => {
            router.push(callbackUrl);
            router.refresh();
        },
    });
}