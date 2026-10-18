import Link from 'next/link';
import { Suspense } from 'react';
import { HeaderSearch } from '@/features/search-products';
import { buttonVariants } from '@/shared/components';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/entities/session';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import { ShieldCheck } from 'lucide-react';
import { HeaderCatalogDropdown } from '@/widgets/header-catalog-dropdown';

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.roles?.includes('ADMIN');

    return (
        <>
            <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="font-bold text-lg text-slate-900 tracking-tight shrink-0"
                    >
                        NAME
                    </Link>

                    <div className="shrink-0">
                        <HeaderCatalogDropdown />
                    </div>

                    <div className="flex-1 max-w-md mx-auto flex justify-center">
                        <Suspense
                            fallback={
                                <div className="h-9 w-full max-w-sm bg-slate-100 rounded-md animate-pulse" />
                            }
                        >
                            <HeaderSearch />
                        </Suspense>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {session?.user ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className={buttonVariants({
                                            variant: 'outline',
                                            size: 'sm',
                                            className:
                                                'gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50',
                                        })}
                                    >
                                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                                        Администрирование
                                    </Link>
                                )}
                                <span className="text-sm font-medium text-slate-700 px-3 py-1">
                                    {session.user.email}
                                </span>
                                <LogoutButton />
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={buttonVariants({
                                        variant: 'ghost',
                                        size: 'sm',
                                    })}
                                >
                                    Войти
                                </Link>
                                <Link
                                    href="/register"
                                    className={buttonVariants({ size: 'sm' })}
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
                {children}
            </main>
        </>
    );
}
