'use client';

import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { useProduct, ProductImage } from '@/entities/product';
import { buttonVariants } from '@/shared/components';
import { ProductCardViewSkeleton } from './Skeleton';

interface ProductCardViewProps {
    productId: string;
}

export function ProductCardView({ productId }: ProductCardViewProps) {
    const { data: session, status } = useSession();
    const { data: product, isLoading, isError } = useProduct(productId);

    const isAdmin = session?.user?.roles?.includes('ADMIN');

    if (isLoading || status === 'loading') return <ProductCardViewSkeleton />;
    if (isError || !product) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                Товар не найден
            </div>
        );
    }

    const specs = [
        { label: 'Производитель (Бренд)', value: product.brand },
        {
            label: 'Артикул (Номер детали)',
            value: product.displayItemNumber,
            className: 'font-mono',
        },
        { label: 'Наименование детали', value: product.name, fullWidth: true },
        {
            label: 'Цена',
            value: product.price.toLocaleString('ru-RU', {
                style: 'currency',
                currency: 'RUB',
            }),
            className:
                'text-base font-semibold text-emerald-600 dark:text-emerald-400',
        },
        { label: 'Количество на складе', value: `${product.quantity} шт.` },
    ];

    return (
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b pb-4 gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {product.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Артикул:{' '}
                        <span className="font-mono font-medium">
                            {product.displayItemNumber}
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
                            className:
                                'gap-1.5 shrink-0 border-slate-200 text-slate-700 hover:bg-slate-50',
                        })}
                    >
                        <Pencil className="h-4 w-4" /> Редактировать
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1.5 flex flex-col">
                    <span className="text-sm font-medium text-slate-500">
                        Изображение товара
                    </span>
                    <div className="flex-1 w-full border border-slate-100 bg-slate-50/50 rounded-lg p-3 flex items-center justify-center min-h-[240px]">
                        <ProductImage
                            src={product.imageUrl || null}
                            alt={product.name}
                            brand={product.brand}
                            className="w-full h-full max-h-56 object-contain rounded-md mixed-blend-multiply transition-transform hover:scale-105"
                        />
                    </div>
                </div>

                <dl className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 content-start">
                    {specs.map((spec) => (
                        <div
                            key={spec.label}
                            className={
                                spec.fullWidth
                                    ? 'sm:col-span-2 space-y-1.5'
                                    : 'space-y-1.5'
                            }
                        >
                            <dt className="text-sm font-medium text-slate-500">
                                {spec.label}
                            </dt>
                            <dd
                                className={`w-full rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 min-h-[38px] flex items-center select-text ${spec.className ?? ''}`}
                            >
                                {spec.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}

export { ProductCardViewSkeleton };
