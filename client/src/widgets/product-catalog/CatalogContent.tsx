import { ProductCard, productApi } from '@/entities/product';
import { ExcelImportButton } from '@/features/import-excel';
import { Pagination } from '@/features/pagination';

interface CatalogContentProps {
    query: string;
    page: number;
}

const PAGE_SIZE = 20;

export async function CatalogContent({ query, page }: CatalogContentProps) {
    const data = await productApi.search({ query, page, pageSize: PAGE_SIZE });
    const totalPages = data.totalPages;

    const title = query
        ? `Результаты поиска по запросу «${query}»`
        : 'Каталог автозапчастей';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <ExcelImportButton />
            </div>

            {data.totalCount === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    {query
                        ? 'По вашему запросу ничего не найдено.'
                        : 'Товары не найдены. Импортируйте каталог из Excel.'}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {data.items.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                    />
                </>
            )}
        </div>
    );
}
