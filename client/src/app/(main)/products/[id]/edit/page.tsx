import { getServerSession } from 'next-auth';
import { authOptions } from '@/entities/session';
import { redirect } from 'next/navigation';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';
import { productApi, productKeys } from '@/entities/product';
import { ProductFormEditor } from '@/widgets/product-editor/ProductFormEditor';
import { buttonVariants } from '@/shared/components';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ProductEditPage({ params }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.roles?.includes('ADMIN') ?? false;

    if (!isAdmin) {
        redirect(`/products/${id}`);
    }

    const queryClient = new QueryClient();
    await queryClient.query({
        queryKey: productKeys.detail(id),
        queryFn: () => productApi.getById(id),
    });

    return (
        <main className="container mx-auto p-6 max-w-4xl">
            <Link
                href={`/products/${id}`}
                className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                    className: 'mb-6 hover:bg-accent',
                })}
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Отмена
            </Link>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductFormEditor productId={id} />
            </HydrationBoundary>
        </main>
    );
}
