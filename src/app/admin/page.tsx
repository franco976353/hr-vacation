import { auth, signOut } from "@/auth";
import GlowButton from "@/components/ui/GlowButton";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ArrowLeft } from "lucide-react";
import AdminDashboardClient from "./AdminDashboardClient";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

export default async function AdminDirectoryPage() {
    const session = await auth();
    if (!session || !session.user?.email) redirect("/");

    // Validar rol de administrador principal
    const caller = await prisma.user.findUnique({ where: { email: session.user.email } });
    const isAdmin = caller?.role === "ADMIN" || session.user.email === "franco.morelli@masterbroker.com.ar";

    if (!isAdmin) {
        redirect("/dashboard");
    }

    // Traer todos los usuarios registrados
    const users = await prisma.user.findMany({
        orderBy: { name: 'asc' }
    });

    // Traer todas las solicitudes
    const requests = await prisma.vacationRequest.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A] text-white p-6 sm:p-12">
            {/* Ambient Lighting Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--electric-blue)] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12 bg-white/5 border border-white/10 p-6 sm:px-10 rounded-3xl backdrop-blur-xl">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--electric-blue)] to-[var(--metallic-blue)]">
                                Panel de Administración
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Gestión de Usuarios y Solicitudes
                            </p>
                        </div>
                    </div>

                    <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                        <GlowButton type="submit" className="py-2 px-4 text-sm">Salir</GlowButton>
                    </form>
                </header>

                <AdminDashboardClient 
                    users={users.map(u => ({
                        ...u,
                        join_date: u.join_date?.toISOString(),
                        birthday: u.birthday?.toISOString(),
                    }))} 
                    requests={requests.map(r => ({
                        ...r,
                        startDate: r.startDate.toISOString(),
                        endDate: r.endDate.toISOString(),
                        createdAt: r.createdAt.toISOString(),
                        user: {
                            ...r.user,
                            join_date: r.user.join_date?.toISOString(),
                            birthday: r.user.birthday?.toISOString(),
                        }
                    }))} 
                />
            </div>
        </div>
    );
}
