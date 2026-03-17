'use client';

import { useState } from 'react';
import { loginAction } from '@/actions/auth-actions';
import GlowButton from '@/components/ui/GlowButton';
import Link from 'next/link';

export default function LoginForm() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(formData: FormData) {
        setError('');
        setLoading(true);

        // Server validation o llamada a server action
        try {
            const res = await loginAction(formData);
            if (res?.error) {
                setError(res.error);
                setLoading(false);
            } else {
                // Redirige o refresca el router
                window.location.href = "/dashboard";
            }
        } catch (err) {
            setError("Error inesperado de red o servidor.");
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm rounded-2xl bg-[#0a101f] border border-blue-900/40 p-8 shadow-[0_0_40px_rgba(0,102,255,0.1)]">
            <h2 className="text-2xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
            <p className="text-gray-400 mb-6 text-sm">Ingresa con tu correo corporativo</p>

            {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg">{error}</div>}

            <form action={handleLogin} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email de Outlook</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="ejemplo@tu-empresa.com"
                        required
                        className="w-full bg-[#111827] text-white border border-gray-700/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-300" htmlFor="password">Contraseña</label>
                        <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#111827] text-white border border-gray-700/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    />
                </div>

                <GlowButton type="submit" className="w-full mt-4 py-3 pb-3" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </GlowButton>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                ¿Aún no tienes cuenta?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Regístrate aquí
                </Link>
            </div>
        </div>
    );
}
