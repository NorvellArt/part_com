'use client';

import { useRouter } from 'next/navigation';
import { useSearchProducts } from '@/application/useCases/useSearchProduct';
import { Button } from '@/presentation/components/ui/button';
import { AlertCircle, PackageSearch, ArrowLeft } from 'lucide-react';
import { ProductCard } from '@/presentation/components/ProductCard';

interface SearchResultsContentProps {
    query: string;
}

export function SearchResultsContent({ query }: SearchResultsContentProps) {
    const router = useRouter();
    const {
        data: products,
        isLoading,
        isError,
        error,
    } = useSearchProducts(query);

    return (
        <div className="space-y-6">
            {/* Шапка страницы результатов */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {query ? (
                            <>
                                Результаты поиска:{' '}
                                <span className="text-primary">«{query}»</span>
                            </>
                        ) : (
                            'Все товары'
                        )}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {products
                            ? `Найдено позиций: ${products.length}`
                            : 'Поиск автозапчастей...'}
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> В каталог
                </Button>
            </div>

            {/* Ошибка */}
            {isError && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>
                        {(error as Error)?.message ||
                            'Не удалось загрузить результаты поиска'}
                    </span>
                </div>
            )}

            {/* Ничего не найдено */}
            {!isLoading && !isError && products?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 border rounded-xl bg-card">
                    <PackageSearch className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">
                        По запросу «{query}» ничего не найдено
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Проверьте правильность написания артикула или названия
                        бренда.
                    </p>
                    <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => router.push('/')}
                    >
                        Вернуться ко всем товарам
                    </Button>
                </div>
            )}

            {/* Сетка результатов */}
            {!isLoading && !isError && products && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
