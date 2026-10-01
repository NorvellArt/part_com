'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared';
import { Trash2, Loader2 } from 'lucide-react';
import { useDeleteProduct } from '@/features/delete-product';

interface DeleteProductButtonProps {
    productId: string;
    onDeleteError?: (error: string) => void;
}

export const DeleteProductButton: React.FC<DeleteProductButtonProps> = ({
    productId,
    onDeleteError,
}) => {
    const router = useRouter();
    const { mutateAsync: deleteProduct, isPending: isDeleting } =
        useDeleteProduct(productId);

    const handleDelete = async () => {
        if (
            confirm(
                'Вы уверены, что хотите удалить эту автозапчасть из каталога?',
            )
        ) {
            try {
                await deleteProduct();
            } catch {
                onDeleteError?.('Не удалось удалить товар');
            }
        }
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 shrink-0"
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
            {isDeleting ? 'Удаление...' : 'Удалить'}
        </Button>
    );
};
