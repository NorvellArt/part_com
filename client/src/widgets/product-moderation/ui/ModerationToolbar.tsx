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
    currentHasCategory: string;
    onHasCategoryChange: (value: string) => void;
}

export function ModerationToolbar({
    totalCount,
    onSearch,
    selectedIds,
    onClearSelection,
    currentHasCategory,
    onHasCategoryChange,
}: ModerationToolbarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const hasSelection = selectedIds.length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 shrink-0 min-h-[68px]">
            {hasSelection ? (
                <div className="flex items-center gap-3 w-full animate-in fade-in slide-in-from-top-1 duration-200">
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
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-3 flex-1 max-w-2xl">
                        <form
                            onSubmit={handleSubmit}
                            className="relative w-full flex items-center gap-2"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Поиск по артикулу или названию..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-9 h-9 bg-white border-slate-200 text-xs w-full focus-visible:ring-blue-500/20"
                                />
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                className="h-9 text-xs px-4"
                            >
                                Найти
                            </Button>
                        </form>

                        <div className="flex items-center gap-2 shrink-0">
                            <select
                                value={currentHasCategory}
                                onChange={(e) =>
                                    onHasCategoryChange(e.target.value)
                                }
                                className="h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 cursor-pointer"
                            >
                                <option value="false">Без категории</option>
                                <option value="true">С категорией</option>
                                <option value="all">Все товары</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
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
