'use client';

import { CategoryTree } from '@/widgets/category-tree/ui/CategoryTree';

export default function AdminCategoriesPage() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Панель управления каталогом
                    </h1>
                    <p className="text-sm text-gray-500">
                        Конфигурирование трехуровневой иерархии товаров.
                    </p>
                </div>

                <CategoryTree />
            </div>
        </div>
    );
}
