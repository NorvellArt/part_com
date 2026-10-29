'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateProduct } from '@/features/edit-product';
import { Button, Input, Label } from '@/shared/components';

interface ProductFormValues {
    brand: string;
    itemNumber: string;
    name: string;
    price: number;
    quantity: number;
}

interface ProductFieldsEditorProps {
    productId: string;
    initialData: ProductFormValues;
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

    const { register, handleSubmit, reset } = useForm<ProductFormValues>({
        defaultValues: initialData,
    });

    useEffect(() => {
        reset(initialData);
    }, [
        initialData.name,
        initialData.price,
        initialData.quantity,
        initialData.brand,
        initialData.itemNumber,
        reset,
    ]);

    const onSubmit = async (data: ProductFormValues) => {
        onStatusChange(null);
        try {
            await updateProduct(data);
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
            onSubmit={handleSubmit(onSubmit)}
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
                        disabled
                        className="bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed select-none"
                        {...register('brand')}
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
                        disabled
                        className="bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed select-none"
                        {...register('itemNumber')}
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
                    required
                    {...register('name')}
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
                        type="number"
                        min="0"
                        required
                        {...register('price', { valueAsNumber: true })}
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
                        type="number"
                        min="0"
                        required
                        {...register('quantity', { valueAsNumber: true })}
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
