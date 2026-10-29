import React from 'react';
import Link from 'next/link';
import { Product, ProductImage } from '@/entities/product/index';
import { Card, CardHeader, CardTitle, CardFooter } from '@/shared/components';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Link
            href={`/products/${product.id}`}
            className="block group"
        >
            <Card className="h-full flex flex-col transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    brand={product.brand}
                    className="w-full h-32 shrink-0"
                />

                <CardHeader className="p-3 flex-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span className="font-semibold text-primary">
                            {product.brand}
                        </span>
                        <span className="font-mono">{product.displayItemNumber}</span>
                    </div>
                    <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="p-3 pt-0 mt-auto flex items-center justify-between">
                    <span className="text-base font-bold">
                        {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            product.quantity > 0
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-destructive/10 text-destructive'
                        }`}
                    >
                        {product.quantity > 0
                            ? `${product.quantity} шт.`
                            : 'Нет в наличии'}
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
};
