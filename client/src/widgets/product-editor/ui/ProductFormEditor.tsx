'use client';

import React, { useState, useEffect } from 'react';
import { useProduct, ProductImage } from '@/entities/product';
import { useUpdateProduct } from '@/features/edit-product';
import { DeleteProductButton } from '@/features/delete-product';
import { Button, Input, Label } from '@/shared/components';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductFormEditorProps {
    productId: string;
    onSuccess?: () => void; // Коллбек для закрытия модалки
}

export function ProductFormEditor({
    productId,
    onSuccess,
}: ProductFormEditorProps) {
    const { data: product, isError } = useProduct(productId);
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

            // Вызываем закрытие модалки с небольшой задержкой,
            // чтобы пользователь успел увидеть статус "успешно"
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 800);
            }
        } catch {
            setStatusMessage({
                type: 'error',
                text: 'Не удалось сохранить изменения',
            });
        }
    };

    if (isError || !product) {
        return (
            <div className="text-center py-12 text-slate-500">
                Ошибка загрузки формы
            </div>
        );
    }

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
                    <Label className="mb-2 block text-slate-600">
                        Изображение товара
                    </Label>
                    <ProductImage
                        src={formData.imageUrl || null}
                        alt={product.name}
                        brand={product.brand}
                        className="w-full h-52 rounded-lg border object-cover bg-slate-50"
                    />
                </div>

                <form
                    onSubmit={handleSave}
                    className="md:col-span-2 space-y-4"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="brand"
                                className="text-slate-600"
                            >
                                Производитель
                            </Label>
                            <Input
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                disabled
                                className="bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed select-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="itemNumber"
                                className="text-slate-600"
                            >
                                Артикул
                            </Label>
                            <Input
                                id="itemNumber"
                                name="itemNumber"
                                value={formData.itemNumber}
                                disabled
                                className="bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed select-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-slate-600"
                        >
                            Наименование
                        </Label>
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
                            <Label
                                htmlFor="price"
                                className="text-slate-600"
                            >
                                Цена (₽)
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="quantity"
                                className="text-slate-600"
                            >
                                Количество
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

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="px-6"
                        >
                            {isUpdating
                                ? 'Сохранение...'
                                : 'Сохранить изменения'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
