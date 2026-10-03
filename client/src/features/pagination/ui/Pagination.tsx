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
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            return (
                <PaginationItem key={page}>
                    <PaginationLink
                        href={createPageUrl(page)}
                        isActive={currentPage === page}
                        onClick={(e) => handlePageChange(e, page)}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        });
    };

    return (
        <ShadcnPagination className="my-6">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        text='Предыдущая'
                        href={createPageUrl(currentPage - 1)}
                        onClick={(e) => handlePageChange(e, currentPage - 1)}
                        aria-disabled={currentPage <= 1}
                        className={
                            currentPage <= 1
                                ? 'pointer-events-none opacity-50'
                                : ''
                        }
                    />
                </PaginationItem>

                {renderPageNumbers()}

                <PaginationItem>
                    <PaginationNext
                        text='Следующая'
                        href={createPageUrl(currentPage + 1)}
                        onClick={(e) => handlePageChange(e, currentPage + 1)}
                        aria-disabled={currentPage >= totalPages}
                        className={
                            currentPage >= totalPages
                                ? 'pointer-events-none opacity-50'
                                : ''
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </ShadcnPagination>
    );
}
