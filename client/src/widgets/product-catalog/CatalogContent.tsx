'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { ProductCard, useProducts } from '@/entities/product';
import { ExcelImportModal } from '@/features/import-excel';

import { Button } from '@/shared';
import { FileSpreadsheet } from 'lucide-react';

export function CatalogContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const page = Number(searchParams.get('page')) || 1;

    const { data, isLoading, isError } =
        useProducts({
            query,
            page,
            pageSize: 20,
        });

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                {query
                    ? 'Поиск запчастей...'
                    : 'Загрузка каталога автозапчастей...'}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12 text-destructive">
                Ошибка при загрузке данных с сервера.
            </div>
        );
    }

    const title = query
        ? `Результаты поиска по запросу «${query}»`
        : 'Каталог автозапчастей';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <Button
                    onClick={() => setIsImportModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                >
                    <FileSpreadsheet className="w-4 h-4" />
                    Импорт из Excel
                </Button>
            </div>

            {data?.totalCount === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    {query
                        ? 'По вашему запросу ничего не найдено.'
                        : 'Товары не найдены. Импортируйте каталог из Excel.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data?.items.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}

            <ExcelImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />
        </div>
    );
}
