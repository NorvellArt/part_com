'use client';

import { useBulkPublishProducts } from '@/features/edit-product';

interface BulkPublicationStatusSelectProps {
    selectedIds: string[];
    onSuccessAction: () => void;
}

export function BulkPublicationStatusSelect({
    selectedIds,
    onSuccessAction,
}: BulkPublicationStatusSelectProps) {
    const { mutate: bulkPublish, isPending } = useBulkPublishProducts();

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (!value || selectedIds.length === 0) return;

        const isPublished = value === 'publish';
        const actionText = isPublished ? 'опубликовать' : 'скрыть в черновики';

        const confirmAction = window.confirm(
            `Вы уверены, что хотите ${actionText} выбранные товары (${selectedIds.length} шт.)?`,
        );

        if (confirmAction) {
            bulkPublish(
                { productIds: selectedIds, isPublished },
                {
                    onSuccess: () => {
                        onSuccessAction();
                    },
                    onError: (error) => {
                        alert('Не удалось изменить статус публикации товаров.');
                        console.error('Bulk publication error:', error);
                    },
                },
            );
        }

        e.target.value = '';
    };

    return (
        <select
            defaultValue=""
            onChange={handleStatusChange}
            disabled={isPending}
            className="h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <option
                value=""
                disabled
                hidden
            >
                {isPending ? 'Обновление...' : 'Статус публикации'}
            </option>
            <option value="publish">Опубликовать на сайте</option>
            <option value="hide">Скрыть (в черновики)</option>
        </select>
    );
}
