'use client';

import { ModerationToolbar } from './ModerationToolbar';
import { Pagination } from '@/features/pagination';
import { useProductModeration } from '../api/useProductModeration';
import { ProductTableList } from './ProductTableList';

export function ProductModerationTable() {
    const {
        items,
        isLoading,
        totalPages,
        totalCount,
        pageFromUrl,
        categoryValue,
        filterValue,
        selectedIds,
        setSelectedIds,
        isAllSelected,
        isSomeSelected,
        handleSelectAll,
        handleSelectRow,
        updateUrlParams,
    } = useProductModeration();

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <ModerationToolbar
                totalCount={totalCount}
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

            <ProductTableList
                items={items}
                isLoading={isLoading}
                selectedIds={selectedIds}
                isAllSelected={isAllSelected}
                isSomeSelected={isSomeSelected}
                onSelectAll={handleSelectAll}
                onSelectRow={handleSelectRow}
            />

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
