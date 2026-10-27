'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryNode } from '@/entities/category/model/types';
import {
    Button,
    Input,
    Label,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/shared/components';
import { CategoryFormValues, categorySchema } from '../model/categorySchema';

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, slug: string) => void;
    editNode: CategoryNode | null;
    parentNode: CategoryNode | null;
}

export function CategoryFormModal({
    isOpen,
    onClose,
    onSave,
    editNode,
    parentNode,
}: CategoryFormModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            slug: '',
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (isOpen) {
            if (editNode) {
                reset({
                    name: editNode.name,
                    slug: editNode.slug,
                });
            } else {
                reset({
                    name: '',
                    slug: '',
                });
            }
        }
    }, [editNode, isOpen, reset]);

    const onSubmit = (data: CategoryFormValues) => {
        onSave(data.name, data.slug);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {editNode
                            ? `Редактировать: ${editNode.name}`
                            : parentNode
                              ? `Подкатегория для "${parentNode.name}"`
                              : 'Новая корневая категория'}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 py-2"
                >
                    <div className="space-y-1">
                        <Label htmlFor="category-name">Название</Label>
                        <Input
                            id="category-name"
                            type="text"
                            autoComplete="off"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="category-slug">Slug (URL)</Label>
                        <Input
                            id="category-slug"
                            type="text"
                            autoComplete="off"
                            {...register('slug')}
                            onChange={(e) => {
                                const formattedValue = e.target.value
                                    .toLowerCase()
                                    .replace(/\s+/g, '-');
                                setValue('slug', formattedValue, {
                                    shouldValidate: true,
                                });
                            }}
                        />
                        {errors.slug && (
                            <p className="text-xs text-destructive">
                                {errors.slug.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isValid}
                        >
                            Сохранить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
