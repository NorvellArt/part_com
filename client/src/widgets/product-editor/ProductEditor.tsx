'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProduct, ProductImage } from '@/entities/product';
import { useUpdateProduct } from '@/features/edit-product';
import { DeleteProductButton } from '@/features/delete-product';
import { Button, Input, Label } from '@/shared/components';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ProductEditorProps {
    productId: string;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({ productId }) => {
    const router = useRouter();

    const { data: product, isLoading, isError } = useProduct(productId);
    const { mutateAsync: updateProduct, isPending: isUpdating } =
        useUpdateProduct(productId);

    const [formData, setFormData] = useState({
        brand: '',
        itemNumber: '',
        name: '',
        price: 0,
        quantity: 0,
        imageUrl: '',
    });

    const [statusMessage, setStatusMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    useEffect(() => {
        if (product) {
            setFormData({
                brand: product.brand ?? '',
                itemNumber: product.itemNumber ?? '',
                name: product.name ?? '',
                price: product.price ?? 0,
                quantity: product.quantity ?? 0,
                imageUrl: product.imageUrl ?? '',
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage(null);
        try {
            await updateProduct(formData);
            setStatusMessage({
                type: 'success',
                text: 'Данные автозапчасти успешно обновлены',
            });
        } catch {
            setStatusMessage({
                type: 'error',
                text: 'Не удалось сохранить изменения',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">
                    Загрузка карточки товара...
                </span>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive font-medium text-lg mb-4">
                    Автозапчасть не найдена или возникла ошибка.
                </p>
                <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                >
                    Вернуться в каталог
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {product.name}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Артикул:{' '}
                        <span className="font-mono font-medium">
                            {product.itemNumber}
                        </span>{' '}
                        | Бренд: {product.brand}
                    </p>
                </div>

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
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
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
                    <Label className="mb-2 block">Изображение товара</Label>
                    <ProductImage
                        src={formData.imageUrl || null}
                        alt={product.name}
                        brand={product.brand}
                        className="w-full h-56 rounded-lg border"
                    />
                </div>

                <form
                    onSubmit={handleSave}
                    className="md:col-span-2 space-y-4"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand">Производитель (Бренд)</Label>
                            <Input
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="itemNumber">
                                Артикул (Номер детали)
                            </Label>
                            <Input
                                id="itemNumber"
                                name="itemNumber"
                                value={formData.itemNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Наименование детали</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Цена (₽)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">
                                Количество на складе (шт.)
                            </Label>
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="0"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">
                            URL изображения (опционально)
                        </Label>
                        <Input
                            id="imageUrl"
                            name="imageUrl"
                            placeholder="https://example.com/image.jpg"
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/')}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                        >
                            {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Сохранить изменения
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
