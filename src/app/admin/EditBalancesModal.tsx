"use client";

import { useState } from "react";
import { updateBalances } from "./actions";

interface EditBalancesModalProps {
    userId: string;
    userName: string;
    initialCorridos: number;
    initialHabiles: number;
}

export default function EditBalancesModal({
    userId,
    userName,
    initialCorridos,
    initialHabiles,
}: EditBalancesModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [corridos, setCorridos] = useState(initialCorridos.toString());
    const [habiles, setHabiles] = useState(initialHabiles.toString());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setCorridos(initialCorridos.toString());
        setHabiles(initialHabiles.toString());
        setError(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const c = parseInt(corridos, 10);
        const h = parseInt(habiles, 10);

        if (isNaN(c) || isNaN(h)) {
            setError("Los valores deben ser números válidos");
            setIsLoading(false);
            return;
        }

        try {
            await updateBalances(userId, c, h);
            setIsOpen(false);
        } catch (err: any) {
            setError(err.message || "Ocurrió un error al actualizar los saldos");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                className="text-sm text-[var(--electric-blue)] hover:text-white transition flex items-center gap-1 font-medium"
            >
                Editar Saldos
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1A1F2B] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--electric-blue)] to-[var(--metallic-blue)] mb-4">
                            Editar saldos - {userName}
                        </h2>

                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Días Corridos
                                </label>
                                <input
                                    type="number"
                                    value={corridos}
                                    onChange={(e) => setCorridos(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)] transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Días Hábiles
                                </label>
                                <input
                                    type="number"
                                    value={habiles}
                                    onChange={(e) => setHabiles(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)] transition"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm mt-2">{error}</p>
                            )}

                            <div className="flex items-center gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition"
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 px-4 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--metallic-blue)] hover:opacity-90 text-white rounded-xl transition disabled:opacity-50 font-medium"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
