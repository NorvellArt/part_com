import { ReactNode } from 'react';
import { cn } from 'cn';

interface FieldValueProps {
    children: ReactNode;
    className?: string;
}

export function FieldValue({ children, className }: FieldValueProps) {
    return (
        <div
            className={cn(
                'w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm text-foreground select-text min-h-[38px] flex items-center',
                className,
            )}
        >
            {children}
        </div>
    );
}
