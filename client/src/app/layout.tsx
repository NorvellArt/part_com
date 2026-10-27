import type { Metadata } from 'next';
import '@/app/globals.css';
import { Geist } from 'next/font/google';
import { cn } from 'cn';
import { Providers } from '@/app/providers';
import { Toaster } from '@/shared/components';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: 'hdmarket52 - Каталог деталей',
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
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
