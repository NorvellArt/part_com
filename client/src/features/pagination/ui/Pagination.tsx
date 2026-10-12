'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/shared/components';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const createPageUrl = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return '#';

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePageChange = (
        e: React.MouseEvent<HTMLAnchorElement>,
        page: number,
    ) => {
        e.preventDefault();
        if (page < 1 || page > totalPages || page === currentPage) return;
        router.push(createPageUrl(page), { scroll: true });
    };

    const renderPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('ellipsis');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('ellipsis');
            pages.push(totalPages);
        }

        return pages.map((page, index) => {
            if (page === 'ellipsis') {
                return (
                    <PaginationItem key={`ellipsis-${index}`}>
                        {/* Добавлен класс w-8 h-8 для уменьшения высоты троеточия */}
                        <PaginationEllipsis className="w-8 h-8 flex items-center justify-center" />
                    </PaginationItem>
                );
            }

            return (
                <PaginationItem key={page}>
                    <PaginationLink
                        href={createPageUrl(page)}
                        isActive={currentPage === page}
                        onClick={(e) => handlePageChange(e, page)}
                        size="sm"
                        className="w-8 h-8 p-0"
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        });
    };

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= totalPages;

    return (
        <ShadcnPagination className="my-0">
            <PaginationContent className="gap-1">
                <PaginationItem>
                    <PaginationPrevious
                        text="Предыдущая"
                        href={
                            isPrevDisabled
                                ? '#'
                                : createPageUrl(currentPage - 1)
                        }
                        onClick={(e) =>
                            isPrevDisabled
                                ? e.preventDefault()
                                : handlePageChange(e, currentPage - 1)
                        }
                        aria-disabled={isPrevDisabled}
                        tabIndex={isPrevDisabled ? -1 : undefined}
                        size="sm"
                        className={
                            isPrevDisabled
                                ? 'pointer-events-none opacity-50 h-8 px-2 text-xs'
                                : 'h-8 px-2 text-xs'
                        }
                    />
                </PaginationItem>

                {renderPageNumbers()}

                <PaginationItem>
                    <PaginationNext
                        text="Следующая"
                        href={
                            isNextDisabled
                                ? '#'
                                : createPageUrl(currentPage + 1)
                        }
                        onClick={(e) =>
                            isNextDisabled
                                ? e.preventDefault()
                                : handlePageChange(e, currentPage + 1)
                        }
                        aria-disabled={isNextDisabled}
                        tabIndex={isNextDisabled ? -1 : undefined}
                        size="sm"
                        className={
                            isNextDisabled
                                ? 'pointer-events-none opacity-50 h-8 px-2 text-xs'
                                : 'h-8 px-2 text-xs'
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </ShadcnPagination>
    );
}
