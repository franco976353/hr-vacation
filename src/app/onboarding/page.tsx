import { auth } from "@/auth";
import GlowButton from "@/components/ui/GlowButton";
import { redirect } from "next/navigation";
import { submitOnboarding } from "./actions";

export default async function OnboardingPage() {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/");
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A] text-white flex items-center justify-center p-6 sm:p-12">
            {/* Ambient Lighting Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--electric-blue)] opacity-[0.06] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--metallic-blue)] opacity-[0.08] blur-[100px] rounded-full pointer-events-none" />

            <main className="relative z-10 w-full max-w-lg bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--electric-blue)] to-[var(--metallic-blue)]">
                        ¡Bienvenido a Master Broker!
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Para calcular tus saldos de vacaciones, necesitamos algunos datos adicionales.
                    </p>
                </div>

                <form action={submitOnboarding} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    defaultValue={session.user.name?.split(" ")[0] || ""}
                                    className="w-full bg-[#1A1F2B]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)]/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Apellido</label>
                                <input
                                    type="text"
                                    name="surname"
                                    required
                                    defaultValue={session.user.name?.split(" ").slice(1).join(" ") || ""}
                                    className="w-full bg-[#1A1F2B]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)]/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Documento (DNI)</label>
                                <input
                                    type="text"
                                    name="documento"
                                    required
                                    placeholder="Ej: 35123456"
                                    className="w-full bg-[#1A1F2B]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)]/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Sexo</label>
                                <select
                                    name="sexo"
                                    required
                                    className="w-full bg-[#1A1F2B]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)]/50 transition-all appearance-none"
                                >
                                    <option value="" disabled selected>Seleccione...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Cargo / Puesto</label>
                                <input
                                    type="text"
                                    name="position"
                                    required
                                    placeholder="Ej: Ejecutivo Comercial"
                                    className="w-full bg-[#1A1F2B]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)]/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Organización</label>
                                <select
                                    name="organization"
                                    required
                                    className="w-full bg-[#1A1F2B]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)]/50 transition-all appearance-none"
                                >
                                    <option value="" disabled selected>Seleccione...</option>
                                    <option value="Master Broker">Master Broker</option>
                                    <option value="Castellanos">Castellanos</option>
                                    <option value="Amuchastegui">Amuchastegui</option>
                                    <option value="United">United</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    name="birthday"
                                    className="w-full bg-[#1A1F2B]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)]/50 transition-all"
                                    style={{ colorScheme: "dark" }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Ingreso</label>
                                <input
                                    type="month"
                                    name="join_date"
                                    required
                                    className="w-full bg-[#1A1F2B]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)]/50 transition-all"
                                    style={{ colorScheme: "dark" }}
                                />
                            </div>
                        </div>
                    </div>

                    <GlowButton type="submit" className="w-full py-4 mt-8">
                        Completar Perfil
                    </GlowButton>
                </form>
            </main>
        </div>
    );
}
