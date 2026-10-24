import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';
import { productApi, productKeys } from '@/entities/product';
import { ProductCardView } from '@/widgets/product-editor/ui/ProductCardView';
import { buttonVariants } from '@/shared/components';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;

    const queryClient = new QueryClient();
    await queryClient.query({
        queryKey: productKeys.detail(id),
        queryFn: () => productApi.getById(id),
    });

    return (
        <main className="container mx-auto p-6 max-w-4xl">
            <Link
                href="/"
                className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                    className: 'mb-6 hover:bg-accent',
                })}
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Назад к каталогу
            </Link>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductCardView
                    productId={id}
                />
            </HydrationBoundary>
        </main>
    );
}
