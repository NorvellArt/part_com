import { DefaultSession } from 'next-auth';

type RoleType = 'ADMIN' | 'USER'; 
export interface UserAuthDto {
    userId: string;
    email: string;
    accessToken: string;
    roles: RoleType[];
    refreshToken: string;
}

export interface LoginCredentialsDto {
    email: string;
    password: string;
}

export interface RegisterCredentialsDto {
    email: string;
    password: string;
}

declare module 'next-auth' {
    interface User extends UserAuthDto { }

    interface Session {
        user: {
            id: string;
            email: string;
            roles: RoleType[];
        } & DefaultSession['user'];
        accessToken: string;
        refreshToken: string;
        error?: 'RefreshAccessTokenError';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId: string;
        email: string;
        accessToken: string;
        accessTokenExpiresAt: number;
        refreshToken: string;
        refreshTokenExpiresAtUtc: number;
        roles: RoleType[];
        error?: 'RefreshAccessTokenError';
    }
}