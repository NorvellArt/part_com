import type { Metadata } from 'next';
import '@/app/globals.css';
import { Geist } from 'next/font/google';
import { cn } from 'cn';
import { Providers } from '@/app/providers';
import Link from 'next/link';
import { Suspense } from 'react';
import { HeaderSearch } from '@/features/search-products';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: 'NAME - Каталог деталей',
    description: 'Каталог автозапчастей',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="ru"
            className={cn('font-sans', geist.variable)}
        >
            <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col">
                <Providers>
                    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
                        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                            <Link
                                href="/"
                                className="font-bold text-lg text-slate-900 tracking-tight shrink-0"
                            >
                                NAME
                            </Link>

                            <div className="flex-1 max-w-md mx-auto flex justify-center">
                                <Suspense
                                    fallback={
                                        <div className="h-9 w-full max-w-sm bg-slate-100 rounded-md animate-pulse" />
                                    }
                                >
                                    <HeaderSearch />
                                </Suspense>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 container mx-auto px-4 py-6">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
