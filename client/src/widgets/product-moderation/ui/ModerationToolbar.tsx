'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input, Button } from '@/shared/components';

interface ModerationToolbarProps {
    totalCount: number;
    onSearch: (query: string) => void;
}

export function ModerationToolbar({
    totalCount,
    onSearch,
}: ModerationToolbarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 shrink-0">
            <form
                onSubmit={handleSubmit}
                className="relative max-w-sm w-full flex items-center gap-2"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Поиск по артикулу, бренду или имени..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 rounded-xl bg-white border-slate-200 text-xs w-full focus-visible:ring-blue-500/20"
                    />
                </div>
                <Button
                    type="submit"
                    size="sm"
                    className="h-9 rounded-xl text-xs px-4"
                >
                    Найти
                </Button>
            </form>
            <div className="text-xs font-medium text-slate-400">
                Всего позиций: {totalCount}
            </div>
        </div>
    );
}
