// ProductTableList.tsx
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
import { ModerationRow } from './ModerationRow';
import { Product } from '@/entities/product';

interface ProductTableListProps {
    items: Product[];
    isLoading: boolean;
    selectedIds: string[];
    isAllSelected: boolean;
    isSomeSelected: boolean;
    onSelectAll: () => void;
    onSelectRow: (id: string) => void;
}

export function ProductTableList({
    items,
    isLoading,
    selectedIds,
    isAllSelected,
    isSomeSelected,
    onSelectAll,
    onSelectRow,
}: ProductTableListProps) {
    return (
        <div className="w-full overflow-auto">
            <Table>
                <TableHeader className="bg-slate-50/40 text-[11px] uppercase tracking-wider font-semibold">
                    <TableRow>
                        <TableHead className="h-11 w-12 px-4 text-center">
                            <Checkbox
                                checked={isAllSelected}
                                indeterminate={isSomeSelected}
                                onCheckedChange={onSelectAll}
                            />
                        </TableHead>
                        <TableHead className="h-11 w-12 px-2 text-slate-500 text-center">
                            Фото
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
                                colSpan={8}
                                className="py-12"
                            >
                                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                                    <Loader2 className="h-4 w-4 animate-spin text-brand" />
                                    <span>
                                        Загрузка списка автозапчастей...
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : items.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell
                                colSpan={8}
                                className="py-12 text-center text-slate-400"
                            >
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <PackageOpen className="h-8 w-8 text-slate-300" />
                                    <span>
                                        Товары не найдены. Выполните поиск или
                                        проверьте базу данных.
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((product) => (
                            <ModerationRow
                                key={product.id}
                                product={product}
                                isSelected={selectedIds.includes(product.id)}
                                onSelect={() => onSelectRow(product.id)}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
