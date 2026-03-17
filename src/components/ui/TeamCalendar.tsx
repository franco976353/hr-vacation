"use client";

import { useState } from "react";
import {
    startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
    format, isSameMonth, isToday, addMonths, subMonths, isWithinInterval, startOfDay, endOfDay
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type RequestType = {
    id: string;
    startDate: Date | string;
    endDate: Date | string;
    status: string;
    requestType: string;
    user: {
        name: string | null;
        surname: string | null;
        position: string | null;
        organization: {
            name: string;
        };
    };
};

export default function TeamCalendar({ requests }: { requests: RequestType[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<{ date: Date, events: RequestType[] } | null>(null);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lunes
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = "MMMM yyyy";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    return (
        <div className="bg-[#131720]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 shadow-[0_15px_60px_-15px_rgba(0,195,255,0.1)] relative z-10 transition-all duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--electric-blue)] to-[var(--metallic-blue)] capitalize flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--electric-blue)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--electric-blue)]"></span>
                    </span>
                    {format(currentDate, dateFormat, { locale: es })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 rounded-xl border border-white/10 hover:border-[var(--electric-blue)]/50 hover:bg-[var(--electric-blue)]/10 hover:shadow-[0_0_15px_rgba(0,195,255,0.2)] transition-all duration-300 group">
                        <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[var(--electric-blue)] transition-colors" />
                    </button>
                    <button onClick={nextMonth} className="p-2 rounded-xl border border-white/10 hover:border-[var(--electric-blue)]/50 hover:bg-[var(--electric-blue)]/10 hover:shadow-[0_0_15px_rgba(0,195,255,0.2)] transition-all duration-300 group">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--electric-blue)] transition-colors" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                {weekDays.map((day, idx) => (
                    <div key={idx} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {days.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isDayToday = isToday(day);

                    // Buscar eventos para este día
                    const dayEvents = requests.filter(req => {
                        const reqStart = startOfDay(new Date(req.startDate));
                        const reqEnd = endOfDay(new Date(req.endDate));
                        return isWithinInterval(day, { start: reqStart, end: reqEnd });
                    });

                    return (
                        <div
                            key={idx}
                            onClick={() => dayEvents.length > 0 && setSelectedDay({ date: day, events: dayEvents })}
                            className={`min-h-[50px] md:min-h-[80px] p-1.5 border rounded-xl transition-all duration-300 relative group overflow-hidden 
                                ${!isCurrentMonth ? "bg-[#0a0a0a]/50 border-white/5 opacity-50" : "bg-white/[0.02] border-white/10"} 
                                ${isDayToday ? "border-[var(--electric-blue)]/50 bg-[var(--electric-blue)]/5" : ""} 
                                ${dayEvents.length > 0 ? "hover:bg-white/[0.06] hover:border-[var(--electric-blue)]/30 hover:shadow-[0_0_15px_rgba(0,195,255,0.1)] cursor-pointer hover:scale-[1.02]" : ""}`}
                        >
                            {isDayToday && (
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--metallic-blue)]"></div>
                            )}
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-lg ${isDayToday ? "bg-gradient-to-r from-[var(--electric-blue)] to-[var(--metallic-blue)] text-white shadow-[0_0_10px_rgba(0,195,255,0.4)]" : "text-gray-400 group-hover:text-white transition-colors"
                                    }`}>
                                    {format(day, "d")}
                                </span>
                                {dayEvents.length > 0 && (
                                    <span className="flex items-center justify-center bg-white/10 text-[9px] text-white rounded-full w-4 h-4">{dayEvents.length}</span>
                                )}
                            </div>

                            {/* Contenedor de eventos en celda */}
                            <div className="space-y-1 overflow-y-auto max-h-[40px] md:max-h-[60px] scrollbar-hide">
                                {dayEvents.map(event => {
                                    const statusColor = event.status === "APPROVED"
                                        ? "from-emerald-500/20 to-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                        : event.status === "PENDING"
                                            ? "from-amber-500/20 to-amber-500/10 border-amber-500/30 text-amber-400"
                                            : "from-red-500/20 to-red-500/10 border-red-500/30 text-red-400";

                                    return (
                                        <div key={event.id} className={`p-1 rounded bg-gradient-to-br border backdrop-blur-sm transition-all ${statusColor}`}>
                                            <p className="font-bold text-[8px] sm:text-[9px] truncate flex items-center gap-1" title={`${event.user.name} ${event.user.surname}`}>
                                                <span className={`w-1 h-1 rounded-full ${event.status === "APPROVED" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                                                {event.user.name}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sexy Modal para ver Detalles */}
            {selectedDay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setSelectedDay(null)}
                    ></div>
                    
                    {/* Modal Content */}
                    <div 
                        className="relative bg-[#0A101F] border border-[var(--electric-blue)]/50 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-[0_0_80px_rgba(0,195,255,0.25)] transform transition-all duration-500 ease-out scale-100 opacity-100 animate-pop-3d" 
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <button 
                            onClick={() => setSelectedDay(null)}
                            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white mb-1 capitalize">
                                {format(selectedDay.date, "EEEE d 'de' MMMM", { locale: es })}
                            </h3>
                            <p className="text-[var(--electric-blue)] text-sm font-medium">
                                {selectedDay.events.length} {selectedDay.events.length === 1 ? 'Solicitud' : 'Solicitudes'} este día
                            </p>
                        </div>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedDay.events.map(event => {
                                const isApproved = event.status === "APPROVED";
                                return (
                                    <div key={event.id} className={`p-4 rounded-2xl border ${isApproved ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'} relative overflow-hidden group`}>
                                        <div className={`absolute top-0 left-0 w-1 h-full ${isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                        
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-lg font-bold text-white group-hover:text-[var(--electric-blue)] transition-colors">
                                                {event.user.name} {event.user.surname}
                                            </h4>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {isApproved ? 'Aprobada' : 'Pendiente'}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-300 flex items-center gap-2">
                                                <span className="text-gray-500">Cargo:</span> {event.user.position || "-"}
                                            </p>
                                            <p className="text-sm text-gray-300 flex items-center gap-2">
                                                <span className="text-gray-500">Tipo:</span> 
                                                <span className="capitalize">{event.requestType === "vacaciones" ? "Vacaciones Anuales" : "Licencia Especial"}</span>
                                            </p>
                                            <p className="text-sm text-gray-300 flex items-center gap-2">
                                                <span className="text-gray-500">Período:</span> 
                                                {format(new Date(event.startDate), "dd/MM")} al {format(new Date(event.endDate), "dd/MM")}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
