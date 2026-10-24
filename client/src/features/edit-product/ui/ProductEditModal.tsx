'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components';
import { ProductFormEditor } from '@/widgets/product-editor/ui/ProductFormEditor';
import { productApi, productKeys } from '@/entities/product';

interface ProductEditModalProps {
    productId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductEditModal({
    productId,
    isOpen,
    onClose,
}: ProductEditModalProps) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isOpen && productId) {
            queryClient.prefetchQuery({
                queryKey: productKeys.detail(productId),
                queryFn: () => productApi.getById(productId),
            });
        }
    }, [isOpen, productId, queryClient]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent className="lg:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                        Редактирование товара
                    </DialogTitle>
                </DialogHeader>

                {productId && (
                    <div className="mt-2">
                        <ProductFormEditor
                            productId={productId}
                            onSuccess={onClose}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
