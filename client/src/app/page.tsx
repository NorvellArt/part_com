import { Suspense } from 'react';
import { CatalogContent } from '@/widgets/product-catalog/CatalogContent';

interface PageProps {
    searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q ?? '';
    const page = Number(resolvedParams.page) || 1;

    return (
        <main className="container mx-auto p-6">
            <Suspense
                key={`${query}-${page}`}
                fallback={
                    <div className="text-center py-12 text-muted-foreground">
                        Загрузка каталога автозапчастей...
                    </div>
                }
            >
                <CatalogContent
                    query={query}
                    page={page}
                />
            </Suspense>
        </main>
    );
}
