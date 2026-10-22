'use client';

import { useState } from 'react';
import { Search, X, Trash2 } from 'lucide-react';
import { Input, Button } from '@/shared/components';
import { ExcelImportButton } from '@/features/import-excel';
import { BulkCategoryAssignSelect } from '@/features/assign-product-category';

interface ModerationToolbarProps {
    totalCount: number;
    onSearch: (query: string) => void;
    selectedIds: string[];
    onClearSelection: () => void;
}

export function ModerationToolbar({
    totalCount,
    onSearch,
    selectedIds,
    onClearSelection,
}: ModerationToolbarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const hasSelection = selectedIds.length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleBulkDelete = () => {
        if (
            confirm(
                `Вы уверены, что хотите удалить ${selectedIds.length} запчастей?`,
            )
        ) {
            console.log('Удаление ID:', selectedIds);
        }
    };

    return (
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 shrink-0 min-h-[68px]">
            {hasSelection ? (
                <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onClearSelection}
                            className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <div className="text-xs font-semibold text-slate-700 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                            Выбрано позиций: {selectedIds.length}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <BulkCategoryAssignSelect
                            selectedIds={selectedIds}
                            onSuccessAction={onClearSelection}
                        />

                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleBulkDelete}
                            className="h-9 rounded-xl text-xs gap-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Удалить
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <form
                        onSubmit={handleSubmit}
                        className="relative max-w-sm w-full flex items-center gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Поиск по артикулу или названию..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 rounded-xl bg-white border-slate-200 text-xs w-full focus-visible:ring-blue-500/20"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="sm"
                            className="h-9 rounded-xl text-xs px-4"
                        >
                            Найти
                        </Button>
                    </form>

                    <div className="flex items-center gap-4">
                        <div className="text-xs font-medium text-slate-400">
                            Всего позиций: {totalCount}
                        </div>

                        <ExcelImportButton />
                    </div>
                </>
            )}
        </div>
    );
}
