import { LoginCredentialsDto, UserAuthDto } from '@/entities/session/model/types';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:5286';

export const sessionApi = {
    async login(credentials: LoginCredentialsDto): Promise<UserAuthDto> {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || 'Неверный Email или пароль');
        }

        return res.json();
    },

    async refreshToken(data: { accessToken: string; refreshToken: string }): Promise<UserAuthDto> {
        const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('Истек срок действия сессии');
        }

        return res.json();
    },
};