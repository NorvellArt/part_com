import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/shared';
import { productKeys } from '@/entities/product';

interface ImportExcelResponse {
    importedCount: number;
    updatedCount: number;
}

export async function importExcelApi(file: File): Promise<ImportExcelResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetchApi<ImportExcelResponse>('/api/products/import', {
        method: 'POST',
        body: formData,
    });

    return response;
}

export function useImportExcel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: importExcelApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
}