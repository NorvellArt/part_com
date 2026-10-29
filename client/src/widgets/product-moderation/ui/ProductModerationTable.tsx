'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '@/entities/product';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Checkbox,
} from '@/shared/components';
import { PackageOpen, Loader2 } from 'lucide-react';
import { ModerationToolbar } from './ModerationToolbar';
import { ModerationRow } from './ModerationRow';
import { Pagination } from '@/features/pagination';
import { PublicationFilter } from '@/entities/product/model/types';

export function ProductModerationTable() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const pageFromUrl = Number(searchParams.get('page')) || 1;
    const queryFromUrl = searchParams.get('query') || '';

    const hasCategoryFromUrl =
        searchParams.get('hasCategory') ??
        (searchParams.has('query') || searchParams.has('page')
            ? 'all'
            : 'false');
    const publicationFilterFromUrl =
        Number(searchParams.get('publicationFilter')) || PublicationFilter.All;

    const [categoryValue, setCategoryValue] = useState(hasCategoryFromUrl);
    const [filterValue, setFilterValue] = useState(publicationFilterFromUrl);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        setCategoryValue(hasCategoryFromUrl);
    }, [hasCategoryFromUrl]);

    useEffect(() => {
        setFilterValue(publicationFilterFromUrl);
    }, [publicationFilterFromUrl]);

    useEffect(() => {
        setSelectedIds([]);
    }, [
        pageFromUrl,
        queryFromUrl,
        hasCategoryFromUrl,
        publicationFilterFromUrl,
    ]);

    const getHasCategoryApiValue = () => {
        if (hasCategoryFromUrl === 'true') return true;
        if (hasCategoryFromUrl === 'false') return false;
        return undefined;
    };

    const { data: pagedResult, isLoading } = useProducts({
        query: queryFromUrl || undefined,
        page: pageFromUrl,
        pageSize: 10,
        hasCategory: getHasCategoryApiValue(),
        publicationFilter: publicationFilterFromUrl,
    });

    useEffect(() => {
        setSelectedIds([]);
    }, [
        pageFromUrl,
        queryFromUrl,
        hasCategoryFromUrl,
        publicationFilterFromUrl,
    ]);

    const updateUrlParams = (updates: {
        query?: string;
        hasCategory?: string;
        page?: number;
        publicationFilter?: PublicationFilter;
    }) => {
        const params = new URLSearchParams(searchParams.toString());

        const targetHasCategory =
            updates.hasCategory !== undefined
                ? updates.hasCategory
                : categoryValue;
        if (targetHasCategory === 'all') {
            params.delete('hasCategory');
        } else {
            params.set('hasCategory', targetHasCategory);
        }

        if (updates.hasCategory !== undefined) {
            setCategoryValue(updates.hasCategory);
            params.set('page', '1');
        }

        if (updates.query !== undefined) {
            if (updates.query) {
                params.set('query', updates.query);
            } else {
                params.delete('query');
            }
            params.set('page', '1');
        }

        const targetPublicationFilter =
            updates.publicationFilter !== undefined
                ? updates.publicationFilter
                : filterValue;
        if (targetPublicationFilter === PublicationFilter.All) {
            params.delete('publicationFilter');
        } else {
            params.set('publicationFilter', targetPublicationFilter.toString());
        }

        if (updates.publicationFilter !== undefined) {
            setFilterValue(updates.publicationFilter);
            params.set('page', '1');
        }

        if (updates.page !== undefined) {
            params.set('page', updates.page.toString());
        }

        router.push(`?${params.toString()}`, { scroll: false });
    };

    const items = pagedResult?.items ?? [];
    const totalPages = pagedResult?.totalPages ?? 1;

    const isAllSelected =
        items.length > 0 &&
        items.every((item) => selectedIds.includes(item.id));
    const isSomeSelected =
        items.length > 0 &&
        items.some((item) => selectedIds.includes(item.id)) &&
        !isAllSelected;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((item) => item.id));
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <ModerationToolbar
                totalCount={pagedResult?.totalCount ?? 0}
                selectedIds={selectedIds}
                onClearSelection={() => setSelectedIds([])}
                currentHasCategory={categoryValue}
                onHasCategoryChange={(val) =>
                    updateUrlParams({ hasCategory: val })
                }
                onSearch={(q) => updateUrlParams({ query: q })}
                publicationFilter={filterValue}
                onPublicationFilterChange={(filterVal) =>
                    updateUrlParams({ publicationFilter: filterVal })
                }
            />

            <div className="w-full overflow-auto">
                <Table>
                    <TableHeader className="bg-slate-50/40 text-[11px] uppercase tracking-wider font-semibold">
                        <TableRow>
                            <TableHead className="h-11 w-12 px-4 text-center">
                                <Checkbox
                                    checked={isAllSelected}
                                    indeterminate={isSomeSelected}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="h-11 px-4 text-slate-500">
                                Артикул / Бренд
                            </TableHead>
                            <TableHead className="h-11 px-4 text-slate-500">
                                Наименование автозапчасти
                            </TableHead>
                            <TableHead className="h-11 px-4 text-right text-slate-500">
                                Цена
                            </TableHead>
                            <TableHead className="h-11 px-4 text-center text-slate-500">
                                Остаток
                            </TableHead>
                            <TableHead className="h-11 px-4 text-center text-slate-500">
                                Категория
                            </TableHead>
                            <TableHead className="h-11 w-12 px-4 text-center text-slate-500" />
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs text-slate-700">
                        {isLoading ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={7}
                                    className="py-12"
                                >
                                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                        <span>
                                            Загрузка списка автозапчастей...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : !pagedResult || items.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={7}
                                    className="py-12 text-center text-slate-400"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <PackageOpen className="h-8 w-8 text-slate-300" />
                                        <span>
                                            Товары не найдены. Выполните поиск
                                            или проверьте базу данных.
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((product) => (
                                <ModerationRow
                                    key={product.id}
                                    product={product}
                                    isSelected={selectedIds.includes(
                                        product.id,
                                    )}
                                    onSelect={() => handleSelectRow(product.id)}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex items-center justify-center bg-slate-50/30 shrink-0">
                    <Pagination
                        currentPage={pageFromUrl}
                        totalPages={totalPages}
                    />
                </div>
            )}
        </div>
    );
}
