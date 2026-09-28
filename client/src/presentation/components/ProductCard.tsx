import React from 'react';
import Link from 'next/link';
import { Product } from '@/domain/entities/product';
import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/presentation/components/ui/card';
import { ProductImage } from '@/presentation/components/ProductImage';

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
                    className="w-full h-44 shrink-0"
                />

                <CardHeader className="pb-2 flex-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span className="font-semibold text-primary">
                            {product.brand}
                        </span>
                        <span className="font-mono">{product.itemNumber}</span>
                    </div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-lg font-bold">
                        {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <span
                        className={`text-xs px-2 py-1 rounded-full ${
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
