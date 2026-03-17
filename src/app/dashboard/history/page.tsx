import { auth } from "@/auth";
import GlowButton from "@/components/ui/GlowButton";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default async function HistoryPage() {
    const session = await auth();
    if (!session || !session.user?.email) redirect("/");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            requests: {
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!user) redirect("/onboarding");

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A] text-white p-6 sm:p-12">
            {/* Ambient Lighting Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--electric-blue)] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-12 bg-white/5 border border-white/10 p-6 sm:px-10 rounded-3xl backdrop-blur-xl">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--electric-blue)] to-[var(--metallic-blue)]">
                                Historial de Solicitudes
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Revisa el estado de tus licencias y vacaciones.
                            </p>
                        </div>
                    </div>
                </header>

                <main className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#1A1F2B]/50 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Asunto</th>
                                    <th className="px-6 py-4 font-medium">Período</th>
                                    <th className="px-6 py-4 font-medium text-center">Días Computados</th>
                                    <th className="px-6 py-4 font-medium">Estado</th>
                                    <th className="px-6 py-4 font-medium">Fecha de Carga</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {user.requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white capitalize">
                                                {req.requestType === "vacaciones" ? "Vacaciones Anuales" : "Licencia Especial"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {new Date(req.startDate).toLocaleDateString("es-AR")} - {new Date(req.endDate).toLocaleDateString("es-AR")}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-300 font-medium">
                                            {req.requestType === "vacaciones" ? (
                                                <span className="text-[var(--electric-blue)]">{req.daysUsedCorridos} Corridos</span>
                                            ) : (
                                                <span className="text-[var(--metallic-blue)]">{req.daysUsedHabiles} Hábiles</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.status === "PENDING" && (
                                                <span className="inline-flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-sm font-medium border border-yellow-500/20">
                                                    <Clock className="w-4 h-4" /> Pendiente
                                                </span>
                                            )}
                                            {req.status === "APPROVED" && (
                                                <span className="inline-flex items-center gap-1 text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-sm font-medium border border-green-500/20">
                                                    <CheckCircle className="w-4 h-4" /> Aprobada
                                                </span>
                                            )}
                                            {req.status === "REJECTED" && (
                                                <span className="inline-flex items-center gap-1 text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-sm font-medium border border-red-500/20">
                                                    <XCircle className="w-4 h-4" /> Rechazada
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(req.createdAt).toLocaleDateString("es-AR")}
                                        </td>
                                    </tr>
                                ))}
                                {user.requests.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No tienes solicitudes registradas en el sistema.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
