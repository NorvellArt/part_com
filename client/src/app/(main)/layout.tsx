import Link from 'next/link';
import { Suspense } from 'react';
import { HeaderSearch } from '@/features/search-products';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/entities/session';
import { HeaderCatalogDropdown } from '@/widgets/header-catalog-dropdown';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';
import { categoryApi, categoryKeys } from '@/entities/category';
import { MobileHeader } from '@/widgets/header';
import { UserActionsDropdown } from '@/features/auth/ui/UserActionsDropdown';

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.roles?.includes('ADMIN');

    const queryClient = new QueryClient();
    await queryClient.query({
        queryKey: categoryKeys.trees(),
        queryFn: ({ signal }) => categoryApi.getTree(signal),
    });

    return (
        <>
            <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
                <div className="hidden md:flex mx-auto max-w-7xl px-4 h-16 items-center justify-between gap-4">
                    <div className="flex items-center gap-6 shrink-0">
                        <Link
                            href="/"
                            className="font-medium text-lg tracking-tight text-slate-900 select-none"
                        >
                            <span className="font-bold text-[#1a4f95]">HD</span>
                            <span>market</span>
                            <span className="font-bold text-[#1a4f95]">52</span>
                        </Link>

                        <HydrationBoundary state={dehydrate(queryClient)}>
                            <div className="shrink-0">
                                <HeaderCatalogDropdown />
                            </div>
                        </HydrationBoundary>
                    </div>
                    <div className="flex-1 max-w-md mx-auto flex justify-center">
                        <Suspense
                            fallback={
                                <div className="h-9 w-full bg-slate-100 rounded-md animate-pulse" />
                            }
                        >
                            <HeaderSearch />
                        </Suspense>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <UserActionsDropdown
                            session={session}
                            isAdmin={!!isAdmin}
                        />
                    </div>
                </div>

                <div className="md:hidden">
                    <MobileHeader
                        session={session}
                        isAdmin={!!isAdmin}
                        searchComponent={
                            <Suspense
                                fallback={
                                    <div className="h-9 w-full bg-slate-100 rounded-md animate-pulse" />
                                }
                            >
                                <HeaderSearch autoFocus />
                            </Suspense>
                        }
                    />
                </div>
            </header>

            <main className="container mx-auto max-w-7xl p-4 md:p-6 w-full space-y-4">
                {children}
            </main>
        </>
    );
}
