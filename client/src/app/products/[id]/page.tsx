'use client';

import { useParams, useRouter } from 'next/navigation';
import { ProductEditor } from '@/widgets/product-editor';
import { Button } from '@/shared';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <main className="container mx-auto p-6 max-w-4xl">
            <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="mb-6 hover:bg-accent"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Назад к каталогу
            </Button>

            <ProductEditor productId={id} />
        </main>
    );
}