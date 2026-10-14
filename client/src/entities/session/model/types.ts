import { DefaultSession } from 'next-auth';

type RoleType = 'ADMIN' | 'USER'; 

export interface UserAuthDto {
    userId: string;
    email: string;
    roles: RoleType[];
    sessionId: string;
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
        sessionId: string;
        error?: never;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId: string;
        email: string;
        roles: RoleType[];
        sessionId: string;
    }
}
