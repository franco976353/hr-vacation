# 🌴 HR Vacation Management

![HR Vacation Banner](https://via.placeholder.com/1200x400/0A0A0A/4A8BD5?text=HR+Vacation+Management+Panel)

**HR Vacation Management** es una plataforma moderna, segura y elegante diseñada para digitalizar la gestión de vacaciones y licencias especiales dentro de la empresa. Ofrece una experiencia impecable tanto para los empleados al momento de solicitar días libres, como para el equipo de Recursos Humanos encargado de administrar el flujo de operaciones.

Construida bajo un stack tecnológico de última generación enfocado en el alto rendimiento, la seguridad de la información y una experiencia de usuario (UX) premium ("Dark Mode First").

---

## ✨ Características Principales

### 👨‍💼 Panel del Empleado
- **Dashboard Interactivo:** Calendario visual e integrado para revisar fácilmente los consumos históricos y el estado diario.
- **Saldos Transparentes:** Visualización clara de los días corridos (Vacaciones Anuales) y días especiales (Licencias) restantes.
- **Solicitudes Inteligentes:** Flujo automatizado de cálculo de días descontables. Excluye automáticamente fines de semana y feriados nacionales en caso de licencias especiales.
- **Historial Completo:** Trazabilidad total de solicitudes pendientes, aprobadas y rechazadas.
- **Autogestión de Perfil:** Posibilidad de visualizar información personal y autogestionar el cambio de contraseña.

### 🛡️ Panel de Administración (RRHH)
- **Directorio Dinámico:** Listado completo en tiempo real de todo el personal activo en la organización.
- **Flujo de Aprobación:** Área dedicada para aceptar o rechazar las licencias de forma instantánea.
- **Modificación Manual de Saldos:** Herramienta segura (protegida por clave) para actualizar o ajustar manualmente el saldo de días de cualquier colaborador.
- **Buscadores y Filtros Avanzados:** Filtrado instantáneo por nombre, área o estado de solicitud.
- **Exportación de Datos:** Generación instantánea de reportes en formato `.csv` (Excel) con un solo click. Perfectos para liquidación de sueldos o auditorías.
- **Gestión de Roles:** Sistema rápido para otorgar y remover permisos de "Administrador" dentro de la plataforma.

---

## 🛠️ Stack Tecnológico

Este proyecto fue desarrollado utilizando un stack sólido, moderno y escalable preparado para entorno de producción:

- **Framework Core:** [Next.js v16](https://nextjs.org/) (React Framework)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos e Interfaz:** [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) (Vercel Postgres compatible)
- **ORM (Capa de Datos):** [Prisma ORM v7](https://www.prisma.io/)
- **Autenticación y Seguridad:** [Auth.js / NextAuth v5](https://authjs.dev/) & Bcryptjs
- **Lógicas de Tiempo:** [Date-Fns](https://date-fns.org/)
- **Gestión de Correos:** [Nodemailer](https://nodemailer.com/)

---

## 🚀 Despliegue y Ejecución Local

Sigue estos pasos para correr el proyecto en tu máquina local para propósitos de desarrollo o auditoría.

### 1. Variables de Entorno
Clona el archivo de ejemplo para las variables de entorno. Necesitarás reemplazar los valores por defecto con las credenciales de tu proyecto y entorno de base de datos SQL.
\`\`\`bash
cp .env.example .env
\`\`\`

> *Nota: Se requiere una conexión URL a una base de datos PostgreSQL estándar bajo la variable `DATABASE_URL`.*

### 2. Instalación de Dependencias
Ejecuta el comando para que Node instale todas las librerías necesarias del proyecto.
\`\`\`bash
npm install
\`\`\`

### 3. Sincronización de Base de Datos
Genera el cliente especializado de Prisma y migra todas las tablas y esquemas al motor PostgreSQL.
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 4. Entorno de Desarrollo
¡Enciende la aplicación! Podrás visualizarla de forma transparente en el puerto 3000.
\`\`\`bash
npm run dev
\`\`\`
Visita: \`http://localhost:3000\`

---

## 🔐 Seguridad y Autenticación

Toda la aplicación se encuentra protegida bajo un middleware robusto provisto por Auth.js..

- **Hashing y Persistencia:** Las contraseñas de todos los registrados residen cifradas irreversiblemente mediante Bcrypt.
- **Protección de Rutas (Middleware):** Un usuario estándar nunca podrá acceder al menú de administrador. La comprobación ocurre tanto de lado del cliente como estructuralmente del lado del servidor.
- **Seguridad en Correos:** Integración lista para servicios seguros de SMTP para reestablecimientos de clave.

---
*Desarrollado para la agilidad de los departamentos de Recursos Humanos modernos.*
