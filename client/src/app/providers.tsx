'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/lib';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}
