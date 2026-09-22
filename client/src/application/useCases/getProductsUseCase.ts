import { Product } from "@/domain/entities/product";
import { IProductRepository } from "@/domain/repositories/iProductRepository";

export class GetProductsUseCase {
    constructor(private readonly partRepository: IProductRepository) { }

    async execute(): Promise<Product[]> {
        const products = await this.partRepository.getProducts();

        return products;
    }
}