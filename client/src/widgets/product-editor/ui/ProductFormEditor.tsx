'use client';

import { useState } from 'react';
import { useProduct } from '@/entities/product';
import { DeleteProductButton } from '@/features/delete-product';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ProductImageEditor } from './ProductImageEditor';
import { ProductFieldsEditor } from './ProductFieldsEditor';
import { ProductFormEditorSkeleton } from './ProductFormEditorSkeleton'; 

interface ProductFormEditorProps {
    productId: string;
    onSuccess?: () => void;
}

export function ProductFormEditor({
    productId,
    onSuccess,
}: ProductFormEditorProps) {
    const {
        data: product,
        isLoading,
        isError,
        refetch,
    } = useProduct(productId);
    const [statusMessage, setStatusMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    if (isLoading) {
        return <ProductFormEditorSkeleton />;
    }

    if (isError || !product) {
        return (
            <div className="text-center py-12 text-slate-500">
                Ошибка загрузки формы
            </div>
        );
    }

    const initialFieldsData = {
        brand: product.brand ?? '',
        itemNumber: product.itemNumber ?? '',
        name: product.name ?? '',
        price: product.price ?? 0,
        quantity: product.quantity ?? 0,
        imageUrl: product.imageUrl ?? '',
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <span className="text-sm text-slate-500 font-medium">
                    ID товара:{' '}
                    <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                        {productId}
                    </code>
                </span>
                <DeleteProductButton
                    productId={productId}
                    onDeleteError={(msg) =>
                        setStatusMessage({ type: 'error', text: msg })
                    }
                />
            </div>

            {statusMessage && (
                <div
                    className={`flex items-center gap-2 p-4 rounded-lg text-sm ${
                        statusMessage.type === 'success'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-destructive/10 text-destructive'
                    }`}
                >
                    {statusMessage.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 shrink-0" />
                    )}
                    <span>{statusMessage.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <ProductImageEditor
                        productId={productId}
                        imageUrl={product.imageUrl ?? null}
                        productName={product.name}
                        productBrand={product.brand}
                        onStatusChange={setStatusMessage}
                        onRefresh={refetch}
                    />
                </div>
                <div className="md:col-span-2">
                    <ProductFieldsEditor
                        productId={productId}
                        initialData={initialFieldsData}
                        onStatusChange={setStatusMessage}
                        onSuccess={onSuccess}
                    />
                </div>
            </div>
        </div>
    );
}
