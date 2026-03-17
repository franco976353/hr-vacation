import type { NextAuthConfig } from 'next-auth';

// Define the public routes that don't need authentication
export const publicRoutes = [
    '/',
    '/register',
    '/forgot-password',
    '/reset-password',
];

export const authConfig = {
    providers: [], // We add providers in auth.ts to avoid Edge runtime issues with bcryptjs
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

            if (isPublicRoute) {
                if (isLoggedIn && nextUrl.pathname === '/') {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
                return true;
            }

            if (!isLoggedIn) {
                return false;
            }

            return true;
        },
        async session({ session, token }) {
            if (session.user && token?.sub) {
                session.user.id = token.sub;
            }
            if (session.user && token?.role) {
                (session.user as any).role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        }
    },
    pages: {
        signIn: '/',
        error: '/',
    }
} satisfies NextAuthConfig;