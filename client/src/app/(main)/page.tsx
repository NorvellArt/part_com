import { redirect } from 'next/navigation';

interface PageProps {
    searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function IndexPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const params = new URLSearchParams();

    if (resolvedSearchParams.q) {
        params.set('q', resolvedSearchParams.q);
    }
    if (resolvedSearchParams.page) {
        params.set('page', resolvedSearchParams.page);
    }

    const queryString = params.toString();
    
    redirect(queryString ? `/catalog?${queryString}` : '/catalog');
}
