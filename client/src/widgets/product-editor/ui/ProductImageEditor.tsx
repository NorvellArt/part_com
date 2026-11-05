'use client';

import React, { useRef } from 'react';
import { ProductImage } from '@/entities/product';
import {
    useUploadProductImage,
    useDeleteProductImage,
    usePasteImage,
} from '@/features/edit-product';
import { Button, Label } from '@/shared/components';
import { Upload, Trash2, Loader2, ClipboardPaste } from 'lucide-react';

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

    const uploadFile = async (file: File) => {
        onStatusChange(null);
        const formDataFile = new FormData();
        formDataFile.append('file', file);

        try {
            await uploadImage(formDataFile);
            onStatusChange({
                type: 'success',
                text: 'Изображение успешно обновлено',
            });
            onRefresh();
        } catch {
            onStatusChange({
                type: 'error',
                text: 'Не удалось загрузить изображение',
            });
        }
    };

    const { pasteFromClipboard, isPasting } = usePasteImage({
        onSuccess: uploadFile,
        onError: (text) => onStatusChange({ type: 'error', text }),
    });

    const isPending = isUploading || isDeleting || isPasting;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await uploadFile(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
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
                text: 'Изображение успешно удалено',
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
        <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
            {/* Шапка секции */}
            <div className="flex flex-col gap-1">
                <Label className="text-sm font-semibold text-foreground">
                    Изображение товара
                </Label>
                <p className="text-xs text-muted-foreground">
                    JPG, PNG или WebP до 5 МБ
                </p>
            </div>

            {/* Зона отображения */}
            <div className="w-full aspect-square overflow-hidden rounded-xl border bg-muted/20 flex items-center justify-center">
                <ProductImage
                    src={imageUrl}
                    alt={`${productBrand} ${productName}`}
                    className="h-full w-full object-contain p-2"
                />
            </div>

            {/* Кнопки строго в одну колонку */}
            <div className="flex flex-col gap-2 w-full">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={isPending}
                />

                <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-center text-sm"
                    disabled={isPending}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4 shrink-0" />
                    )}
                    Выбрать файл
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-center text-sm"
                    disabled={isPending}
                    onClick={pasteFromClipboard}
                >
                    {isPasting ? (
                        <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />
                    ) : (
                        <ClipboardPaste className="mr-2 h-4 w-4 shrink-0" />
                    )}
                    Вставить из буфера
                </Button>

                {/* Кнопка удаления — всегда внизу списка кнопок, если картинка загружена */}
                {imageUrl && (
                    <Button
                        type="button"
                        variant="destructive"
                        className="w-full justify-center text-sm mt-1"
                        disabled={isPending}
                        onClick={handleDelete}
                    >
                        {isDeleting ? (
                            <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />
                        ) : (
                            <Trash2 className="mr-2 h-4 w-4 shrink-0" />
                        )}
                        Удалить изображение
                    </Button>
                )}
            </div>
        </div>
    );
}
