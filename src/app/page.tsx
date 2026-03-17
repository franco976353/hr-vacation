import LoginForm from '@/components/auth/LoginForm';
import ParticlesBackground from '@/components/ui/ParticlesBackground';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-sans)] bg-black overflow-hidden relative">
      <ParticlesBackground />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-2xl text-center sm:text-left z-10 w-full relative">
        <div className="flex flex-col sm:flex-row items-center gap-12 w-full justify-center">
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left z-20">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-4 drop-shadow-lg">
              HR Vacation System
            </h1>
            <p className="text-lg text-gray-200 max-w-md drop-shadow-md font-medium">
              Plataforma de gestión de vacaciones corporativas en un ecosistema privado. Inicia sesión para continuar.
            </p>
          </div>

          <div className="flex-1 w-full max-w-sm flex items-center justify-center z-20">
            <LoginForm />
          </div>
        </div>
      </main>

      {/* Decorative background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] -z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[100px] -z-0"></div>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-500 z-10">
        &copy; {new Date().getFullYear()} Software Interno. Reservado todos los derechos. Creado por Franco Morelli
      </footer>
    </div>
  );
}
