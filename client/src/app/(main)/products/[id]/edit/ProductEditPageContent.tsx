'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { ProductFormEditor } from '@/widgets/product-editor';
import { buttonVariants } from '@/shared/components';

interface ProductEditPageContentProps {
    productId: string;
}

export function ProductEditPageContent({
    productId,
}: ProductEditPageContentProps) {
    const router = useRouter();

    const handleSuccess = () => {
        router.push(`/products/${productId}`);
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <Link
                        href={`/products/${productId}`}
                        className={buttonVariants({
                            variant: 'ghost',
                            size: 'sm',
                            className: 'mb-2 hover:bg-accent',
                        })}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> К карточке товара
                    </Link>
                </div>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <ProductFormEditor
                    productId={productId}
                    onSuccess={handleSuccess}
                />
            </div>
        </div>
    );
}
