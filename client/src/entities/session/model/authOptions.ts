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
                        roles: user.roles,
                        sessionId: user.sessionId,
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
                token.userId = user.userId;
                token.email = user.email!;
                token.roles = user.roles;
                token.sessionId = user.sessionId;
                return token;
            }

            return token;
        },
        async session({ session, token }) {
            session.user.id = String(token.userId);
            session.user.email = token.email;
            session.user.roles = token.roles;
            session.sessionId = token.sessionId;

            session.error = undefined;

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
