'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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

export function ProductModerationTable() {
    const searchParams = useSearchParams();

    const pageFromUrl = Number(searchParams.get('page')) || 1;

    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const { data: pagedResult, isLoading } = useProducts({
        query: debouncedQuery || undefined,
        page: pageFromUrl,
        pageSize: 10,
    });

    useEffect(() => {
        setSelectedIds([]);
    }, [pageFromUrl, debouncedQuery]);

    const handleSearch = (query: string) => {
        setDebouncedQuery(query);
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
                onSearch={handleSearch}
                selectedIds={selectedIds}
                onClearSelection={() => setSelectedIds([])}
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
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs text-slate-700">
                        {isLoading ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={5}
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
                                    colSpan={5}
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
