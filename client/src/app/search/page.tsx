import { Suspense } from 'react';
import { SearchResultsContent } from '@/presentation/components/SearchResultsContent';

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q ?? '';

    return (
        <main className="container mx-auto p-6 space-y-6">
            <Suspense
                key={query}
                fallback={
                    <div className="container mx-auto p-6 text-center text-muted-foreground">
                        Поиск...
                    </div>
                }
            >
                <SearchResultsContent query={query} />
            </Suspense>
        </main>
    );
}
