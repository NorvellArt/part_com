import { Product } from "@/domain/entities/product";
import { IProductRepository } from "@/domain/repositories/iProductRepository";

export class HttpProductRepository implements IProductRepository {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5286";
    }

    async getProducts(): Promise<Product[]> {
        const response = await fetch(`${this.baseUrl}/api/product`, {
            next: { revalidate: 60 },
        });

        console.log('response', response)

        if (!response.ok) {
            throw new Error("Не удалось получить список деталей с сервера");
        }

        return response.json();
    }

    async getProductById(id: string): Promise<Product | null> {
        const response = await fetch(`${this.baseUrl}/api/parts/${id}`);

        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Ошибка при запросе детали");

        return response.json();
    }
}