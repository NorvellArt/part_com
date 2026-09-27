import { IProductRepository } from '@/domain/repositories/iProductRepository';
import { Product, CreateProductInput, UpdateProductInput } from '@/domain/entities/product';
import { fetchApi } from '@/infrastructure/api/httpClient';
import { ProductDto } from '@/infrastructure/dto/productDto';

export class ApiProductRepository implements IProductRepository {
    async getAll(): Promise<Product[]> {
        return fetchApi<Product[]>('/api/products');
    }

    async getById(id: string): Promise<Product> {
        return fetchApi<Product>(`/api/products/${id}`);
    }

    async create(input: CreateProductInput): Promise<Product> {
        return fetchApi<Product>('/api/products', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    }

    async update(id: string, input: UpdateProductInput): Promise<void> {
        await fetchApi<void>(`/api/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(input),
        });
    }

    async delete(id: string): Promise<void> {
        await fetchApi<void>(`/api/products/${id}`, {
            method: 'DELETE',
        });
    }

    async search(query: string, limit = 50, signal?: AbortSignal): Promise<Product[]> {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (limit) params.append('limit', limit.toString());

        const response = await fetchApi<ProductDto[]>(`/api/products/search?${params.toString()}`, { signal });

        return response.map((dto) => ({
            id: dto.id,
            brand: dto.brand,
            itemNumber: dto.itemNumber,
            name: dto.name,
            price: dto.price,
            quantity: dto.quantity,
            imageUrl: dto.imageUrl,
        }));
    }

    async importFromExcel(file: File): Promise<{ message: string; count: number }> {
        const formData = new FormData();
        formData.append('file', file);

        return fetchApi<{ message: string; count: number }>('/api/products/import', {
            method: 'POST',
            body: formData,
        });
    }
}

export const productRepository = new ApiProductRepository();