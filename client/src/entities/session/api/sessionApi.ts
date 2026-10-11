import { fetchApi } from '@/shared';
import { LoginCredentialsDto, UserAuthDto } from '@/entities/session/model/types';

export const sessionApi = {
    async login(credentials: LoginCredentialsDto): Promise<UserAuthDto> {
        return await fetchApi<UserAuthDto>('/api/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    async refreshToken(data: { accessToken: string; refreshToken: string }): Promise<UserAuthDto> {
        return await fetchApi<UserAuthDto>('/api/users/refresh-token', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
