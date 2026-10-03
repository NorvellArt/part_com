'use client';

import { useState } from 'react';
import { Button } from '@/shared/components';
import { FileSpreadsheet } from 'lucide-react';
import { ExcelImportModal } from '@/features/import-excel';

export function ExcelImportButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
            >
                <FileSpreadsheet className="w-4 h-4" />
                Импорт из Excel
            </Button>

            <ExcelImportModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}