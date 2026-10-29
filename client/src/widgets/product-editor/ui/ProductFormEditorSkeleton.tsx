import { Skeleton } from '@/shared/components';

export function ProductFormEditorSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-9 w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border rounded-xl p-4 h-64 flex flex-col justify-between">
                    <Skeleton className="w-full h-40 rounded-lg" />
                    <Skeleton className="h-9 w-full" />
                </div>

                <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>
        </div>
    );
}
