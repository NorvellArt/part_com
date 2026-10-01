import { Suspense } from 'react';
import { CatalogContent } from '@/widgets/product-catalog/CatalogContent';

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q ?? '';

    return (
        <main className="container mx-auto p-6">
            <Suspense
                key={query}
                fallback={
                    <div className="text-center py-12 text-muted-foreground">
                        Загрузка...
                    </div>
                }
            >
                <CatalogContent />
            </Suspense>
        </main>
    );
}
