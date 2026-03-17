import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Registro - HR Vacation System',
};

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black font-[family-name:var(--font-sans)] w-full relative overflow-hidden p-4">
            <div className="z-10 w-full max-w-sm flex items-center justify-center mt-[-5%] ">
                <RegisterForm />
            </div>

            {/* Decorative background effects */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] -z-0"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[100px] -z-0"></div>
        </div>
    );
}
