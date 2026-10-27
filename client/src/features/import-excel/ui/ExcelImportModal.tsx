'use client';

import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
    TruncatedFileName,
} from '@/shared/components';
import {
    UploadCloud,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
} from 'lucide-react';
import { useImportExcel } from '../api/importExcelApi';

interface ExcelImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { mutateAsync: importExcelAsync, isPending } = useImportExcel();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [updateName, setUpdateName] = useState<boolean>(true);
    const [updatePrice, setUpdatePrice] = useState<boolean>(true);
    const [updateQuantity, setUpdateQuantity] = useState<boolean>(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = () => {
        setSelectedFile(null);
        setErrorMessage(null);
        setSuccessMessage(null);
        setUpdateName(true);
        setUpdatePrice(true);
        setUpdateQuantity(true);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const validateAndSetFile = (file: File) => {
        setErrorMessage(null);
        setSuccessMessage(null);
        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name
            .substring(file.name.lastIndexOf('.'))
            .toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            setErrorMessage(
                'Неверный формат файла. Выберите файл .xlsx или .xls',
            );
            setSelectedFile(null);
            return;
        }
        setSelectedFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) validateAndSetFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) validateAndSetFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        try {
            setErrorMessage(null);

            const disabledColumns: string[] = [];
            if (!updateName) disabledColumns.push('НАИМЕНОВАНИЕ');
            if (!updatePrice) disabledColumns.push('ЦЕНА');
            if (!updateQuantity) disabledColumns.push('НАЛИЧИЕ');

            const result = await importExcelAsync({
                file: selectedFile,
                disabledColumns,
            });

            const importedString = result.importedCount
                ? `Добавлено записей: ${result.importedCount} `
                : '';
            const updatedString = result.updatedCount
                ? `Обновлено записей: ${result.updatedCount}`
                : '';

            setSuccessMessage(`${importedString}${updatedString}`);
            setSelectedFile(null);
        } catch (err: unknown) {
            const error = err as Error;
            setErrorMessage(
                error.message ||
                    'Произошла ошибка при загрузке файла на сервер',
            );
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={handleClose}
        >
            <DialogContent className="w-full sm:max-w-[480px] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600" />{' '}
                        Импорт автозапчастей из Excel
                    </DialogTitle>
                    <DialogDescription>
                        Загрузите файл Excel (.xlsx, .xls) со списком товаров
                        (Бренд, Артикул, Наименование, Цена, Количество).
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-2">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            selectedFile
                                ? 'border-primary/50 bg-accent/30'
                                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/20'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <UploadCloud className="w-8 h-8 text-muted-foreground mb-1 stroke-1" />
                        <div className="w-full min-w-0 flex justify-center mb-0.5 px-2">
                            {selectedFile ? (
                                <TruncatedFileName name={selectedFile.name} />
                            ) : (
                                <p className="text-sm font-medium text-center">
                                    Перетащите файл сюда или нажмите для выбора
                                </p>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Поддерживаются .xlsx, .xls до 10MB
                        </p>
                    </div>

                    <div className="p-3 bg-accent/10 border border-muted rounded-md space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Обновлять у существующих товаров:
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={updateName}
                                    onChange={(e) =>
                                        setUpdateName(e.target.checked)
                                    }
                                    className="rounded border-muted-foreground/30 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                />
                                Наименование
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={updatePrice}
                                    onChange={(e) =>
                                        setUpdatePrice(e.target.checked)
                                    }
                                    className="rounded border-muted-foreground/30 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                />
                                Цена
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={updateQuantity}
                                    onChange={(e) =>
                                        setUpdateQuantity(e.target.checked)
                                    }
                                    className="rounded border-muted-foreground/30 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                />
                                Наличие
                            </label>
                        </div>
                    </div>

                    {selectedFile && (
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md text-sm gap-2 w-full min-w-0">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                                <TruncatedFileName name={selectedFile.name} />
                                <span className="text-xs text-muted-foreground shrink-0">
                                    (({(selectedFile.size / 1024).toFixed(1)}{' '}
                                    KB))
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFile(null);
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {isPending && (
                        <div className="flex items-center justify-center gap-2 p-3 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />{' '}
                            Обработка файла и импорт данных...
                        </div>
                    )}

                    {errorMessage && (
                        <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm rounded-md">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isPending}
                    >
                        Закрыть
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedFile || isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />{' '}
                                Загрузка...
                            </>
                        ) : (
                            'Импортировать'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
