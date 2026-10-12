'use client';

import Link from 'next/link';
import { useProduct, ProductImage } from '@/entities/product';
import { Label, buttonVariants } from '@/shared/components';
import { Edit } from 'lucide-react';

interface ProductCardViewProps {
    productId: string;
    isAdmin: boolean;
}

export function ProductCardView({ productId, isAdmin }: ProductCardViewProps) {
    const { data: product, isError } = useProduct(productId);

    if (isError || !product)
        return <div className="text-center py-12">Товар не найден</div>;

    const valueStyle =
        'w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm text-foreground select-text min-h-[38px] flex items-center';

    return (
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {product.name}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Артикул:{' '}
                        <span className="font-mono font-medium">
                            {product.itemNumber}
                        </span>{' '}
                        | Бренд: {product.brand}
                    </p>
                </div>

                {isAdmin && (
                    <Link
                        href={`/products/${productId}/edit`}
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                            className: 'gap-2',
                        })}
                    >
                        <Edit className="w-4 h-4" /> Редактировать
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Label className="mb-2 block">Изображение товара</Label>
                    <ProductImage
                        src={product.imageUrl || null}
                        alt={product.name}
                        brand={product.brand}
                        className="w-full h-56 rounded-lg border"
                    />
                </div>

                <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Производитель (Бренд)</Label>
                            <div className={valueStyle}>{product.brand}</div>
                        </div>
                        <div className="space-y-2">
                            <Label>Артикул (Номер детали)</Label>
                            <div className={`${valueStyle} font-mono`}>
                                {product.itemNumber}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Наименование детали</Label>
                        <div className={valueStyle}>{product.name}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Цена</Label>
                            <div
                                className={`${valueStyle} font-medium text-emerald-600 dark:text-emerald-400`}
                            >
                                {product.price.toLocaleString('ru-RU', {
                                    style: 'currency',
                                    currency: 'RUB',
                                })}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Количество на складе</Label>
                            <div className={valueStyle}>
                                {product.quantity} шт.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
