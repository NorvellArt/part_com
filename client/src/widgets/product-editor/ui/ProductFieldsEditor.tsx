'use client';

import React, { useState, useEffect } from 'react';
import { useUpdateProduct } from '@/features/edit-product';
import { Button, Input, Label } from '@/shared/components';

interface ProductFieldsEditorProps {
    productId: string;
    initialData: {
        brand: string;
        itemNumber: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl: string;
    };
    onStatusChange: (
        status: { type: 'success' | 'error'; text: string } | null,
    ) => void;
    onSuccess?: () => void;
}

export function ProductFieldsEditor({
    productId,
    initialData,
    onStatusChange,
    onSuccess,
}: ProductFieldsEditorProps) {
    const { mutateAsync: updateProduct, isPending: isUpdating } =
        useUpdateProduct(productId);
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        onStatusChange(null);
        try {
            await updateProduct(formData);
            onStatusChange({
                type: 'success',
                text: 'Данные автозапчасти успешно обновлены',
            });
            if (onSuccess) {
                setTimeout(onSuccess, 300);
            }
        } catch {
            onStatusChange({
                type: 'error',
                text: 'Не удалось сохранить изменения',
            });
        }
    };

    return (
        <form
            onSubmit={handleSave}
            className="space-y-4"
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
                    {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
            </div>
        </form>
    );
}
