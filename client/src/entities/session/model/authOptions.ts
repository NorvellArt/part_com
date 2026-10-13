import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sessionApi } from '@/entities/session/api/sessionApi';

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000;

async function refreshAccessToken(token: any) {
    try {
        console.log("==> Срок действия AccessToken истек. Запускаем обновление сессии...");

        const refreshedTokens = await sessionApi.refreshToken({
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        });

        console.log("==> Сессия успешно обновлена");

        return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken || token.refreshToken,
            accessTokenExpiresAt: Date.now() + ACCESS_TOKEN_LIFETIME,
            error: undefined,
        };
    } catch (error) {
        console.warn('==> Критическая ошибка ротации токенов:', error);

        return {
            ...token,
            error: 'RefreshAccessTokenError' as const,
        };
    }
}

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                try {
                    const user = await sessionApi.login({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    return {
                        id: String(user.userId),
                        userId: user.userId,
                        email: user.email,
                        accessToken: user.accessToken,
                        roles: user.roles,
                        refreshToken: user.refreshToken,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.email = user.email!;
                token.accessToken = user.accessToken;
                token.roles = user.roles;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpiresAt = Date.now() + ACCESS_TOKEN_LIFETIME;

                return token;
            }

            if (Date.now() < token.accessTokenExpiresAt - 60 * 1000) {
                return token;
            }

            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user.id = token.userId;
            session.user.email = token.email;
            session.user.roles = token.roles;
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.error = token.error;

            if (token.error === 'RefreshAccessTokenError' && !token.accessToken) {
                session.error = token.error;
            } else {
                session.error = undefined;
            }

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
