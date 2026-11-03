'use client';

import { Product } from '@/entities/product/model/types';
import { TableRow, TableCell, Checkbox } from '@/shared/components';
import { cn } from 'cn';
import { ProductEditButton } from '@/features/edit-product';
import { Image as ImageIcon } from 'lucide-react';

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

    const imageUrl = product.imageUrl || '';
    const hasImage = Boolean(imageUrl);

    return (
        <TableRow
            onClick={onSelect}
            className={cn(
                'transition-colors cursor-pointer',
                hasNoCategory
                    ? 'bg-amber-50/20 hover:bg-amber-50/40'
                    : 'hover:bg-slate-50/50',
                isSelected && 'bg-brand-light hover:bg-brand-light/80',
            )}
        >
            <TableCell
                className="h-11 w-12 px-4 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onSelect}
                />
            </TableCell>

            <TableCell className="h-11 w-12 px-2 text-center">
                <div className="flex items-center justify-center">
                    {hasImage ? (
                        <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-400 shrink-0"
                            title="Изображение отсутствует"
                        >
                            <ImageIcon className="h-4 w-4 stroke-[1.5]" />
                        </div>
                    )}
                </div>
            </TableCell>

            <TableCell className="py-3 px-4 font-mono">
                <div
                    className="font-bold text-brand"
                    title="Артикул для пользователей"
                >
                    {product.displayItemNumber || product.itemNumber}
                </div>

                {product.displayItemNumber &&
                    product.displayItemNumber !== product.itemNumber && (
                        <div
                            className="text-[11px] text-slate-500 font-medium mt-0.5"
                            title="Внутренний артикул"
                        >
                            исх: {product.itemNumber}
                        </div>
                    )}

                <div className="text-[10px] text-slate-400 uppercase font-sans tracking-wide mt-1">
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

            <TableCell className="py-3 px-4 text-center">
                <div className="font-medium text-slate-800 mb-1">
                    {product.categoryName || '—'}
                </div>
                <span
                    className={cn(
                        'px-2 py-0.5 rounded font-medium text-[9px] inline-block uppercase tracking-wider',
                        product.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600',
                    )}
                >
                    {product.isPublished ? 'На сайте' : 'Черновик'}
                </span>
            </TableCell>

            <TableCell
                className="h-11 px-4 text-center w-12"
                onClick={(e) => e.stopPropagation()}
            >
                <ProductEditButton productId={product.id} />
            </TableCell>
        </TableRow>
    );
}
