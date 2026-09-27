'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/presentation/components/ui/input';
import { Search, Loader2, X } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';

export function HeaderSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const queryParam = searchParams.get('q') ?? '';
    const [value, setValue] = useState(queryParam);

    useEffect(() => {
        setValue(queryParam);
    }, [queryParam]);

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (term.trim()) {
            params.set('q', term.trim());
        } else {
            params.delete('q');
        }

        const targetPath = pathname.startsWith('/search')
            ? pathname
            : '/search';

        startTransition(() => {
            router.push(`${targetPath}?${params.toString()}`, {
                scroll: false,
            });
        });
    }, 300);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);
        handleSearch(val);
    };

    const handleClear = () => {
        setValue('');
        handleSearch('');
    };

    return (
        <div className="relative w-full max-w-sm">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Search className="h-4 w-4" />
                )}
            </div>

            <Input
                type="search"
                placeholder="Поиск..."
                value={value}
                onChange={onChange}
                className="pl-9 pr-8"
            />

            {value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Очистить</span>
                </Button>
            )}
        </div>
    );
}
