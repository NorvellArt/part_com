'use client';

import { Product } from '@/entities/product/model/types';
import { TableRow, TableCell, Checkbox, } from '@/shared/components';
import { cn } from 'cn';
import { ProductEditButton } from '@/features/edit-product';

interface ModerationRowProps {
    product: Product;
    isSelected: boolean;
    onSelect: () => void;
}

export function ModerationRow({
    product,
    isSelected,
    onSelect,
}: ModerationRowProps) {
    const hasNoCategory = !product.categoryId;

    return (
        <TableRow
            onClick={onSelect}
            className={cn(
                'transition-colors',
                hasNoCategory
                    ? 'bg-amber-50/20 hover:bg-amber-50/40'
                    : 'hover:bg-slate-50/50',
            )}
        >
            <TableCell className="h-11 w-12 px-4 text-center">
                <Checkbox checked={isSelected} />
            </TableCell>
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
            <TableCell className="py-3 px-4 text-center font-medium text-slate-800">
                {product.categoryName || '—'}
            </TableCell>
            <TableCell className="h-11 px-4 text-center w-12">
                <ProductEditButton productId={product.id} />
            </TableCell>
        </TableRow>
    );
}
