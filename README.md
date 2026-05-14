# 🐾 CaniVet — Sistema de Gestión Canina

> Plataforma web integral para la administración de clínicas y centros de cuidado canino.

---

## 📋 Descripción

CaniVet es una aplicación web de gestión veterinaria desarrollada con React, Flask y Supabase. Permite administrar clientes, mascotas, citas, pagos, inventario, suscripciones, guardería, paseos y mucho más, con soporte para múltiples sucursales, roles de usuario y envío de correos electrónicos automáticos.

---

## 🚀 Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Python 3 + Flask |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Emails | Gmail SMTP (Flask backend) |
| Pagos | Stripe Payment Links |
| Gráficos | Chart.js |
| Estilos | CSS en componentes (sin framework) |

---

## 📦 Requisitos previos

- Node.js 18+
- Python 3.10+
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en Gmail con App Password activada

---

## ⚙️ Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd canivet
```

### 2. Configurar el Frontend

```bash
cd Canivet
npm install
```

Crear `Canivet/.env`:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_API_URL=http://localhost:5000
```

### 3. Configurar el Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Crear `backend/.env`:
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_JWT_SECRET=tu_jwt_secret
ADMIN_EMAILS=admin@tuclinica.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tucorreo@gmail.com
SMTP_PASS=tu_app_password_gmail
SMTP_FROM=CaniVet <tucorreo@gmail.com>
```

### 4. Configurar Supabase

En **Supabase → SQL Editor**, ejecutar en orden:
1. `migration.sql`
2. `migration_v2.sql`
3. `migration_v3.sql`
4. `migration_v4.sql`

En **Supabase → Authentication → Email**: desactivar confirmación de email.

---

## ▶️ Ejecutar el proyecto

**Terminal 1 — Backend:**
```bash
cd backend
.venv\Scripts\activate
python app.py
```

**Terminal 2 — Frontend:**
```bash
cd Canivet
npm run dev
```
App disponible en `http://localhost:5173`

---

## 🔐 Primer acceso

1. Ve a `http://localhost:5173/registro`
2. Crea una cuenta con el email configurado en `ADMIN_EMAILS`
3. Entra en `http://localhost:5173/login`

---

## 📁 Estructura del proyecto

```
canivet/
├── Canivet/                 # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes UI y Layout
│   │   ├── context/         # Estado global y autenticación
│   │   ├── hooks/           # useSupabaseCRUD
│   │   ├── pages/           # Páginas admin y públicas
│   │   ├── services/        # Supabase, Backend, Email
│   │   └── styles/          # CSS global y variables
├── backend/                 # Backend Flask
│   ├── app.py               # Punto de entrada
│   ├── core/                # Auth, Email, Validators
│   └── routes/              # CRUD y Email endpoints
├── migration.sql            # Tablas base
├── migration_v2.sql         # Reservas online
├── migration_v3.sql         # RLS
├── migration_v4.sql         # Usuarios sistema
└── docs/                    # Documentación
```

---

## 👥 Roles

| Rol | Acceso |
|---|---|
| **Admin** | Sistema completo + Reportes + Configuración |
| **Usuario** | Operaciones diarias (citas, clientes, mascotas, pagos) |

---

## 📄 Documentación

Ver carpeta `/docs`:
- `ACTA_PROYECTO.md` — Acta de inicio del proyecto
- `ACTIVIDADES.md` — Plan de actividades
- `MANUAL_USUARIO.md` — Manual de usuario
- `MANUAL_TECNICO.md` — Manual técnico
- `ANALISIS_DISENO.md` — Análisis y diseño del sistema
