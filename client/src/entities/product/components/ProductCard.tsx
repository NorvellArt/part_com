import React from 'react';
import Link from 'next/link';
import { Product, ProductImage } from '@/entities/product/index';
import { Card } from '@/shared/components/ui/card';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Card className="h-full flex flex-col relative group overflow-hidden border border-muted shadow-none bg-white rounded-xl pt-0 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
            <Link
                href={`/products/${product.id}`}
                className="flex flex-col flex-1"
            >
                <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    brand={product.brand}
                />
                <div className="pt-4 px-3 pb-0 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                        <h3 className="text-[15px] font-semibold tracking-tight text-[#1a4f95] group-hover:text-[#256fc4] transition-colors line-clamp-2 leading-snug">
                            {product.name}
                        </h3>

                        <div className="text-xs text-muted-foreground space-y-0.5">
                            <p>
                                Артикул:{' '}
                                <span className="font-medium text-foreground/80">
                                    {product.displayItemNumber}
                                </span>
                            </p>
                            <p className="truncate opacity-80">
                                {product.brand}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-base font-black text-foreground tracking-tight">
                            {product.price.toLocaleString('ru-RU')} ₽
                        </span>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <span
                                className={`h-2 w-2 rounded-full shrink-0 ${
                                    product.quantity > 0
                                        ? 'bg-emerald-500'
                                        : 'bg-red-500'
                                }`}
                            />
                            <span>
                                {product.quantity > 0
                                    ? 'В наличии'
                                    : 'Нет в наличии'}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    );
};
