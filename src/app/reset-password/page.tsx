import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Restablecer Contraseña - HR Vacation System',
};

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) {
    const { token } = await searchParams;

    if (!token) {
        redirect('/'); // Si no hay token en la url, vuelve al logueo
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black font-[family-name:var(--font-sans)] w-full relative overflow-hidden p-4">
            <div className="z-10 w-full max-w-sm flex items-center justify-center mt-[-5%] ">
                <ResetPasswordForm token={token} />
            </div>

            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[100px] -z-0"></div>
        </div>
    );
}
