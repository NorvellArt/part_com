import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sessionApi } from '@/entities/session/api/sessionApi';

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
            }

            return token;
        },
        async session({ session, token }) {
            session.user.id = token.userId;
            session.user.email = token.email;
            session.user.roles = token.roles;
            session.accessToken = token.accessToken;

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};