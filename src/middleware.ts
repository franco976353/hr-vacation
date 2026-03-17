import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Inicializamos NextAuth SOLO con la configuración compatible con Edge
export default NextAuth(authConfig).auth;

export const config = {
    // Aquí definimos en qué rutas debe actuar el middleware.
    // Esta expresión regular protege toda la app excepto los archivos estáticos y la API.
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};