'use client';

import { Product } from '@/entities/product/model/types';
import { TableRow, TableCell } from '@/shared/components';
import { CategoryAssignSelect } from '@/features/assign-product-category';
import { cn } from 'cn';

interface ModerationRowProps {
    product: Product;
}

export function ModerationRow({ product }: ModerationRowProps) {
    const hasNoCategory = !product.categoryId;

    return (
        <TableRow
            className={cn(
                'transition-colors',
                hasNoCategory
                    ? 'bg-amber-50/20 hover:bg-amber-50/40'
                    : 'hover:bg-slate-50/50',
            )}
        >
            <TableCell className="py-3 px-4 font-mono">
                <div className="font-bold text-slate-900">
                    {product.itemNumber}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-sans tracking-wide mt-0.5">
                    {product.brand}
                </div>
            </TableCell>
            <TableCell className="py-3 px-4 max-w-xs font-medium text-slate-800">
                <div
                    className="line-clamp-2"
                    title={product.name}
                >
                    {product.name}
                </div>
            </TableCell>
            <TableCell className="py-3 px-4 text-right font-bold text-slate-900">
                {product.price.toLocaleString()} ₽
            </TableCell>
            <TableCell className="py-3 px-4 text-center">
                <span
                    className={cn(
                        'px-2 py-0.5 rounded-full font-medium text-[10px] inline-block',
                        product.quantity > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-rose-50 text-rose-700',
                    )}
                >
                    {product.quantity} шт
                </span>
            </TableCell>
            <TableCell className="py-3 px-4 pl-6">
                <CategoryAssignSelect
                    productId={product.id}
                    currentCategoryId={product.categoryId}
                    currentCategoryName={product.categoryName}
                />
            </TableCell>
        </TableRow>
    );
}
