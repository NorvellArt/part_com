import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sessionApi } from '@/entities/session/api/sessionApi';

async function refreshAccessToken(token: any) {
    try {
        const refreshedTokens = await sessionApi.refreshToken({
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        });

        return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken,
            refreshTokenExpiresAtUtc: new Date(refreshedTokens.refreshTokenExpiresAtUtc).getTime(),
            error: undefined,
        };
    } catch (error) {
        console.error('Failed to refresh access token:', error);
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
                        id: user.userId,
                        userId: user.userId,
                        email: user.email,
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                        refreshTokenExpiresAtUtc: user.refreshTokenExpiresAtUtc,
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
                token.refreshToken = user.refreshToken;
                token.refreshTokenExpiresAtUtc = new Date(user.refreshTokenExpiresAtUtc).getTime();
                return token;
            }

            if (Date.now() < token.refreshTokenExpiresAtUtc - 60 * 1000) {
                return token;
            }

            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user.id = token.userId;
            session.user.email = token.email;
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.error = token.error;
            return session;
        },
    },
};