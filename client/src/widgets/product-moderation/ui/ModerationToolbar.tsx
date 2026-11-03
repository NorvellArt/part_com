'use client';

import { useState, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Input, Button } from '@/shared/components';
import { ExcelImportButton } from '@/features/import-excel';
import { BulkCategoryAssignSelect } from '@/features/assign-product-category';
import { BulkDeleteProductsButton } from '@/features/delete-product';
import { BulkPublicationStatusSelect } from '@/features/edit-product';
import { PublicationFilter } from '@/entities/product/model/types';
import { useSearchParams } from 'next/navigation';

interface ModerationToolbarProps {
    totalCount: number;
    onSearch: (query: string) => void;
    selectedIds: string[];
    onClearSelection: () => void;
    currentHasCategory: string;
    onHasCategoryChange: (value: string) => void;
    publicationFilter: PublicationFilter;
    onPublicationFilterChange: (value: PublicationFilter) => void;
}

export function ModerationToolbar({
    totalCount,
    onSearch,
    selectedIds,
    onClearSelection,
    currentHasCategory,
    onHasCategoryChange,
    publicationFilter,
    onPublicationFilterChange,
}: ModerationToolbarProps) {
    const searchParams = useSearchParams();
    const queryFromUrl = searchParams.get('query') || '';

    const [searchQuery, setSearchQuery] = useState(queryFromUrl);
    const hasSelection = selectedIds.length > 0;

    useEffect(() => {
        setSearchQuery(queryFromUrl);
    }, [queryFromUrl]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4 shrink-0 min-h-[72px]">
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

                        <div className="text-xs font-semibold text-brand bg-brand-light px-3 py-1.5 rounded-lg border border-brand/10">
                            Выбрано позиций: {selectedIds.length}
                        </div>

                        <div className="flex items-center gap-3 ml-2">
                            <BulkCategoryAssignSelect
                                selectedIds={selectedIds}
                                onSuccessAction={onClearSelection}
                            />
                            <BulkPublicationStatusSelect
                                selectedIds={selectedIds}
                                onSuccessAction={onClearSelection}
                            />
                            <BulkDeleteProductsButton
                                selectedIds={selectedIds}
                                onSuccessAction={onClearSelection}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-5 flex-1 max-w-5xl">
                        <form
                            onSubmit={handleSubmit}
                            className="relative flex items-center gap-2 max-w-xs w-full"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Артикул или название..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-9 pr-8 h-9 bg-white border-slate-200 text-xs w-full rounded-lg focus-visible:ring-brand/20 focus-visible:border-brand"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <Button
                                type="submit"
                                size="sm"
                                className="h-9 text-xs px-4 rounded-lg shrink-0 text-white bg-brand hover:bg-brand-hover active:bg-brand-active transition-colors shadow-sm"
                            >
                                Найти
                            </Button>
                        </form>

                        <div className="w-[1px] h-6 bg-slate-200 shrink-0" />

                        <div className="flex items-center gap-4 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                    Категория:
                                </span>
                                <div className="relative">
                                    <select
                                        value={currentHasCategory}
                                        onChange={(e) =>
                                            onHasCategoryChange(e.target.value)
                                        }
                                        className="h-9 pl-3 pr-8 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 cursor-pointer min-w-[130px]"
                                    >
                                        <option value="all">Все товары</option>
                                        <option value="false">
                                            Без категории
                                        </option>
                                        <option value="true">
                                            С категорией
                                        </option>
                                    </select>
                                    <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                    Статус:
                                </span>
                                <div className="relative">
                                    <select
                                        value={publicationFilter}
                                        onChange={(e) =>
                                            onPublicationFilterChange(
                                                Number(
                                                    e.target.value,
                                                ) as PublicationFilter,
                                            )
                                        }
                                        className="h-9 pl-3 pr-8 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 cursor-pointer min-w-[130px]"
                                    >
                                        <option value={PublicationFilter.All}>
                                            Все статусы
                                        </option>
                                        <option
                                            value={
                                                PublicationFilter.OnlyPublished
                                            }
                                        >
                                            На сайте
                                        </option>
                                        <option
                                            value={
                                                PublicationFilter.OnlyUnpublished
                                            }
                                        >
                                            Черновики
                                        </option>
                                    </select>
                                    <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <div className="text-xs font-medium text-slate-500 bg-slate-200/50 px-2.5 py-1 rounded-md border border-slate-200/20">
                            Всего:{' '}
                            <span className="font-bold text-slate-700">
                                {totalCount}
                            </span>
                        </div>
                        <ExcelImportButton />
                    </div>
                </>
            )}
        </div>
    );
}
