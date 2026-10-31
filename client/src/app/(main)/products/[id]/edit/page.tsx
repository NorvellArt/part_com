import { forbidden, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';

import { authOptions } from '@/entities/session';
import { productApi, productKeys } from '@/entities/product';
import { ProductEditPageContent } from './ProductEditPageContent';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ProductEditPage({ params }: Props) {
    const session = await getServerSession(authOptions);

    if (!session) {
        const { id } = await params;
        redirect(`/login?callbackUrl=/products/${id}/edit`);
    }

    const isAdmin = session.user?.roles?.includes('ADMIN');
    if (!isAdmin) {
        forbidden();
    }

    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient
        .query({
            queryKey: productKeys.detail(id),
            queryFn: () => productApi.getById(id),
        })
        .catch(() => {});

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductEditPageContent productId={id} />
        </HydrationBoundary>
    );
}
