"use client";

import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/Calendar";
import GlowButton from "@/components/ui/GlowButton";
import Link from "next/link";
import { submitVacationRequest } from "./actions";
import { calculateVacationDays, calculateSpecialDays } from "@/lib/holidays";

export default function RequestVacationPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 5),
    });

    const [type, setType] = useState<"vacaciones" | "especial">("vacaciones");
    const [selectedDays, setSelectedDays] = useState(0);

    const from = date?.from;
    const to = date?.to;

    useEffect(() => {
        if (from && to) {
            const days = type === "vacaciones" 
                ? calculateVacationDays(from, to) 
                : calculateSpecialDays(from, to);
            setSelectedDays(days);
        } else {
            setSelectedDays(0);
        }
    }, [from, to, type]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 sm:p-12">
            <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--electric-blue)] to-[var(--metallic-blue)]">
                        Nueva Solicitud
                    </h1>
                    <p className="text-gray-400">Selecciona las fechas de tu licencia.</p>
                </div>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                    Volver
                </Link>
            </header>

            <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Lado izquierdo: Calendario interactivo */}
                <div>
                    <h2 className="text-xl font-semibold mb-6">Elige tus fechas</h2>
                    <Calendar
                        mode="range"
                        selected={date}
                        onSelect={setDate}
                        className="w-full"
                        numberOfMonths={1}
                    />
                </div>

                {/* Lado derecho: Reglas y Resumen */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    <form action={submitVacationRequest} className="flex flex-col h-full">
                        <h2 className="text-xl font-semibold mb-6">Resumen de la Solicitud</h2>

                        <div className="space-y-6 flex-1">
                            <div>
                                <label className="text-gray-400 block text-sm mb-2">Asunto de licencia</label>
                                <div className="flex flex-col sm:flex-row gap-2 bg-[#131720] p-1 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setType("vacaciones")}
                                        className={`flex-1 py-3 text-sm rounded-lg capitalize transition ${type === "vacaciones"
                                            ? "bg-[var(--electric-blue)] font-bold shadow-lg text-white"
                                            : "text-gray-400 hover:bg-white/5"
                                            }`}
                                    >
                                        Vacaciones
                                    </button>
                                    <div className="flex-1 relative group bg-transparent">
                                        <button
                                            type="button"
                                            onClick={() => setType("especial")}
                                            className={`w-full h-full py-3 text-sm rounded-lg capitalize transition flex items-center justify-center gap-2 ${type === "especial"
                                                ? "bg-[var(--metallic-blue)] text-white font-bold shadow-lg"
                                                : "text-gray-400 hover:bg-white/5"
                                                }`}
                                        >
                                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.8)]"></span>
                                            Licencia especial
                                        </button>
                                        {/* Tooltip Hover */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-[#1A1F2B] border border-white/20 text-xs text-gray-300 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl scale-95 group-hover:scale-100 origin-bottom">
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1A1F2B] border-r border-b border-white/20 rotate-45"></div>
                                            <span className="relative z-10 font-medium">Día de estudio, turno médico, fallecimiento de un familiar, entre otros.</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Inputs ocultos para enviar en el action */}
                                <input type="hidden" name="type" value={type} />
                                <input type="hidden" name="startDate" value={from?.toISOString() || ""} />
                                <input type="hidden" name="endDate" value={to?.toISOString() || ""} />
                                <input type="hidden" name="selectedDays" value={selectedDays} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#131720] p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase">Inicio</p>
                                    <p className="font-semibold">{from ? from.toLocaleDateString('es-AR') : '-'}</p>
                                </div>
                                <div className="bg-[#131720] p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase">Fin</p>
                                    <p className="font-semibold">{to ? to.toLocaleDateString('es-AR') : '-'}</p>
                                </div>
                            </div>

                            <div className="bg-[#131720] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <span className="text-gray-400 font-medium">Total Días a descontar:</span>
                                <span className="text-3xl font-black text-[var(--electric-blue)]">{selectedDays}</span>
                            </div>
                        </div>

                        <GlowButton type="submit" className="w-full py-4 mt-8" disabled={!from || !to}>
                            Confirmar Solicitud
                        </GlowButton>
                    </form>
                </div>
            </main>
        </div>
    );
}
