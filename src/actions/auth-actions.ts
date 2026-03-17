"use server"

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import crypto from 'crypto';
import { sendPasswordResetEmail } from "@/lib/mail";

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciales inválidas." };
                default:
                    return { error: "Ocurrió un error al iniciar sesión." };
            }
        }
        throw error;
    }
}

export async function registerAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;

    if (!email || !password || !name) {
        return { error: "Faltan campos obligatorios." };
    }

    try {
        const domain = email.split("@")[1];
        if (!domain) {
            return { error: "Email inválido." };
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: "El email ya está registrado." };
        }

        // Buscar si existe la organización con ese dominio, si no, crearla
        let org = await prisma.organization.findUnique({ where: { domain } });
        if (!org) {
            org = await prisma.organization.create({
                data: {
                    name: domain.split(".")[0].toUpperCase(),
                    domain
                }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                name,
                surname,
                password: hashedPassword,
                organizationId: org.id,
            }
        });

        // Intentar loguear automáticamente después de crear (opcional)
        // Pero aquí requeriremos que inicien sesión
        return { success: "Usuario registrado exitosamente." };
    } catch (error) {
        console.error("Error registering:", error);
        return { error: "Ocurrió un error al registrar el usuario." };
    }
}

export async function forgotPasswordAction(formData: FormData) {
    const email = formData.get("email") as string;
    if (!email) return { error: "Se requiere un email." };

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Decimos que todo salió bien por seguridad (para no revelar qué emails están registrados)
            return { success: "Si el correo está en nuestro sistema, te enviaremos un link para restablecer la contraseña." };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora de validez

        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        await sendPasswordResetEmail(user.email, resetToken);

        return { success: "Si el correo está en nuestro sistema, te enviaremos un link para restablecer la contraseña." };
    } catch (err) {
        console.error(err);
        return { error: "Hubo un problema al procesar la solicitud." };
    }
}

export async function resetPasswordAction(formData: FormData) {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;

    if (!token || !password) return { error: "Falta el token o la nueva contraseña." };

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() } // Token no expirado
            }
        });

        if (!user) {
            return { error: "El token es inválido o ha expirado." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            }
        });

        return { success: "Tu contraseña ha sido restablecida con éxito." };
    } catch (err) {
        return { error: "Ocurrió un error al restablecer la contraseña." };
    }
}
