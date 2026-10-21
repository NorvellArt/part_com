import { Suspense } from 'react';
import { CatalogContent } from '@/widgets/product-catalog/CatalogContent';
import { Breadcrumbs } from '@/features/breadcrumbs';

interface PageProps {
    params: Promise<{ categorySlug?: string[] }>;
    searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function CatalogPage({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const slugs = resolvedParams.categorySlug ?? [];
    const activeCategorySlug = slugs[slugs.length - 1] ?? null;

    const query = resolvedSearchParams.q ?? '';
    const page = Number(resolvedSearchParams.page) || 1;

    return (
        <div className="w-full py-2 space-y-2">
            {slugs.length > 0 && <Breadcrumbs slugs={slugs} />}

            <Suspense
                key={`${activeCategorySlug}-${query}-${page}`}
                fallback={
                    <div className="text-center py-12 text-muted-foreground">
                        Загрузка каталога автозапчастей...
                    </div>
                }
            >
                <CatalogContent
                    categorySlug={activeCategorySlug}
                    query={query}
                    page={page}
                />
            </Suspense>
        </div>
    );
}
