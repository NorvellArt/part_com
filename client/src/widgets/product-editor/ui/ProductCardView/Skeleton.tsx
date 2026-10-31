import { Skeleton } from '@/shared/components';

export function ProductCardViewSkeleton() {
    const skeletonSpecs = [
        { label: 'Производитель (Бренд)' },
        { label: 'Артикул (Номер детали)' },
        { label: 'Наименование детали', fullWidth: true },
        { label: 'Цена' },
        { label: 'Количество на складе' },
    ];

    return (
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b pb-4 gap-4">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-7 w-2/3 max-w-sm" />
                    <Skeleton className="h-4 w-1/3 max-w-xs mt-1" />
                </div>
                <Skeleton className="h-9 w-28 shrink-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                    <span className="text-sm font-medium text-slate-500">
                        Изображение товара
                    </span>
                    <Skeleton className="w-full h-56 rounded-lg border" />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 content-start">
                    {skeletonSpecs.map((spec, index) => (
                        <div
                            key={index}
                            className={
                                spec.fullWidth
                                    ? 'sm:col-span-2 space-y-1.5'
                                    : 'space-y-1.5'
                            }
                        >
                            <span className="text-sm font-medium text-slate-500">
                                {spec.label}
                            </span>
                            <Skeleton className="h-[38px] w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
