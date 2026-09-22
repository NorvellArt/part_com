import { getProductUseCase } from '@/infrastructure/di/container';
import { ProductCard } from '@/presentation/components/ProductCard';
import { Product } from '@/domain/entities/product';

export default async function HomePage() {
    let products: Product[] = [];
    let error: string | null = null;

    try {
        products = await getProductUseCase.execute();
    } catch (e) {
        error = (e as Error).message;
    }

    return (
        <main className="min-h-screen p-8 bg-slate-50 text-slate-900">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Каталог деталей PartCom</h1>

                {error && (
                    <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg border border-red-200">{error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
