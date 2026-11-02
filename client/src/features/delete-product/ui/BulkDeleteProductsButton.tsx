'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/components';
import { useBulkDeleteProducts } from '@/features/delete-product';

interface BulkDeleteProductsButtonProps {
    selectedIds: string[];
    onSuccessAction: () => void;
}

export function BulkDeleteProductsButton({
    selectedIds,
    onSuccessAction,
}: BulkDeleteProductsButtonProps) {
    const { mutate: bulkDelete, isPending } = useBulkDeleteProducts();

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;

        const confirmDelete = window.confirm(
            `Вы уверены, что хотите удалить выбранные товары (${selectedIds.length} шт.)?`,
        );

        if (confirmDelete) {
            bulkDelete(selectedIds, {
                onSuccess: () => {
                    onSuccessAction();
                },
                onError: (error) => {
                    alert('Не удалось удалить товары. Попробуйте позже.');
                    console.error('Bulk delete error:', error);
                },
            });
        }
    };

    return (
        <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={isPending}
            className="h-9 text-xs gap-2 px-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
        >
            <Trash2 className="h-4 w-4" />
            {isPending ? 'Удаление...' : 'Удалить'}
        </Button>
    );
}
