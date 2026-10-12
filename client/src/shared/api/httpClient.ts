import { getSession } from "next-auth/react";

const isServer = typeof window === 'undefined';

const internalApiUrl = process.env.INTERNAL_API_URL || 'http://localhost:5286';
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_BASE_URL = isServer ? internalApiUrl : publicApiUrl;

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    console.log(`[${isServer ? 'SERVER' : 'CLIENT'} FETCH]: ${API_BASE_URL}${endpoint}`);

    const headers = new Headers(options?.headers);

    if (!(options?.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    
    if (!isServer) {
        const session = await getSession();
        if (session?.accessToken) {
            headers.set('Authorization', `Bearer ${session.accessToken}`);
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}