'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '@/entities/product';
import { PublicationFilter } from '@/entities/product/model/types';

export function useProductModeration() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const pageFromUrl = Number(searchParams.get('page')) || 1;
    const queryFromUrl = searchParams.get('query') || '';
    const hasCategoryFromUrl = searchParams.get('hasCategory') || 'all';
    const publicationFilterFromUrl = Number(searchParams.get('publicationFilter')) || PublicationFilter.All;

    const [categoryValue, setCategoryValue] = useState(hasCategoryFromUrl);
    const [filterValue, setFilterValue] = useState(publicationFilterFromUrl);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => { setCategoryValue(hasCategoryFromUrl); }, [hasCategoryFromUrl]);
    useEffect(() => { setFilterValue(publicationFilterFromUrl); }, [publicationFilterFromUrl]);

    useEffect(() => {
        setSelectedIds([]);
    }, [pageFromUrl, queryFromUrl, hasCategoryFromUrl, publicationFilterFromUrl]);

    const getHasCategoryApiValue = () => {
        if (hasCategoryFromUrl === 'true') return true;
        if (hasCategoryFromUrl === 'false') return false;
        return undefined;
    };

    const { data: pagedResult, isLoading } = useProducts({
        query: queryFromUrl || undefined,
        page: pageFromUrl,
        pageSize: 20,
        hasCategory: getHasCategoryApiValue(),
        publicationFilter: publicationFilterFromUrl,
    });

    const updateUrlParams = (updates: {
        query?: string;
        hasCategory?: string;
        page?: number;
        publicationFilter?: PublicationFilter;
    }) => {
        const params = new URLSearchParams(searchParams.toString());

        const targetHasCategory = updates.hasCategory !== undefined ? updates.hasCategory : categoryValue;
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

        const targetPublicationFilter = updates.publicationFilter !== undefined ? updates.publicationFilter : filterValue;
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
    const totalCount = pagedResult?.totalCount ?? 0;

    const isAllSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id));
    const isSomeSelected = items.length > 0 && items.some((item) => selectedIds.includes(item.id)) && !isAllSelected;

    const handleSelectAll = () => {
        setSelectedIds(isAllSelected ? [] : items.map((item) => item.id));
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return {
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
    };
}
