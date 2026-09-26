import React from 'react';
import { Product } from '@/domain/entities/product';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Package } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-all border border-border flex flex-col justify-between overflow-hidden group"
            onClick={() => onClick(product)}
        >
            <CardHeader className="p-0">
                <div className="w-full h-48 bg-muted flex flex-col items-center justify-center text-muted-foreground group-hover:bg-accent/50 transition-colors">
                    <Package className="w-12 h-12 mb-2 stroke-1" />
                    <span className="text-xs font-mono">{product.itemNumber}</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                    <Badge
                        variant="outline"
                        className="text-xs font-semibold"
                    >
                        {product.brand}
                    </Badge>
                    <span className="text-xs text-muted-foreground">В наличии: {product.quantity} шт.</span>
                </div>
                <CardTitle className="text-base font-medium line-clamp-2 leading-tight">{product.name}</CardTitle>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="text-lg font-bold text-primary">{product.price.toLocaleString('ru-RU')} ₽</span>
            </CardFooter>
        </Card>
    );
};
