import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined = undefined;

const makeQueryClient = (): QueryClient => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                refetchOnWindowFocus: false,
            },
        },
    });
};

export const getQueryClient = () => {
    if (typeof window === 'undefined') return makeQueryClient();
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
}