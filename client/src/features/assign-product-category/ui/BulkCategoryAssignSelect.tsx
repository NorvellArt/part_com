'use client';

import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useCategoriesTree } from '@/entities/category';
import { productKeys } from '@/entities/product';
import { fetchApi } from '@/shared/api/httpClient';
import { CategoryNode } from '@/entities/category/model/types';
import { Loader2, Check } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components';

interface BulkCategoryAssignSelectProps {
    selectedIds: string[];
    onSuccessAction?: () => void;
}

export function BulkCategoryAssignSelect({
    selectedIds,
    onSuccessAction,
}: BulkCategoryAssignSelectProps) {
    const queryClient = useQueryClient();
    const { data: tree = [], isLoading: isTreeLoading } = useCategoriesTree();
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [selectedValue, setSelectedValue] = useState<string>('');

    const getLeafCategories = (
        nodes: CategoryNode[],
    ): { id: string; name: string }[] => {
        const leaves: { id: string; name: string }[] = [];
        const traverse = (node: CategoryNode) => {
            if (node.level === 3) {
                leaves.push({ id: node.id, name: node.name });
            }
            if (node.children && node.children.length > 0) {
                node.children.forEach(traverse);
            }
        };
        nodes.forEach(traverse);
        return leaves.sort((a, b) => a.name.localeCompare(b.name));
    };

    const leafCategories = getLeafCategories(tree);

    const selectItems = [
        { label: "-- Сбросить категорию --", value: "none" },
        ...leafCategories.map(cat => ({
            label: cat.name,
            value: cat.id
        }))
    ];

    const bulkAssignMutation = useMutation({
        mutationFn: async (categoryId: string | null) => {
            return fetchApi<void>(`/api/products/bulk-assign-category`, {
                method: 'PUT',
                body: JSON.stringify({
                    productIds: selectedIds,
                    categoryId,
                }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setSelectedValue('');
                onSuccessAction?.();
            }, 1500);
        },
        onError: () => {
            setSelectedValue('');
            alert('Ошибка при массовом назначении категории');
        },
    });

    const handleValueChange = (val: string | null) => {
        setSelectedValue(val || '');
        if (val === '') return;

        const categoryId = val === 'none' ? null : val;
        bulkAssignMutation.mutate(categoryId);
    };

    return (
        <div className="flex items-center gap-2">
            <Select 
                value={selectedValue} 
                onValueChange={handleValueChange}
                items={selectItems}
                disabled={bulkAssignMutation.isPending || isTreeLoading}
            >
                <SelectTrigger className="w-[260px] h-9 rounded-xl border-blue-200 text-xs bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 shadow-sm text-left">
                    <SelectValue placeholder="Назначить категорию..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-[300px]">
                    <SelectGroup>
                        {selectItems.map((item) => (
                            <SelectItem 
                                key={item.value} 
                                value={item.value}
                                className={`text-xs ${item.value === 'none' ? 'text-red-500 font-medium' : ''}`}
                            >
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {bulkAssignMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600 shrink-0" />
            )}

            {isSuccess && (
                <Check className="h-4 w-4 text-green-600 shrink-0 animate-bounce" />
            )}
        </div>
    );
}
