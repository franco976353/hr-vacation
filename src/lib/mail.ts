import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(email: string, token: string) {
    // Generar cuenta de prueba para desarrollo si no hay configurado un SMTP
    let transporter;

    if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT) || 587,
            secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });
    } else {
        // Cuenta de prueba en desarrollo (Ethereal)
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    const info = await transporter.sendMail({
        from: '"HR Vacation" <noreply@hr-vacation.local>',
        to: email,
        subject: "Restablece tu contraseña",
        html: `
            <h1>Restablecimiento de Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña en el sistema de HR Vacation.</p>
            <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
            <a href="${resetUrl}">Restablecer contraseña</a>
            <p>Si no solicitaste esto, ignora este correo.</p>
        `,
    });

    if (!process.env.EMAIL_SERVER_HOST) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
}
