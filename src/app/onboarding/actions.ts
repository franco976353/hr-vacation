"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function submitOnboarding(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("No autenticado");

    const name = formData.get("name") as String;
    const surname = formData.get("surname") as String;
    const position = formData.get("position") as String;
    const orgName = formData.get("organization") as String;
    const birthdayStr = formData.get("birthday") as String;
    const joinDateStr = formData.get("join_date") as String;

    if (!name || !surname || !position || !joinDateStr || !orgName) {
        throw new Error("Faltan campos obligatorios");
    }

    const joinDate = new Date(joinDateStr as string);
    const birthday = birthdayStr ? new Date(birthdayStr as string) : null;

    // Calcular antigüedad
    const today = new Date();
    let yearsOfService = today.getFullYear() - joinDate.getFullYear();
    const m = today.getMonth() - joinDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < joinDate.getDate())) {
        yearsOfService--;
    }

    // Regla de Negocio: Calcular saldos iniciales
    let saldo_corridos = 0;
    let saldo_habiles = 0;

    if (yearsOfService < 5) {
        saldo_corridos = 14;
        saldo_habiles = 5;
    } else if (yearsOfService >= 5 && yearsOfService < 10) {
        saldo_corridos = 21;
        saldo_habiles = 5;
    } else if (yearsOfService >= 10 && yearsOfService < 20) {
        saldo_corridos = 28;
        saldo_habiles = 10;
    } else {
        saldo_corridos = 35;
        saldo_habiles = 10;
    }

    // Buscar o crear la organización por el nombre seleccionado
    const domain = session.user.email.split('@')[1] || "masterbroker.com.ar";

    // Primero, intenta buscar si ya existe una organización con ese nombre
    // Usamos findFirst en lugar de findUnique porque Name no es @unique en el schema actua.
    let org = await prisma.organization.findFirst({ where: { name: orgName as string } });
    if (!org) {
        // En caso que el dominio colisione, generamos uno ad-hoc para la organizacion nueva
        const slugDomain = `${(orgName as string).replace(/\s+/g, '').toLowerCase()}.com`;
        org = await prisma.organization.create({
            data: { name: orgName as string, domain: slugDomain }
        });
    }

    // Upsert: Si el usuario existe lo actualiza, si no existe (ej: mock dev) lo crea
    await prisma.user.upsert({
        where: { email: session.user.email },
        update: {
            name: name as string,
            surname: surname as string,
            position: position as string,
            birthday: birthday,
            join_date: joinDate,
            saldo_dias_corridos: saldo_corridos,
            saldo_dias_habiles: saldo_habiles,
            organizationId: org.id
        },
        create: {
            email: session.user.email,
            password: "", // Add a dummy password for Prisma constraints; the user should already exist anyway.
            name: name as string,
            surname: surname as string,
            position: position as string,
            birthday: birthday,
            join_date: joinDate,
            saldo_dias_corridos: saldo_corridos,
            saldo_dias_habiles: saldo_habiles,
            organizationId: org.id
        }
    });

    redirect("/dashboard");
}
