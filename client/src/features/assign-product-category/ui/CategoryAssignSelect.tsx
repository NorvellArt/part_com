'use client';

import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useCategoriesTree } from '@/entities/category';
import { productKeys } from '@/entities/product';
import { fetchApi } from '@/shared/api/httpClient';
import { CategoryNode } from '@/entities/category/model/types';
import { Loader2, Check } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components';

interface CategoryAssignSelectProps {
    productId: string;
    currentCategoryId: string | null;
    currentCategoryName: string | null;
}

export function CategoryAssignSelect({ 
    productId, 
    currentCategoryId, 
    currentCategoryName 
}: CategoryAssignSelectProps) {
    const queryClient = useQueryClient();
    const { data: tree = [], isLoading: isTreeLoading } = useCategoriesTree();
    const [isSuccess, setIsSuccess] = useState(false);

    const [selectedValue, setSelectedValue] = useState<string>(currentCategoryId ?? 'none');

    useEffect(() => {
        setSelectedValue(currentCategoryId ?? 'none');
    }, [currentCategoryId]);

    const getLeafCategories = (nodes: CategoryNode[]): { id: string; name: string }[] => {
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

    const assignMutation = useMutation({
        mutationFn: async (categoryId: string | null) => {
            return fetchApi<void>(`/api/products/${productId}/assign-category`, {
                method: 'PUT',
                body: JSON.stringify({ categoryId }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        },
        onError: () => {
            setSelectedValue(currentCategoryId ?? 'none');
            alert('Ошибка при назначении категории');
        },
    });

    const handleValueChange = (val: string | null) => {
        const newValue = val ?? 'none';
        setSelectedValue(newValue);
        assignMutation.mutate(newValue === 'none' ? null : newValue);
    };

    const displayValue = selectedValue === 'none' 
        ? undefined 
        : (leafCategories.find(c => c.id === selectedValue)?.name ?? currentCategoryName ?? undefined);

    if (isTreeLoading && !currentCategoryName) {
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto" />;
    }

    return (
        <div className="flex items-center gap-2">
            <Select
                value={selectedValue}
                onValueChange={handleValueChange}
                disabled={assignMutation.isPending}
            >
                <SelectTrigger className="w-[240px] h-9 rounded-xl border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-500/20">
                    <SelectValue placeholder="Выбрать категорию">
                        {displayValue}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-[300px]">
                    <SelectItem value="none" className="text-xs text-slate-400">
                        -- Без категории --
                    </SelectItem>
                    {leafCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-xs">
                            {cat.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {assignMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600 shrink-0" />
            )}
            
            {isSuccess && (
                <Check className="h-4 w-4 text-green-600 shrink-0 animate-bounce" />
            )}
        </div>
    );
}
