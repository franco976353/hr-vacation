"use client";

import { useState } from "react";
import { Users, FileText, Clock } from "lucide-react";

interface AdminTabsProps {
    usersContent: React.ReactNode;
    requestsContent: React.ReactNode;
    usersCount: number;
    pendingCount: number;
}

export default function AdminTabs({ 
    usersContent, 
    requestsContent,
    usersCount,
    pendingCount
}: AdminTabsProps) {
    const [active, setActive] = useState<"users" | "requests">("users");

    return (
        <div className="w-full">
            {/* Nav Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                    onClick={() => setActive("users")}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                        active === "users" 
                        ? "bg-[var(--electric-blue)]/10 text-[var(--electric-blue)] border border-[var(--electric-blue)]/30 shadow-[0_0_20px_rgba(0,195,255,0.15)]" 
                        : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white"
                    }`}
                >
                    <Users className="w-5 h-5" />
                    Directorio de Usuarios
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                        active === "users" 
                        ? "bg-[var(--electric-blue)]/20 text-[var(--electric-blue)]" 
                        : "bg-white/10 text-gray-400"
                    }`}>
                        {usersCount}
                    </span>
                </button>
                <button 
                    onClick={() => setActive("requests")}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 relative ${
                        active === "requests" 
                        ? "bg-[var(--metallic-blue)]/10 text-[#4a8bd5] border border-[var(--metallic-blue)]/30 shadow-[0_0_20px_rgba(74,139,213,0.15)]" 
                        : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white"
                    }`}
                >
                    <FileText className="w-5 h-5" />
                    Gestión de Solicitudes
                    
                    {/* Indicador de Pendientes en la Pestaña */}
                    {pendingCount > 0 && (
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ml-2 ${
                            active === "requests" 
                            ? "bg-yellow-500/20 text-yellow-500" 
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}>
                            <Clock className="w-3 h-3" />
                            {pendingCount} Pendientes
                        </span>
                    )}

                    {pendingCount > 0 && active !== "requests" && (
                        <div className="absolute top-0 right-0 -mt-2 -mr-2">
                             <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
                            </span>
                        </div>
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="w-full relative min-h-[500px]">
                <div className={`transition-all duration-300 ${active === "users" ? "opacity-100 translate-y-0 relative z-10" : "opacity-0 translate-y-4 absolute top-0 left-0 w-full pointer-events-none -z-10"}`}>
                    {usersContent}
                </div>
                <div className={`transition-all duration-300 ${active === "requests" ? "opacity-100 translate-y-0 relative z-10" : "opacity-0 translate-y-4 absolute top-0 left-0 w-full pointer-events-none -z-10"}`}>
                    {requestsContent}
                </div>
            </div>
        </div>
    );
}
