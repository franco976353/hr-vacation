"use client";

import { useState } from "react";
import { X, Info } from "lucide-react";

type UserStats = {
    name: string | null;
    surname: string | null;
    position: string | null;
    join_date: Date | null;
    birthday?: Date | null;
};

export default function MyDataModal({ userStats, email }: { userStats: UserStats, email: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsOpen(prev => !prev)}
                className="group relative ml-3 bg-white/5 border border-white/10 hover:border-[var(--electric-blue)]/50 hover:bg-[var(--electric-blue)]/10 text-gray-300 hover:text-white rounded-full p-2 transition-all duration-300 cursor-pointer flex items-center justify-center shadow-[0_0_15px_rgba(0,195,255,0.05)] hover:shadow-[0_0_20px_rgba(0,195,255,0.2)]"
            >
                <Info className="w-5 h-5" />
                
                {/* Tooltip Hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#1A1F2B] border border-[var(--electric-blue)]/30 text-xs text-[var(--electric-blue)] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-[0_0_15px_rgba(0,195,255,0.2)]">
                    Ver mis datos
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1F2B] border-r border-b border-[var(--electric-blue)]/30 rotate-45"></div>
                </div>
            </button>

            {/* Expanded Inline Panel */}
            {isOpen && (
                <div className="w-full mt-4 bg-[#0A101F] border border-[var(--electric-blue)]/30 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,195,255,0.1)] relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                    
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
                        <div className="w-1.5 h-5 bg-[var(--electric-blue)] rounded-full shadow-[0_0_10px_rgba(0,195,255,0.8)]"></div>
                        Mis Datos Personales
                    </h2>
                    
                    <ul className="space-y-4 text-sm mt-3">
                        <li className="flex flex-col">
                            <span className="text-gray-500 font-medium uppercase tracking-wider text-xs">Nombre Completo</span>
                            <span className="text-white mt-1 text-base font-semibold">{userStats?.name} {userStats?.surname}</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-gray-500 font-medium uppercase tracking-wider text-xs">Cargo / Puesto</span>
                            <span className="text-white mt-1 text-base font-semibold">{userStats?.position}</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-gray-500 font-medium uppercase tracking-wider text-xs">Fecha de Ingreso</span>
                            <span className="text-white mt-1 text-base font-semibold">
                                {userStats?.join_date ? new Date(userStats.join_date).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : '-'}
                            </span>
                        </li>
                        {userStats?.birthday && (
                        <li className="flex flex-col">
                            <span className="text-gray-500 font-medium uppercase tracking-wider text-xs">Fecha de Nacimiento</span>
                            <span className="text-white mt-1 text-base font-semibold">
                                {new Date(userStats.birthday).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
                            </span>
                        </li>
                        )}
                        <li className="flex flex-col pt-2 border-t border-white/5 mt-3">
                            <span className="text-gray-500 font-medium uppercase tracking-wider text-xs mt-1">Email</span>
                            <span className="text-[var(--electric-blue)] mt-1 text-sm font-medium truncate">{email}</span>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
}
