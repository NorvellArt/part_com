import { getServerSession } from 'next-auth';
import { ProductCard, productApi } from '@/entities/product';
import { authOptions } from '@/entities/session';
import { ExcelImportButton } from '@/features/import-excel';
import { Pagination } from '@/features/pagination';

interface CatalogContentProps {
    query: string;
    page: number;
}

const PAGE_SIZE = 20;

export async function CatalogContent({ query, page }: CatalogContentProps) {
    const session = await getServerSession(authOptions);

    const isAdmin = session?.user?.roles?.includes('ADMIN');

    const data = await productApi.search({ query, page, pageSize: PAGE_SIZE });
    const totalPages = data.totalPages;

    const title = query
        ? `Результаты поиска по запросу «${query}»`
        : 'Каталог автозапчастей';

    return (
        <div className="space-y-6 pb-16 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                {isAdmin && <ExcelImportButton />}
            </div>

            {data.totalCount === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    {query
                        ? 'По вашему запросу ничего не найдено.'
                        : 'Товары не найдены. Импортируйте каталог из Excel.'}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {data.items.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>

                    <div className="sticky bottom-4 left-0 right-0 z-40 w-full flex justify-center pointer-events-none mt-6">
                        <div className="pointer-events-auto flex items-center justify-center max-w-max bg-white/75 backdrop-blur-md border border-slate-200/60 px-3 py-1 rounded-full shadow-sm transition-all hover:bg-white/90 hover:shadow-md dark:bg-slate-950/75 dark:border-slate-800">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
