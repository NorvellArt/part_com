import { Product } from '@/domain/entities/product';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
                <h2 className="text-xl font-bold mt-2 text-slate-800">{product.name}</h2>
                <p className="text-sm text-slate-500 font-mono mt-1">Артикул: {product.itemNumber}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-lg font-extrabold text-slate-900">{product.price} ₽</span>
                <span className="text-sm text-slate-600">В наличии: {10} шт.</span>
            </div>
        </div>
    );
}
