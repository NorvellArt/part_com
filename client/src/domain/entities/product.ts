export interface Product {
    id: string;
    brand: string;
    itemNumber: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string | null;
}

export type CreateProductInput = Omit<Product, 'id'>;
export type UpdateProductInput = Omit<Product, 'id'>;