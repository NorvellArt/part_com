import type { Metadata } from 'next';
import '@/app/globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from '@/app/providers';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: 'PartCom - Каталог деталей',
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
            <body className="antialiased bg-slate-50 text-slate-900">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
