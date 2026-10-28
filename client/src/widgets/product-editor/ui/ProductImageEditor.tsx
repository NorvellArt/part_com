'use client';

import React, { useRef } from 'react';
import { ProductImage } from '@/entities/product';
import {
    useUploadProductImage,
    useDeleteProductImage,
} from '@/features/edit-product';
import { Button, Label } from '@/shared/components';
import { Upload, Trash2, Loader2 } from 'lucide-react';

interface ProductImageEditorProps {
    productId: string;
    imageUrl: string | null;
    productName: string;
    productBrand: string;
    onStatusChange: (
        status: { type: 'success' | 'error'; text: string } | null,
    ) => void;
    onRefresh: () => void;
}

export function ProductImageEditor({
    productId,
    imageUrl,
    productName,
    productBrand,
    onStatusChange,
    onRefresh,
}: ProductImageEditorProps) {
    const { mutateAsync: uploadImage, isPending: isUploading } =
        useUploadProductImage(productId);
    const { mutateAsync: deleteImage, isPending: isDeleting } =
        useDeleteProductImage(productId);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isPending = isUploading || isDeleting;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        onStatusChange(null);
        const formDataFile = new FormData();
        formDataFile.append('file', file);

        try {
            await uploadImage(formDataFile);
            onStatusChange({
                type: 'success',
                text: 'Изображение товара успешно обновлено',
            });
            onRefresh();
        } catch {
            onStatusChange({
                type: 'error',
                text: 'Не удалось загрузить изображение',
            });
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async () => {
        if (
            !window.confirm(
                'Вы уверены, что хотите удалить изображение товара?',
            )
        )
            return;

        onStatusChange(null);
        try {
            await deleteImage();
            onStatusChange({
                type: 'success',
                text: 'Изображение товара успешно удалено',
            });
            onRefresh();
        } catch {
            onStatusChange({
                type: 'error',
                text: 'Не удалось удалить изображение',
            });
        }
    };

    return (
        <div className="space-y-3">
            <Label className="block text-slate-600">Изображение товара</Label>

            <div className="relative group rounded-lg overflow-hidden border bg-slate-50">
                <ProductImage
                    src={imageUrl}
                    alt={productName}
                    brand={productBrand}
                    className="w-full h-52 object-cover"
                />
                {isPending && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                disabled={isPending}
            />

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    disabled={isPending}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="w-4 h-4" />
                    {imageUrl ? 'Изменить' : 'Загрузить'}
                </Button>

                {imageUrl && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="px-3"
                        disabled={isPending}
                        onClick={handleDelete}
                        title="Удалить изображение"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
