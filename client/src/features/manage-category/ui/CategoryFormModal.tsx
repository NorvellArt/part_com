'use client';

import { useState, useEffect } from 'react';
import { CategoryNode } from '@/entities/category/model/types';

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, slug: string) => Promise<void>;
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSave(name, slug);
            onClose();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
                <h3 className="text-lg font-bold mb-4">
                    {editNode
                        ? `Редактировать: ${editNode.name}`
                        : parentNode
                          ? `Подкатегория для "${parentNode.name}"`
                          : 'Новая корневая категория'}
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Название
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            className="w-full border p-2 rounded-md focus:outline-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug (URL)
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) =>
                                setSlug(
                                    e.target.value
                                        .toLowerCase()
                                        .replace(/\s+/g, '-'),
                                )
                            }
                            className="w-full border p-2 rounded-md focus:outline-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        disabled={isSubmitting}
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim() || !slug.trim() || isSubmitting}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>
        </div>
    );
}
