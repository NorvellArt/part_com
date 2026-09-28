'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton,
} from '@/presentation/components/ui/input-group';
import { Search, Loader2, X } from 'lucide-react';

export function HeaderSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const queryInUrl = searchParams.get('q') ?? '';
    const [value, setValue] = useState(queryInUrl);

    const isFocused = useRef(false);

    useEffect(() => {
        if (!isFocused.current) {
            setValue(queryInUrl);
        }
    }, [queryInUrl]);

    const targetPath = '/';

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmed = term.trim();

        if (trimmed) {
            params.set('q', trimmed);
        } else {
            params.delete('q');
        }

        const queryString = params.toString();
        const targetUrl = queryString
            ? `${targetPath}?${queryString}`
            : targetPath;

        startTransition(() => {
            router.push(targetUrl, { scroll: false });
        });
    }, 300);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);
        handleSearch(val);
    };

    const handleClear = () => {
        handleSearch.cancel();
        setValue('');

        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');

        const queryString = params.toString();
        const targetUrl = queryString
            ? `${targetPath}?${queryString}`
            : targetPath;

        startTransition(() => {
            router.push(targetUrl, { scroll: false });
        });
    };

    return (
        <div className="relative w-full max-w-sm">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                    <Search className="h-4 w-4" />
                )}
            </div>

            <InputGroup>
                <InputGroupInput
                    type="search"
                    placeholder="Поиск..."
                    value={value}
                    onChange={onChange}
                    onFocus={() => {
                        isFocused.current = true;
                    }}
                    onBlur={() => {
                        isFocused.current = false;
                    }}
                    className="pl-9 pr-8"
                />
                {value && (
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={handleClear}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Очистить</span>
                        </InputGroupButton>
                    </InputGroupAddon>
                )}
            </InputGroup>
        </div>
    );
}
