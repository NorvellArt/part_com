import { HttpProductRepository } from "@/infrastructure/repositories/httpProductRepository";
import { GetProductsUseCase } from "@/application/useCases/getProductsUseCase";

export const productRepository = new HttpProductRepository();
export const getProductUseCase = new GetProductsUseCase(productRepository);