"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { redirect } from "next/navigation";
import { calculateVacationDays, calculateSpecialDays } from "@/lib/holidays";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function submitVacationRequest(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("No autenticado");

    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const type = formData.get("type") as string;

    if (!startDateStr || !endDateStr || !type) {
        throw new Error("Faltan datos de la solicitud");
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Get current user to check balances
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) throw new Error("Usuario no encontrado");

    // Calculate days based on type
    let daysUsedCorridos = 0;
    let daysUsedHabiles = 0;

    const calendarDays = calculateVacationDays(startDate, endDate);
    const businessDays = calculateSpecialDays(startDate, endDate);

    switch (type) {
        case "vacaciones":
            daysUsedCorridos = calendarDays;
            break;
        case "especial":
            daysUsedHabiles = businessDays;
            break;
        default:
            throw new Error("Modo inválido");
    }

    // (Opcional) Validar saldos aquí
    if (user.saldo_dias_corridos < daysUsedCorridos || user.saldo_dias_habiles < daysUsedHabiles) {
        throw new Error("Saldo insuficiente para esta solicitud");
    }

    // Crear la solicitud en DB
    await prisma.vacationRequest.create({
        data: {
            userId: user.id,
            startDate,
            endDate,
            requestType: type,
            daysUsedCorridos,
            daysUsedHabiles,
            status: "PENDING"
        }
    });

    // Descontar saldo provisionalmente (o se descuenta cuando se apruebe, dependiendo de la regla de HR)
    await prisma.user.update({
        where: { id: user.id },
        data: {
            saldo_dias_corridos: user.saldo_dias_corridos - daysUsedCorridos,
            saldo_dias_habiles: user.saldo_dias_habiles - daysUsedHabiles,
        }
    });

    redirect("/dashboard");
}
