'use client';

import { useState } from 'react';
import { Button } from '@/shared/components';
import { Pencil } from 'lucide-react';
import { ProductEditModal } from '@/features/edit-product/ui/ProductEditModal';

interface ProductEditButtonProps {
    productId: string;
}

export function ProductEditButton({ productId }: ProductEditButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-brand hover:bg-brand-light/50 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
            >
                <Pencil className="w-4 h-4" />
            </Button>

            <ProductEditModal
                productId={productId}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
