'use client';

import { useState, useEffect } from 'react';
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
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    useEffect(() => {
        if (editNode) {
            setName(editNode.name);
            setSlug(editNode.slug);
        } else {
            setName('');
            setSlug('');
        }
    }, [editNode, isOpen]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        if (!editNode) {
            const generatedSlug = val
                .toLowerCase()
                .replace(/[^a-zа-я0-9\s-]/g, '')
                .replace(/\s+/g, '-');
            setSlug(generatedSlug);
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!name.trim() || !slug.trim()) return;

        onSave(name, slug);
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
                    onSubmit={handleSubmit}
                    className="space-y-4 py-2"
                >
                    <div className="space-y-1">
                        <Label htmlFor="category-name">Название</Label>
                        <Input
                            id="category-name"
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            autoComplete="off"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="category-slug">Slug (URL)</Label>
                        <Input
                            id="category-slug"
                            type="text"
                            value={slug}
                            onChange={(e) =>
                                setSlug(
                                    e.target.value
                                        .toLowerCase()
                                        .replace(/\s+/g, '-'),
                                )
                            }
                            autoComplete="off"
                        />
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
                            disabled={!name.trim() || !slug.trim()}
                        >
                            Сохранить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
