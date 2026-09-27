'use client';

import { useState } from 'react';
import { useProducts } from '@/application/useCases/useProducts';

import { ProductCard } from '@/presentation/components/ProductCard';
import { ExcelImportModal } from '@/presentation/components/ExcelImportModal';

import { Button } from '@/presentation/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';

export default function CatalogPage() {
    const {
        products,
        isLoading,
        isError,
        importExcel,
        isImporting,
    } = useProducts();
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 text-center text-muted-foreground">
                Загрузка каталога автозапчастей...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-6 text-center text-destructive">
                Ошибка при загрузке данных с сервера.
            </div>
        );
    }

    return (
        <main className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Каталог автозапчастей</h1>
                <Button
                    onClick={() => setIsImportModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                >
                    <FileSpreadsheet className="w-4 h-4" />
                    Импорт из Excel
                </Button>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    Товары не найдены. Импортируйте каталог из Excel.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
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
                onImport={importExcel}
                isImporting={isImporting}
            />
        </main>
    );
}
