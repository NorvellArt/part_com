'use client';

import React, { useState } from 'react';
import { useProducts } from '@/application/useCases/useProducts';
import { Product } from '@/domain/entities/product';
import { ProductCard } from '@/presentation/components/ProductCard';
import { ProductDetailModal } from '@/presentation/components/ProductDetailModal';

export default function CatalogPage() {
    const { products, isLoading, isError, updateProduct, deleteProduct, isUpdating, isDeleting } = useProducts();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
            <h1 className="text-2xl font-bold mb-6">Каталог автозапчастей</h1>

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
                            onClick={(p) => setSelectedProduct(p)}
                        />
                    ))}
                </div>
            )}

            <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onUpdate={updateProduct}
                onDelete={deleteProduct}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
            />
        </main>
    );
}
