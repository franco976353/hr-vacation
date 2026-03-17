"use client";

import { useState } from "react";
import { Clock, CheckCircle, XCircle, Search, Download, Filter } from "lucide-react";
import AdminTabs from "@/components/ui/AdminTabs";
import EditBalancesModal from "./EditBalancesModal";
import { toggleAdminRole, updateRequestStatus } from "./actions";

type User = any;
type Request = any;

export default function AdminDashboardClient({ users, requests }: { users: User[], requests: Request[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Filtrar usuarios
    const filteredUsers = users.filter((u: User) => 
        `${u.name} ${u.surname} ${u.email} ${u.position || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar solicitudes
    const filteredRequests = requests.filter((req: Request) => {
        const matchSearch = `${req.user.name} ${req.user.surname}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "ALL" || req.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const exportUsersCsv = () => {
        const headers = ["Empleado,Email,Cargo,Ingreso,Dias_Corridos,Dias_Especiales,Rol"];
        const rows = filteredUsers.map((u: User) => 
            `"${u.name} ${u.surname}","${u.email}","${u.position || ""}","${u.join_date ? new Date(u.join_date).toLocaleDateString('es-AR') : ""}","${u.saldo_dias_corridos}","${u.saldo_dias_habiles}","${u.role}"`
        );
        const data = headers.concat(rows).join("\n");
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "usuarios_vacaciones.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportRequestsCsv = () => {
        const headers = ["Empleado,Email,Tipo_Licencia,Dias_Usados,Fecha_Inicio,Fecha_Fin,Estado"];
        const rows = filteredRequests.map((req: Request) => {
            const tipo = req.requestType === "vacaciones" ? "Vacaciones Anuales" : "Licencia Especial";
            const dias = req.requestType === "vacaciones" ? req.daysUsedCorridos : req.daysUsedHabiles;
            const inicio = new Date(req.startDate).toLocaleDateString("es-AR");
            const fin = new Date(req.endDate).toLocaleDateString("es-AR");
            return `"${req.user.name} ${req.user.surname}","${req.user.email}","${tipo}","${dias}","${inicio}","${fin}","${req.status}"`;
        });
        const data = headers.concat(rows).join("\n");
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "solicitudes_vacaciones.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const usersContent = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-[var(--electric-blue)]">Directorio de Usuarios</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar empleado..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1A1F2B] text-white border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[var(--electric-blue)]/50 transition"
                        />
                    </div>
                    <button 
                        onClick={exportUsersCsv}
                        className="flex items-center gap-2 bg-[var(--electric-blue)]/10 hover:bg-[var(--electric-blue)]/20 text-[var(--electric-blue)] px-4 py-2 rounded-xl text-sm font-bold border border-[var(--electric-blue)]/20 transition whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" /> Excel / CSV
                    </button>
                </div>
            </div>
            
            <main className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1A1F2B]/50 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Empleado</th>
                                <th className="px-6 py-4 font-medium">Cargo</th>
                                <th className="px-6 py-4 font-medium flex-nowrap whitespace-nowrap">Ingreso</th>
                                <th className="px-6 py-4 font-medium text-center">Días Corridos</th>
                                <th className="px-6 py-4 font-medium text-center">Días Especiales</th>
                                <th className="px-6 py-4 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredUsers.map((user: User) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-white flex items-center gap-2">
                                            {user.name} {user.surname}
                                            {user.role === "ADMIN" && (
                                                <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 font-bold tracking-wider">ADMIN</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{user.position || "-"}</td>
                                    <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                                        {user.join_date ? new Date(user.join_date).toLocaleDateString('es-AR') : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 bg-[var(--electric-blue)]/10 text-[var(--electric-blue)] border border-[var(--electric-blue)]/20 rounded-lg font-bold">
                                            {user.saldo_dias_corridos}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 bg-[var(--metallic-blue)]/10 text-[#4a8bd5] border border-[var(--metallic-blue)]/20 rounded-lg font-bold">
                                            {user.saldo_dias_habiles}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex flex-col gap-2 items-start">
                                        <EditBalancesModal 
                                            userId={user.id}
                                            userName={`${user.name} ${user.surname}`}
                                            initialCorridos={user.saldo_dias_corridos}
                                            initialHabiles={user.saldo_dias_habiles}
                                        />
                                        <form action={toggleAdminRole.bind(null, user.id, user.role)}>
                                            <button type="submit" className={`text-sm transition flex items-center gap-1 font-medium ${user.role === 'ADMIN' ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'}`}>
                                                {user.role === 'ADMIN' ? 'Quitar Admin' : 'Hacer Admin'}
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No se encontraron resultados para "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );

    const requestsContent = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-[var(--metallic-blue)]">Gestión de Solicitudes</h2>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-56">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar empleado..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1A1F2B] text-white border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[var(--metallic-blue)]/50 transition"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-[#1A1F2B] text-white border border-white/10 rounded-xl py-2 pl-9 pr-8 text-sm focus:outline-none focus:border-[var(--metallic-blue)]/50 transition appearance-none cursor-pointer"
                        >
                            <option value="ALL">Todas</option>
                            <option value="PENDING">Pendientes</option>
                            <option value="APPROVED">Aprobadas</option>
                            <option value="REJECTED">Rechazadas</option>
                        </select>
                    </div>
                    <button 
                        onClick={exportRequestsCsv}
                        className="flex items-center gap-2 bg-[var(--metallic-blue)]/10 hover:bg-[var(--metallic-blue)]/20 text-[#4a8bd5] px-4 py-2 rounded-xl text-sm font-bold border border-[var(--metallic-blue)]/20 transition whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" /> Excel / CSV
                    </button>
                </div>
            </div>

            <main className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1A1F2B]/50 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Empleado</th>
                                <th className="px-6 py-4 font-medium">Detalle</th>
                                <th className="px-6 py-4 font-medium">Fechas</th>
                                <th className="px-6 py-4 font-medium">Estado</th>
                                <th className="px-6 py-4 font-medium">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredRequests.map((req: Request) => (
                                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-white">
                                            {req.user.name} {req.user.surname}
                                        </div>
                                        <div className="text-sm text-gray-500 capitalize">{req.requestType === "vacaciones" ? "Vacaciones Anuales" : "Licencia Especial"}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-300 font-medium whitespace-nowrap">
                                            {req.requestType === "vacaciones" ? (
                                                <span className="text-[var(--electric-blue)]">{req.daysUsedCorridos} Corridos</span>
                                            ) : (
                                                <span className="text-[var(--metallic-blue)]">{req.daysUsedHabiles} Especiales</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm whitespace-nowrap">
                                        {new Date(req.startDate).toLocaleDateString("es-AR")} - {new Date(req.endDate).toLocaleDateString("es-AR")}
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.status === "PENDING" && (
                                            <span className="inline-flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                                                <Clock className="w-3 h-3" /> PENDIENTE
                                            </span>
                                        )}
                                        {req.status === "APPROVED" && (
                                            <span className="inline-flex items-center gap-1 text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                                                <CheckCircle className="w-3 h-3" /> APROBADA
                                            </span>
                                        )}
                                        {req.status === "REJECTED" && (
                                            <span className="inline-flex items-center gap-1 text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
                                                <XCircle className="w-3 h-3" /> RECHAZADA
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {req.status !== "APPROVED" && (
                                                <form action={updateRequestStatus.bind(null, req.id, "APPROVED")}>
                                                    <button type="submit" className="text-green-400 hover:text-green-300 transition-colors bg-green-500/10 hover:bg-green-500/20 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-500/20">
                                                        Aprobar
                                                    </button>
                                                </form>
                                            )}
                                            {req.status !== "REJECTED" && (
                                                <form action={updateRequestStatus.bind(null, req.id, "REJECTED")}>
                                                    <button type="submit" className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-500/20">
                                                        Rechazar
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No se encontraron resultados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );

    return (
        <AdminTabs 
            usersCount={filteredUsers.length}
            pendingCount={filteredRequests.filter((r: Request) => r.status === "PENDING").length}
            usersContent={usersContent}
            requestsContent={requestsContent}
        />
    );
}
