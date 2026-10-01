const isServer = typeof window === 'undefined';

const internalApiUrl = process.env.INTERNAL_API_URL || 'http://localhost:5286';
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5286';

export const API_BASE_URL = isServer ? internalApiUrl : publicApiUrl;

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}