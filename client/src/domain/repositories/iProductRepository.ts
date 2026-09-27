import { CreateProductInput, Product, UpdateProductInput } from "@/domain/entities/product";

export interface IProductRepository {
    getAll(): Promise<Product[]>;
    getById(id: string): Promise<Product | null>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: string, input: UpdateProductInput): Promise<void>;
    delete(id: string): Promise<void>;
    search(query: string, limit?: number, cancellationToken?: AbortSignal): Promise<Product[]>;
    importFromExcel(file: File): Promise<{ message: string; count: number }>;
}