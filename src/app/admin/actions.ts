"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from "next/cache";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function toggleAdminRole(userId: string, currentRole: string) {
    const session = await auth();
    if (!session || !session.user?.email) throw new Error("No autenticado");

    // Verificar si el solicitante es admin
    const caller = await prisma.user.findUnique({ where: { email: session.user.email } });
    const isSuperAdmin = caller?.role === "ADMIN" || session.user.email === "franco.morelli@masterbroker.com.ar";

    if (!isSuperAdmin) {
        throw new Error("No tienes permisos para realizar esta acción");
    }

    // Toggle role
    const newRole = currentRole === "ADMIN" ? "EMPLOYEE" : "ADMIN";

    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
    });

    revalidatePath("/admin");
}

export async function updateBalances(userId: string, corridos: number, habiles: number) {
    const session = await auth();
    if (!session || !session.user?.email) throw new Error("No autenticado");

    // Verificar si el solicitante es admin
    const caller = await prisma.user.findUnique({ where: { email: session.user.email } });
    const isSuperAdmin = caller?.role === "ADMIN" || session.user.email === "franco.morelli@masterbroker.com.ar";

    if (!isSuperAdmin) {
        throw new Error("No tienes permisos para realizar esta acción");
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            saldo_dias_corridos: corridos,
            saldo_dias_habiles: habiles
        }
    });

    revalidatePath("/admin");
}

export async function updateRequestStatus(requestId: string, status: "APPROVED" | "REJECTED" | "PENDING") {
    const session = await auth();
    if (!session || !session.user?.email) throw new Error("No autenticado");

    // Verificar si el solicitante es admin
    const caller = await prisma.user.findUnique({ where: { email: session.user.email } });
    const isSuperAdmin = caller?.role === "ADMIN" || session.user.email === "franco.morelli@masterbroker.com.ar";

    if (!isSuperAdmin) {
        throw new Error("No tienes permisos para realizar esta acción");
    }

    const request = await prisma.vacationRequest.findUnique({
        where: { id: requestId },
        include: { user: true }
    });
    if (!request) throw new Error("Solicitud no encontrada");

    // Logic to refund or subtract days based on status changes
    // Days are already subtracted when PENDING is created.
    if (status === "REJECTED" && request.status !== "REJECTED") {
        // Refund the days
        await prisma.user.update({
            where: { id: request.userId },
            data: {
                saldo_dias_corridos: request.user.saldo_dias_corridos + request.daysUsedCorridos,
                saldo_dias_habiles: request.user.saldo_dias_habiles + request.daysUsedHabiles,
            }
        });
    } else if (status !== "REJECTED" && request.status === "REJECTED") {
        // Re-subtract the days
        await prisma.user.update({
            where: { id: request.userId },
            data: {
                saldo_dias_corridos: request.user.saldo_dias_corridos - request.daysUsedCorridos,
                saldo_dias_habiles: request.user.saldo_dias_habiles - request.daysUsedHabiles,
            }
        });
    }

    await prisma.vacationRequest.update({
        where: { id: requestId },
        data: { status, approverId: caller?.id }
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/history");
}
