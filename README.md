# 🐾 CaniVet — Sistema de Gestión Veterinaria

> Plataforma web completa para la administración integral de clínicas veterinarias. Gestiona clientes, mascotas, citas, pagos, inventario, guardería, paseos, vacunas e historial clínico desde un panel centralizado con roles, notificaciones automáticas por correo y pagos en línea.

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
3. [Características del Sistema](#-características-del-sistema)
4. [Requisitos del Sistema](#-requisitos-del-sistema)
5. [Instalación del Proyecto](#-instalación-del-proyecto)
6. [Configuración](#-configuración)
7. [Pasos de Ejecución](#-pasos-de-ejecución)
8. [Estructura del Proyecto](#-estructura-del-proyecto)
9. [Base de Datos](#-base-de-datos)
10. [API — Endpoints y Uso](#-api--endpoints-y-uso)
11. [Integración con Stripe](#-integración-con-stripe)
12. [Integración con Supabase](#-integración-con-supabase)
13. [Sistema de Correo Electrónico](#-sistema-de-correo-electrónico)
14. [Uso del Sistema](#-uso-del-sistema)
15. [Credenciales Relevantes](#-credenciales-relevantes)
16. [Autores](#-autores)

---

## 📖 Descripción del Proyecto

**CaniVet** es un sistema de gestión veterinaria full-stack diseñado para clínicas y consultorios veterinarios. Proporciona un panel de administración completo con control de acceso por roles (administrador / usuario), una interfaz pública para clientes con formulario de reservas y contacto, integración de pagos en línea mediante **Stripe**, notificaciones automáticas por correo electrónico vía **Gmail SMTP**, y reportes visuales con gráficas interactivas.

El sistema está construido con **React + Vite** en el frontend, **Flask (Python)** en el backend y **Supabase (PostgreSQL)** como base de datos en la nube, con autenticación JWT integrada.

---

## 🛠 Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2.4 | Framework de interfaz de usuario |
| Vite | 8.0.1 | Bundler y servidor de desarrollo |
| React Router DOM | 7.13.2 | Enrutamiento de páginas |
| Supabase JS | 2.100.0 | Cliente de base de datos y autenticación |
| Chart.js + react-chartjs-2 | 4.5.1 / 5.3.1 | Gráficas y reportes visuales |
| EmailJS Browser | 4.4.1 | Envío de emails desde el frontend (fallback) |
| ESLint | 9.39.4 | Calidad de código |

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Python | 3.10+ | Lenguaje del servidor |
| Flask | 3.0.3 | Framework web REST API |
| flask-cors | 4.0.1 | Control de CORS entre dominios |
| PyJWT | 2.8.0 | Validación de tokens JWT |
| supabase (Python SDK) | 2.28.3 | Operaciones de base de datos |
| stripe | 11.4.1 | Procesamiento de pagos en línea |
| python-dotenv | 1.0.1 | Gestión de variables de entorno |
| requests | 2.32.3 | Peticiones HTTP externas |

### Servicios en la Nube

| Servicio | Uso |
|---|---|
| Supabase | Base de datos PostgreSQL, autenticación JWT, Row Level Security |
| Stripe | Checkout de pagos, webhooks, confirmación de transacciones |
| Gmail SMTP | Envío de correos transaccionales (notificaciones, recibos, alertas) |

---

## ✨ Características del Sistema

### Panel de Administración
- **Dashboard** con estadísticas en tiempo real y gráficas de citas, ingresos y servicios
- **Gestión de Clientes** — CRUD completo con búsqueda y paginación
- **Gestión de Mascotas** — Registro por cliente con historial clínico, vacunas y fotos
- **Gestión de Citas** — Programación, confirmación, recordatorios y fotos antes/después del servicio
- **Reservas Online** — Bandeja de reservas públicas con opciones de confirmar o rechazar
- **Servicios** — Catálogo de servicios con precio y duración
- **Pagos** — Registro de pagos, recibos por email y links de pago a través de Stripe
- **Inventario** — Control de stock con alertas automáticas de bajo inventario
- **Guardería** — Registro de check-in/check-out diario por mascota
- **Paseos** — Programación de paseos con ruta, duración y paseador asignado
- **Suscripciones** — Planes de servicio mensuales por mascota
- **Reportes** — Gráficas de ingresos, citas por tipo de servicio y vacunas próximas
- **Auditoría** — Log completo de todas las acciones realizadas en el sistema
- **Configuración** — Datos de la clínica, notificaciones manuales y prueba de configuración de email
- **Multi-sucursal** — Soporte para gestionar múltiples sedes desde una sola cuenta

### Portal Público (para clientes)
- Página de inicio con información de la clínica y servicios destacados
- Catálogo completo de servicios disponibles
- Formulario de reserva de citas online (sin necesidad de registrarse)
- Formulario de contacto con envío al administrador
- Registro e inicio de sesión para usuarios

### Sistema de Notificaciones por Email
- Confirmación de reserva al cliente y alerta al administrador
- Confirmación o rechazo de cita
- Recordatorio de cita programado o manual
- Recibo de pago en PDF
- Link de pago (Stripe) por correo
- Alertas individuales o masivas de vacuna próxima o vencida
- Email de bienvenida a nuevos clientes
- Notificación manual personalizada desde el panel de administración

---

## 💻 Requisitos del Sistema

### Software necesario
- **Node.js** 18 o superior — [nodejs.org](https://nodejs.org)
- **Python** 3.10 o superior — [python.org](https://python.org)
- **Git** — [git-scm.com](https://git-scm.com)
- **npm** (incluido con Node.js)

### Cuentas de servicios externos requeridas
- **Supabase** — cuenta gratuita en [supabase.com](https://supabase.com)
- **Stripe** — cuenta en [stripe.com](https://stripe.com) (modo test disponible sin costo)
- **Gmail** — cuenta Google con verificación en 2 pasos habilitada para generar contraseña de aplicación

---

## 📥 Instalación del Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/koe-creator/CaniVet.git
cd CaniVet
```

### 2. Instalar dependencias del Frontend

```bash
cd Canivet
npm install
```

### 3. Crear el entorno virtual del Backend e instalar dependencias

```bash
cd ../backend
python -m venv .venv
```

**En Windows:**
```bash
.venv\Scripts\activate
```

**En macOS / Linux:**
```bash
source .venv/bin/activate
```

```bash
pip install -r requirements.txt
```

---

## ⚙️ Configuración

### Variables de entorno del Frontend

Crear el archivo **`Canivet/.env`**:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY_DE_SUPABASE
```

> Los valores se obtienen en el panel de Supabase en **Project Settings → API**.

---

### Variables de entorno del Backend

Crear el archivo **`backend/.env`**:

```env
# ─── Supabase ───────────────────────────────────────────────────────────────
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_JWT_SECRET=TU_JWT_SECRET

# ─── Servidor ───────────────────────────────────────────────────────────────
PORT=5000
CORS_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# ─── Roles y acceso ─────────────────────────────────────────────────────────
ADMIN_ROLE=admin
DEFAULT_ROLE=user
ADMIN_PATH=/admin
USER_PATH=/
ADMIN_EMAILS=tu_correo_administrador@gmail.com

# ─── SMTP Gmail ─────────────────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_contrasena_de_aplicacion_16_chars
SMTP_FROM=CaniVet <tu_correo@gmail.com>
SMTP_USE_SSL=true
SMTP_USE_TLS=false

# ─── Stripe ─────────────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_SECRETA_STRIPE
STRIPE_WEBHOOK_SECRET=whsec_TU_WEBHOOK_SECRET
```

#### Dónde obtener cada valor

| Variable | Dónde obtenerla |
|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API → **Project URL** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → **service_role** (secret) |
| `SUPABASE_ANON_KEY` | Supabase → Project Settings → API → **anon / public** |
| `SUPABASE_JWT_SECRET` | Supabase → Project Settings → API → **JWT Secret** |
| `ADMIN_EMAILS` | Tu propio correo (será el acceso de administrador) |
| `SMTP_USER` | Correo Gmail que enviará los emails del sistema |
| `SMTP_PASS` | Contraseña de aplicación de Google (ver sección de SMTP abajo) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → **API keys** |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → **Webhooks** → Signing secret |

---

### Configuración de la base de datos en Supabase

1. Entrar al panel de tu proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor**
3. Ejecutar los siguientes archivos en este orden exacto:

```
1. migration.sql        →  Tablas principales del sistema
2. migration_v2.sql     →  Tabla de reservas online
3. migration_v3.sql     →  Políticas de seguridad Row Level Security (RLS)
4. migration_v4.sql     →  Tabla de usuarios del sistema y roles
```

4. En **Authentication → Email**, desactivar la opción **"Confirm email"** para no requerir verificación de correo al registrarse.

---

### Contraseña de Aplicación Gmail (para SMTP)

1. Iniciar sesión en la cuenta Gmail que usará CaniVet
2. Ir a **Gestionar cuenta de Google → Seguridad**
3. Activar **Verificación en dos pasos** (obligatorio)
4. Buscar **Contraseñas de aplicaciones**
5. Seleccionar: Aplicación → **Correo**, Dispositivo → **Otro** (escribir "CaniVet")
6. Google genera una contraseña de 16 caracteres — copiarla en `SMTP_PASS`

---

## ▶️ Pasos de Ejecución

El proyecto requiere **dos terminales** corriendo simultáneamente.

### Terminal 1 — Backend (Flask)

```bash
cd backend

# Activar entorno virtual
.venv\Scripts\activate         # Windows
# source .venv/bin/activate    # macOS / Linux

# Iniciar servidor
python app.py
```

El servidor backend estará disponible en: **`http://localhost:5000`**

### Terminal 2 — Frontend (React + Vite)

```bash
cd Canivet
npm run dev
```

La aplicación estará disponible en: **`http://localhost:5173`**

---

### Primer acceso al sistema

1. Abrir `http://localhost:5173` en el navegador
2. Ir a la página de registro (`/registro`)
3. Registrarse con el correo configurado en `ADMIN_EMAILS` del backend
4. Iniciar sesión en `/login`
5. El sistema detecta el rol y redirige automáticamente al **panel de administración** en `/admin/dashboard`

> Cualquier otro correo registrado recibirá el rol **usuario** y accederá únicamente al portal público.

---

## 📁 Estructura del Proyecto

```
canivet/
│
├── Canivet/                              # Frontend — React + Vite
│   ├── src/
│   │   ├── assets/                       # Imágenes e íconos
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── AdminLayout.jsx       # Layout del panel de administración
│   │   │   │   ├── PublicLayout.jsx      # Layout del portal público
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   └── ui/                       # Componentes reutilizables
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── ErrorBanner.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Pagination.jsx
│   │   │       ├── Table.jsx
│   │   │       └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Estado global de autenticación
│   │   │   └── AppConfigContext.jsx      # Configuración global de la app
│   │   ├── hooks/
│   │   │   ├── useAuth.js                # Hook de autenticación
│   │   │   ├── useSupabaseCRUD.js        # CRUD genérico para cualquier tabla
│   │   │   ├── useAppointments.js
│   │   │   ├── useClients.js
│   │   │   ├── usePets.js
│   │   │   ├── useInventory.js
│   │   │   └── useToast.js
│   │   ├── pages/
│   │   │   ├── public/                   # Páginas sin autenticación
│   │   │   │   ├── HomePage.jsx          # Página de inicio / Landing
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegistrerPage.jsx
│   │   │   │   ├── Services.jsx          # Catálogo de servicios + reserva online
│   │   │   │   └── Contact.jsx           # Formulario de contacto
│   │   │   └── admin/                    # Panel de administración (requiere auth)
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Clients.jsx
│   │   │       ├── Pets.jsx
│   │   │       ├── Appointments.jsx      # Gestión y confirmación de citas
│   │   │       ├── CitasPage.jsx
│   │   │       ├── Services.jsx
│   │   │       ├── Payments.jsx
│   │   │       ├── Inventory.jsx
│   │   │       ├── Daycare.jsx
│   │   │       ├── Walks.jsx
│   │   │       ├── Subscriptions.jsx
│   │   │       ├── Reports.jsx
│   │   │       ├── Audit.jsx
│   │   │       └── Settings.jsx
│   │   ├── router/
│   │   │   ├── AppRouter.jsx             # Definición de todas las rutas
│   │   │   └── ProtectedRoute.jsx        # Guardia de rutas privadas
│   │   └── services/
│   │       ├── supabase.js               # Inicialización del cliente Supabase
│   │       ├── authService.js            # Login, register, logout, sesión
│   │       ├── backend.js                # Cliente HTTP para el backend Flask
│   │       ├── emailService.js           # EmailJS (fallback de emails)
│   │       ├── appointmentService.js
│   │       ├── clientService.js
│   │       ├── petService.js
│   │       ├── paymentService.js
│   │       ├── inventoryService.js
│   │       ├── serviceService.js
│   │       └── contactService.js
│   ├── .env                              # Variables de entorno frontend
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                              # Backend — Flask (Python)
│   ├── app.py                            # Punto de entrada, registro de blueprints
│   ├── requirements.txt                  # Dependencias Python
│   ├── .env                              # Variables de entorno backend
│   ├── .env.example                      # Plantilla de variables de entorno
│   ├── core/
│   │   ├── auth.py                       # Validación JWT, decorador @require_auth
│   │   ├── email_service.py              # Clase EmailService — SMTP Gmail
│   │   ├── services.py                   # SupabaseClientFactory, SupabaseEntityService
│   │   └── validators.py                 # Validadores de datos de entrada
│   ├── routes/
│   │   ├── clientes.py                   # CRUD /api/clientes
│   │   ├── mascotas.py                   # CRUD /api/mascotas
│   │   ├── citas.py                      # CRUD /api/citas
│   │   ├── servicios.py                  # CRUD /api/servicios
│   │   ├── pagos.py                      # CRUD /api/pagos
│   │   ├── inventario.py                 # CRUD /api/inventario
│   │   ├── reservas.py                   # Reservas online con emails automáticos
│   │   ├── contact.py                    # Formulario de contacto
│   │   ├── email_bp.py                   # Todos los endpoints de email
│   │   └── stripe_payments.py            # Checkout y webhook de Stripe
│   └── tests/
│
├── docs/                                 # Documentación del proyecto
│   ├── Acta_Proyecto_CaniVet.docx
│   ├── Analisis_Diseno_CaniVet.docx
│   ├── Manual_Tecnico_CaniVet.docx
│   ├── Manual_Usuario_CaniVet.docx
│   └── Cronograma_CaniVet.xlsx
│
├── migration.sql                         # Tablas principales del sistema
├── migration_v2.sql                      # Reservas online
├── migration_v3.sql                      # Políticas RLS de seguridad
├── migration_v4.sql                      # Usuarios del sistema y roles
└── README.md                             # Este archivo
```

---

## 🗄️ Base de Datos

CaniVet usa **Supabase (PostgreSQL)** como base de datos. Las tablas se crean ejecutando los archivos de migración incluidos en el proyecto.

### Diagrama Entidad-Relación

```
clientes (1) ────────< mascotas (N)
clientes (1) ────────< citas (N)
clientes (1) ────────< suscripciones (N)
mascotas (1) ────────< citas (N)
mascotas (1) ────────< vacunas (N)
mascotas (1) ────────< historial_clinico (N)
mascotas (1) ────────< guarderia (N)
mascotas (1) ────────< paseos (N)
citas    (1) ────────< pagos (N)
citas    (1) ────────< fotos_servicio (N)
citas    (1) ────────< pagos_online (N)
pagos    (1) ────────< facturas (N)
```

### Descripción de tablas

| Tabla | Descripción |
|---|---|
| `clientes` | Datos de los propietarios de mascotas (nombre, email, teléfono, dirección) |
| `mascotas` | Mascotas registradas vinculadas a un cliente (nombre, especie, raza, edad, peso) |
| `citas` | Citas veterinarias (fecha, hora, cliente, mascota, servicio, estado) |
| `servicios` | Catálogo de servicios ofrecidos (baño, consulta, vacunación, etc.) |
| `pagos` | Registro de pagos realizados (monto, método, estado) |
| `inventario` | Productos y suministros de la clínica con control de stock |
| `vacunas` | Historial de vacunación por mascota con fechas de próxima dosis |
| `historial_clinico` | Consultas, diagnósticos, tratamientos y observaciones por mascota |
| `guarderia` | Registros diarios de estadía con check-in y check-out |
| `paseos` | Paseos programados con ruta, duración, distancia y paseador |
| `suscripciones` | Planes de servicio mensuales por mascota con fecha de cobro |
| `reservas_online` | Reservas realizadas desde el portal público (estado: pendiente/confirmada/rechazada) |
| `pagos_online` | Sesiones de pago de Stripe con estado y metadatos |
| `facturas` | Facturas generadas con items, totales e impuestos |
| `notificaciones` | Historial de notificaciones enviadas por canal (email / interna) |
| `auditoria` | Log de todas las acciones: acción, entidad, usuario, fecha |
| `sucursales` | Sedes de la clínica con estado activo/inactivo |
| `usuarios_sistema` | Usuarios con acceso al sistema y sus roles asignados |
| `fotos_servicio` | Fotos antes y después del servicio vinculadas a una cita |

---

## 🔌 API — Endpoints y Uso

El backend corre en `http://localhost:5000`. Todos los endpoints protegidos requieren el header:

```http
Authorization: Bearer <JWT_TOKEN>
```

El token se obtiene al iniciar sesión a través de Supabase Auth.

---

### Estado del servidor

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/health` | Verificar que el servidor está activo | No |

---

### Autenticación

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión con email y contraseña | No |
| `POST` | `/auth/register` | Registrar nuevo usuario | No |
| `POST` | `/auth/me` | Obtener datos del usuario autenticado | Sí |
| `POST` | `/auth/redirect` | Obtener ruta de redirección según rol | Sí |

---

### Clientes — `/api/clientes`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/clientes/` | Listar todos los clientes |
| `POST` | `/api/clientes/` | Crear nuevo cliente |
| `GET` | `/api/clientes/<id>` | Obtener cliente por ID |
| `PUT` | `/api/clientes/<id>` | Actualizar datos del cliente |
| `DELETE` | `/api/clientes/<id>` | Eliminar cliente |

---

### Mascotas — `/api/mascotas`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/mascotas/` | Listar todas las mascotas |
| `POST` | `/api/mascotas/` | Registrar nueva mascota |
| `GET` | `/api/mascotas/<id>` | Obtener mascota por ID |
| `GET` | `/api/mascotas/cliente/<cliente_id>` | Obtener mascotas de un cliente específico |
| `PUT` | `/api/mascotas/<id>` | Actualizar datos de la mascota |
| `DELETE` | `/api/mascotas/<id>` | Eliminar mascota |

---

### Citas — `/api/citas`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/citas/` | Listar todas las citas |
| `POST` | `/api/citas/` | Crear nueva cita |
| `GET` | `/api/citas/hoy` | Obtener las citas programadas para hoy |
| `GET` | `/api/citas/<id>` | Obtener cita por ID |
| `PUT` | `/api/citas/<id>` | Actualizar cita |
| `DELETE` | `/api/citas/<id>` | Eliminar cita |

---

### Servicios — `/api/servicios`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/servicios/` | Listar catálogo de servicios |
| `POST` | `/api/servicios/` | Crear servicio |
| `GET` | `/api/servicios/<id>` | Obtener servicio por ID |
| `PUT` | `/api/servicios/<id>` | Actualizar servicio |
| `DELETE` | `/api/servicios/<id>` | Eliminar servicio |

---

### Pagos — `/api/pagos`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/pagos/` | Listar todos los pagos |
| `POST` | `/api/pagos/` | Registrar nuevo pago |
| `GET` | `/api/pagos/<id>` | Obtener pago por ID |
| `PUT` | `/api/pagos/<id>` | Actualizar pago |
| `DELETE` | `/api/pagos/<id>` | Eliminar pago |

---

### Inventario — `/api/inventario`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/inventario/` | Listar todos los productos |
| `POST` | `/api/inventario/` | Agregar producto al inventario |
| `GET` | `/api/inventario/bajo-stock` | Listar productos con bajo stock |
| `GET` | `/api/inventario/<id>` | Obtener producto por ID |
| `PUT` | `/api/inventario/<id>` | Actualizar producto |
| `DELETE` | `/api/inventario/<id>` | Eliminar producto |

---

### Reservas Online — `/api/reservas`

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/reservas/` | Crear reserva desde el portal público (envía emails automáticos) | No |
| `GET` | `/api/reservas/` | Listar todas las reservas | Sí |
| `PUT` | `/api/reservas/<id>` | Actualizar estado de reserva (confirmar / rechazar) | Sí |

---

### Correo Electrónico — `/api/email`

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/email/test` | Probar que la configuración SMTP funciona |
| `POST` | `/api/email/reserva` | Enviar confirmación de reserva al cliente y alerta al admin |
| `POST` | `/api/email/cita-confirmada` | Enviar confirmación de cita al cliente |
| `POST` | `/api/email/reserva-rechazada` | Notificar al cliente el rechazo de su reserva |
| `POST` | `/api/email/recibo-pago` | Enviar recibo de pago al cliente |
| `POST` | `/api/email/alerta-vacuna` | Enviar alerta de vacuna próxima o vencida |
| `POST` | `/api/email/recordatorio-cita` | Enviar recordatorio de cita |
| `POST` | `/api/email/link-pago` | Enviar link de pago de Stripe al cliente |
| `POST` | `/api/email/manual-notification` | Enviar notificación manual personalizada |
| `POST` | `/api/email/client-welcome` | Enviar email de bienvenida a nuevo cliente |

---

### Stripe — `/api/stripe`

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/stripe/checkout` | Crear sesión de pago en Stripe y obtener URL | Sí |
| `POST` | `/api/stripe/webhook` | Recibir eventos de Stripe (pago completado) | No |

---

### Contacto — `/api/contacto`

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/contacto/` | Enviar mensaje del formulario de contacto al admin | No |

---

## 💳 Integración con Stripe

CaniVet integra **Stripe Checkout** para recibir pagos de citas en línea de forma segura.

### Flujo completo de pago

```
1. Admin genera link de pago desde el panel (Citas o Pagos)
          ↓
2. Backend crea sesión de Stripe (POST /api/stripe/checkout)
          ↓
3. Backend envía la URL de checkout al cliente por email
          ↓
4. Cliente abre el link y completa el pago en la página de Stripe
          ↓
5. Stripe envía evento "checkout.session.completed" al webhook
          ↓
6. Backend recibe el evento, verifica la firma y actualiza
   el estado del pago en Supabase (estado: "pagado")
```

### Configuración del Webhook en Stripe (producción)

1. Entrar al [Stripe Dashboard](https://dashboard.stripe.com)
2. Ir a **Developers → Webhooks → Add endpoint**
3. **URL:** `https://TU-DOMINIO.com/api/stripe/webhook`
4. **Evento a escuchar:** `checkout.session.completed`
5. Copiar el **Signing secret** generado y agregarlo como `STRIPE_WEBHOOK_SECRET` en el `.env` del backend

### Pruebas en modo desarrollo

Usar la tarjeta de prueba de Stripe: `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVV de 3 dígitos.

### Moneda por defecto
La moneda configurada es **DOP (Peso Dominicano)**. Se puede cambiar en el payload enviado a `/api/stripe/checkout` con el campo `currency`.

---

## ☁️ Integración con Supabase

### Frontend (SDK JavaScript)

El cliente Supabase se inicializa en `src/services/supabase.js` y es utilizado para:
- Autenticación completa (login, register, logout, recuperación de sesión)
- Consultas directas a la base de datos usando el `anon key`
- Mantenimiento automático de tokens (refresh silencioso)

### Backend (SDK Python)

El backend utiliza el `service_role key` para:
- Operaciones administrativas sin restricciones de Row Level Security
- Validación de tokens JWT emitidos por Supabase Auth
- CRUD genérico a través de la clase `SupabaseEntityService`

### Row Level Security (RLS)

Las políticas de seguridad se aplican en `migration_v3.sql`:

| Tabla | Política |
|---|---|
| `reservas_online` | Cualquier persona puede insertar (formulario público), solo autenticados pueden leer y gestionar |
| Resto de tablas | Solo usuarios autenticados pueden crear, leer, actualizar y eliminar |

### Roles de acceso

| Rol | Descripción | Área de acceso |
|---|---|---|
| `admin` | Administrador de la clínica | Panel completo `/admin/*` |
| `user` | Cliente / usuario general | Portal público `/` |

El rol `admin` se asigna automáticamente a los correos incluidos en la variable de entorno `ADMIN_EMAILS`.

---

## 📧 Sistema de Correo Electrónico

### Servicio principal — SMTP Gmail (Backend)

CaniVet usa Gmail como servidor de correo saliente a través de **smtplib** de Python.

| Parámetro | Valor |
|---|---|
| Host | `smtp.gmail.com` |
| Puerto SSL | `465` |
| Puerto TLS | `587` |
| Autenticación | Contraseña de aplicación de Google |
| Implementación | `backend/core/email_service.py` → clase `EmailService` |

### Servicio alternativo — EmailJS (Frontend)

Para reservas y confirmaciones de citas, si el backend Flask no está disponible, el frontend usa **EmailJS** como canal alternativo de envío.

Agregar a `Canivet/.env` si se desea usar EmailJS:

```env
VITE_EMAILJS_SERVICE_ID=TU_SERVICE_ID
VITE_EMAILJS_TEMPLATE_RESERVA=TU_TEMPLATE_ID_RESERVA
VITE_EMAILJS_TEMPLATE_ADMIN=TU_TEMPLATE_ID_ADMIN
VITE_EMAILJS_TEMPLATE_CITA=TU_TEMPLATE_ID_CITA
VITE_EMAILJS_PUBLIC_KEY=TU_PUBLIC_KEY
```

### Resumen de emails automáticos

| Evento que lo dispara | Destinatario | Canal |
|---|---|---|
| Cliente hace reserva online | Cliente + Administrador | SMTP / EmailJS |
| Admin confirma cita | Cliente | SMTP / EmailJS |
| Admin rechaza reserva | Cliente | SMTP |
| Admin crea nuevo cliente | Cliente (bienvenida) | SMTP |
| Admin registra un pago | Cliente (recibo) | SMTP |
| Admin genera link de pago | Cliente | SMTP |
| Vacuna próxima o vencida (individual o masiva) | Dueño de la mascota | SMTP |
| Recordatorio de cita (manual o automático) | Cliente | SMTP |
| Notificación manual desde configuración | Cliente | SMTP |
| Mensaje del formulario de contacto | Administrador | SMTP |

---

## 📘 Uso del Sistema

### Como Administrador

1. Registrarse con el correo definido en `ADMIN_EMAILS`
2. Iniciar sesión → el sistema redirige automáticamente a `/admin/dashboard`
3. Crear los **Servicios** que ofrece la clínica (nombre, precio, duración)
4. Registrar **Clientes** y sus **Mascotas** correspondientes
5. Programar **Citas** o revisar las reservas llegadas desde el portal público
6. Confirmar o rechazar reservas (se envía email automático al cliente)
7. Registrar **Pagos** y enviar recibos o links de pago con Stripe
8. Gestionar **Inventario** y recibir alertas de bajo stock
9. Usar **Guardería** y **Paseos** para servicios complementarios
10. Revisar **Vacunas** y enviar alertas masivas de vencimiento
11. Consultar **Reportes** con gráficas de ingresos y actividad
12. Revisar la **Auditoría** para ver todas las acciones del sistema
13. Usar **Configuración** para enviar notificaciones manuales o probar el email

### Como Cliente (portal público)

1. Visitar la página de inicio de CaniVet
2. Explorar los servicios disponibles
3. Completar el formulario de **reserva online** (nombre, email, teléfono, mascota, fecha y hora)
4. Recibirás un email de confirmación cuando el administrador acepte la reserva
5. Para consultas o dudas, usar el formulario de **Contacto**

---

## 🔑 Credenciales Relevantes

> En producción, nunca incluir credenciales reales en el código fuente. Usar siempre variables de entorno y agregar `.env` al `.gitignore`.

### Acceso al sistema

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | El definido en `ADMIN_EMAILS` | La que creaste al registrarte |

### Supabase

| Clave | Dónde se usa | Nivel de acceso |
|---|---|---|
| `anon key` | Frontend (`VITE_SUPABASE_ANON_KEY`) | Acceso público con restricciones RLS |
| `service_role key` | Backend (`SUPABASE_SERVICE_ROLE_KEY`) | Acceso total sin restricciones |
| `JWT Secret` | Backend (`SUPABASE_JWT_SECRET`) | Validación de tokens de sesión |

### Gmail SMTP

| Campo | Descripción |
|---|---|
| `SMTP_USER` | Correo Gmail del sistema (ej: canivetadmin@gmail.com) |
| `SMTP_PASS` | Contraseña de aplicación de 16 caracteres generada por Google |

### Stripe

| Clave | Cuándo usar |
|---|---|
| `sk_test_...` | Entorno de desarrollo y pruebas (sin cobros reales) |
| `sk_live_...` | Producción (cobros reales a clientes) |
| `whsec_...` | Webhook secret para verificar eventos de Stripe |

---

## 👥 Autores

| Rol | Nombre |
|---|---|
| **Desarrollador** | Yeuri Lorenzo Diaz |
| **Administrador de Proyecto** | Jose Luis Rijo Rodriguez |

---

*CaniVet — Sistema de Gestión Veterinaria*
---Enlace de github
https://github.com/koe-creator/CaniVet