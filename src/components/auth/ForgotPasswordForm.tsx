'use client';

import { useState } from 'react';
import { forgotPasswordAction } from '@/actions/auth-actions';
import GlowButton from '@/components/ui/GlowButton';
import Link from 'next/link';

export default function ForgotPasswordForm() {
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    async function handleForgot(formData: FormData) {
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await forgotPasswordAction(formData);
            if (res?.error) {
                setMessage({ text: res.error, type: 'error' });
            } else if (res?.success) {
                setMessage({ text: res.success, type: 'success' });
            }
        } catch (err) {
            setMessage({ text: "Error inesperado.", type: 'error' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm rounded-2xl bg-[#0a101f] border border-blue-900/40 p-8 shadow-[0_0_40px_rgba(30,58,138,0.1)]">
            <h2 className="text-2xl font-bold text-white mb-2">Recuperar Contraseña</h2>
            <p className="text-gray-400 mb-6 text-sm">Ingresa tu email y te enviaremos un link para crear una nueva contraseña.</p>

            {message.text && (
                <div className={`p-3 mb-4 text-sm rounded-lg border ${message.type === 'error' ? 'text-red-400 bg-red-900/20 border-red-900/50' : 'text-green-400 bg-green-900/20 border-green-900/50'}`}>
                    {message.text}
                </div>
            )}

            <form action={handleForgot} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full bg-[#111827] text-white border border-gray-700/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    />
                </div>

                <GlowButton type="submit" className="w-full mt-4 py-3 pb-3" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Link'}
                </GlowButton>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Volver a Iniciar Sesión
                </Link>
            </div>
        </div>
    );
}
