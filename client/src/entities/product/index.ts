export type {
    Product,
    CreateProductInput,
    UpdateProductInput,
    ProductSearchParams
} from '@/entities/product/model/types';

export {
    useProducts,
    useProduct,
    productApi,
    productKeys
} from '@/entities/product/api/productApi';

export { ProductCard } from '@/entities/product/components/ProductCard';
export { ProductImage } from '@/entities/product/components/ProductImage';