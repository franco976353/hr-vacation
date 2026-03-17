import { auth, signOut } from "@/auth";
import GlowButton from "@/components/ui/GlowButton";
import TeamCalendar from "@/components/ui/TeamCalendar";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import MyDataModal from "@/components/ui/MyDataModal";

// Configuración de conexión para obtener datos del usuario
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

export default async function DashboardPage() {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/");
    }

    // Buscamos los datos reales del empleado en la base de datos
    const userStats = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            name: true,
            surname: true,
            saldo_dias_corridos: true,
            saldo_dias_habiles: true,
            position: true,
            join_date: true,
            birthday: true,
            organizationId: true,
        }
    });

    // Flujo de Primer Ingreso (Onboarding):
    if (!userStats?.join_date || !userStats?.position || !userStats?.organizationId) {
        redirect("/onboarding");
    }

    // Solicitudes de todo el equipo de su organización
    const teamRequestsRaw = await prisma.vacationRequest.findMany({
        where: {
            user: {
                organizationId: userStats.organizationId
            },
            status: { in: ["APPROVED", "PENDING"] }
        },
        include: {
            user: {
                select: {
                    name: true,
                    surname: true,
                    position: true,
                    organization: {
                        select: { name: true }
                    }
                }
            }
        }
    });

    const teamRequests = teamRequestsRaw.map(req => ({
        ...req,
        startDate: req.startDate.toISOString(),
        endDate: req.endDate.toISOString(),
    }));

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A] text-white p-4 sm:p-8">
            {/* Ambient Lighting Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--electric-blue)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[var(--metallic-blue)] opacity-[0.06] blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Sidebar: Hola Franco, Mis Datos, Balances, Acciones */}
                <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                    {/* Header: Hola */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                        <div className="flex items-center justify-between mb-2 flex-wrap">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--electric-blue)] to-[var(--metallic-blue)]">
                                Hola, {userStats?.name || session.user.name} 👋
                            </h1>
                            <MyDataModal userStats={userStats as any} email={session.user.email} />
                        </div>
                        <p className="text-gray-400 mt-2 flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-[var(--electric-blue)] animate-pulse"></span>
                            {userStats?.position || "Colaborador"} | Master Broker S.A.
                        </p>
                        
                        <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }} className="mt-6">
                            <GlowButton type="submit" className="w-full py-2 px-4 text-sm">Cerrar Sesión</GlowButton>
                        </form>
                    </div>

                    {/* Balances */}
                    <div className="flex flex-col gap-4">
                        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 overflow-hidden group hover:border-[var(--electric-blue)]/50 transition-all duration-500 backdrop-blur-md">
                            <p className="text-gray-400 uppercase tracking-widest text-xs mb-2 font-semibold flex justify-between items-center">
                                Días Corridos
                                <span className="text-4xl font-black text-white/5 bg-clip-text">C</span>
                            </p>
                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[var(--electric-blue)] to-[#007fb5]">
                                {userStats?.saldo_dias_corridos ?? 0}
                            </span>
                        </div>
                        <div className="relative p-6 rounded-3xl bg-gradient-to-bl from-white/5 to-transparent border border-white/10 overflow-hidden group hover:border-[var(--metallic-blue)]/50 transition-all duration-500 backdrop-blur-md">
                            <p className="text-gray-400 uppercase tracking-widest text-xs mb-2 font-semibold flex justify-between items-center">
                                Días Especiales
                                <span className="text-4xl font-black text-white/5 bg-clip-text">E</span>
                            </p>
                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[var(--metallic-blue)] to-[#4a8bd5]">
                                {userStats?.saldo_dias_habiles ?? 0}
                            </span>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-3">
                        <Link href="/dashboard/request">
                            <GlowButton className="w-full py-3 px-6 font-medium">Nueva Solicitud</GlowButton>
                        </Link>
                        <div className="flex flex-row gap-3">
                            <Link href="/dashboard/history" className="flex-1">
                                <GlowButton className="w-full py-3 px-4 font-medium h-full">Ver Historial</GlowButton>
                            </Link>
                            {session.user.email === "franco.morelli@masterbroker.com.ar" && (
                                <Link href="/admin" className="flex-1">
                                    <GlowButton className="w-full py-3 px-4 h-full">
                                        <div className="flex items-center justify-center gap-2 w-full font-medium h-full">
                                            <span className="relative flex h-2 w-2 shrink-0">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--electric-blue)] opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--electric-blue)]"></span>
                                            </span>
                                            <span>Panel Admin</span>
                                        </div>
                                    </GlowButton>
                                </Link>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Right Content: Calendar */}
                <main className="lg:col-span-8 xl:col-span-9">
                    <div className="w-full max-w-full">
                        <TeamCalendar requests={teamRequests} />
                    </div>
                </main>
            </div>
        </div>
    );
}