'use client'

import { useState, useCallback, useEffect } from 'react';

interface UsePasteImageOptions {
    onSuccess: (file: File) => void;
    onError: (message: string) => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function usePasteImage({ onSuccess, onError }: UsePasteImageOptions) {
    const [isPasting, setIsPasting] = useState(false);

    const validateAndUpload = useCallback((file: File) => {
        if (file.size > MAX_IMAGE_SIZE) {
            onError('Изображение слишком большое (максимум 5 МБ)');
            return false;
        }
        onSuccess(file);
        return true;
    }, [onSuccess, onError]);

    const processClipboardData = useCallback((dataTransfer: DataTransfer | null) => {
        if (!dataTransfer) return false;

        const items = dataTransfer.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                if (file) {
                    return validateAndUpload(file);
                }
            }
        }
        return false;
    }, [validateAndUpload]);

    const pasteFromClipboard = useCallback(async () => {
        setIsPasting(true);
        try {
            if (!navigator.clipboard) {
                throw new Error('Ваш браузер не поддерживает буфер обмена');
            }

            if (navigator.clipboard.read) {
                const clipboardItems = await navigator.clipboard.read();
                for (const item of clipboardItems) {
                    const imageTypes = item.types.filter(type => type.startsWith('image/'));
                    if (imageTypes.length > 0) {
                        const blob = await item.getType(imageTypes[0]);
                        const file = new File([blob], `pasted-${Date.now()}.png`, { type: imageTypes[0] });

                        validateAndUpload(file);
                        return;
                    }
                }
                throw new Error('В буфере обмена нет изображения');
            }

            throw new Error('Операция чтения отклонена браузером');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Доступ к буферу запрещен';
            onError(`${message}. Используйте Ctrl+V (Cmd+V) прямо на странице.`);
        } finally {
            setIsPasting(false);
        }
    }, [validateAndUpload, onError]);

    useEffect(() => {
        const handleGlobalPaste = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            const wasImageProcessed = processClipboardData(e.clipboardData);
            if (wasImageProcessed) {
                e.preventDefault();
            }
        };

        window.addEventListener('paste', handleGlobalPaste);
        return () => {
            window.removeEventListener('paste', handleGlobalPaste);
        };
    }, [processClipboardData]);

    return {
        pasteFromClipboard,
        isPasting,
    };
}
