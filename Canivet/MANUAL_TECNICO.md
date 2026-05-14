# MANUAL TECNICO CaniVet

## 1. Arquitectura del sistema
CaniVet sigue una arquitectura cliente-servidor compuesta por tres partes:

### Frontend
- Aplicacion SPA desarrollada en React con Vite.
- Responsable de la interfaz, validaciones de formulario, panel administrativo y reportes.

### Backend
- API REST desarrollada en Flask.
- Responsable de autenticacion, validacion de tokens, rutas protegidas, servicios auxiliares y envio de correos.

### Capa de datos
- Supabase se utiliza para autenticacion y almacenamiento de datos.
- Algunas configuraciones complementarias se guardan en `localStorage` desde el frontend.

## 2. Stack tecnologico
- React 19
- Vite 8
- JavaScript ES Modules
- Flask 3
- Python 3.10+
- Supabase JS
- Supabase Python client
- Chart.js
- CSS

## 3. Estructura de carpetas
```text
canivet/
├── backend/
│   ├── core/
│   │   ├── auth.py
│   │   ├── email_service.py
│   │   ├── services.py
│   │   └── validators.py
│   ├── routes/
│   │   ├── citas.py
│   │   ├── clientes.py
│   │   ├── contact.py
│   │   ├── inventario.py
│   │   ├── mascotas.py
│   │   ├── pagos.py
│   │   └── servicios.py
│   ├── tests/
│   ├── .env
│   ├── app.py
│   └── requirements.txt
└── Canivet/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── router/
    │   ├── services/
    │   ├── styles/
    │   └── utils/
    ├── .env
    ├── package.json
    └── vite.config.js
```

## 4. Descripcion de cada endpoint de la API

### Salud del sistema
#### `GET /health`
- Verifica que el backend este activo.
- Respuesta esperada:
  - `ok: true`
  - `time: fecha y hora UTC`

### Autenticacion
#### `POST /auth/login`
- Permite iniciar sesion.
- Body:
```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

#### `POST /auth/register`
- Registra un nuevo usuario.
- Body:
```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

#### `POST /auth/me`
- Valida el token y devuelve datos del usuario.
- Requiere header:
```text
Authorization: Bearer <token>
```

#### `POST /auth/redirect`
- Devuelve ruta sugerida segun rol.
- Requiere token.

### Clientes
#### `GET /api/clientes/`
- Lista clientes

#### `GET /api/clientes/<id>`
- Obtiene un cliente

#### `POST /api/clientes/`
- Crea cliente

#### `PUT /api/clientes/<id>`
- Actualiza cliente

#### `DELETE /api/clientes/<id>`
- Elimina cliente

### Mascotas
#### `GET /api/mascotas/`
- Lista mascotas

#### `GET /api/mascotas/cliente/<cliente_id>`
- Lista mascotas por cliente

#### `POST /api/mascotas/`
- Crea mascota

#### `PUT /api/mascotas/<id>`
- Actualiza mascota

#### `DELETE /api/mascotas/<id>`
- Elimina mascota

### Citas
#### `GET /api/citas/`
- Lista citas

#### `GET /api/citas/hoy`
- Lista las citas del dia actual

#### `POST /api/citas/`
- Crea cita

#### `PUT /api/citas/<id>`
- Actualiza cita

#### `DELETE /api/citas/<id>`
- Elimina cita

### Servicios
#### `GET /api/servicios/`
- Lista servicios

#### `POST /api/servicios/`
- Crea servicio

#### `PUT /api/servicios/<id>`
- Actualiza servicio

#### `DELETE /api/servicios/<id>`
- Elimina servicio

### Pagos
#### `GET /api/pagos/`
- Lista pagos

#### `POST /api/pagos/`
- Crea pago

#### `PUT /api/pagos/<id>`
- Actualiza pago

#### `DELETE /api/pagos/<id>`
- Elimina pago

### Inventario
#### `GET /api/inventario/`
- Lista productos

#### `GET /api/inventario/bajo-stock`
- Lista productos con bajo stock

#### `POST /api/inventario/`
- Crea producto

#### `PUT /api/inventario/<id>`
- Actualiza producto

#### `DELETE /api/inventario/<id>`
- Elimina producto

### Contacto
#### `POST /api/contacto/`
- Recibe mensajes del formulario de contacto y los envia por correo si SMTP esta configurado.

## 5. Estructura de la base de datos

## Tablas operativas usadas por el frontend

### `clients`
- `id`
- `nombre`
- `telefono`
- `email`

### `pets`
- `id`
- `nombre`
- `tipo`
- `raza`
- `edad`
- `cliente_id`

### `appointments`
- `id`
- `fecha`
- `hora`
- `cliente_id`
- `mascota_id`
- `servicio_id`
- `notas`

### `services`
- `id`
- `nombre`
- `descripcion`
- `precio`

### `payments`
- `id`
- `cliente_id`
- `monto`
- `fecha`
- `metodo`

### `inventory`
- `id`
- `nombre`
- `cantidad`
- `precio`

## Tablas esperadas por el backend API
El backend CRUD actual referencia estas tablas en Supabase:
- `clientes`
- `mascotas`
- `citas`
- `servicios`
- `pagos`
- `inventario`

Nota tecnica:
- El frontend administrativo consume directamente tablas en ingles.
- El backend CRUD actual fue preparado con tablas en español.
- En un despliegue final conviene homologar ambos nombres para evitar duplicidad.

## Estructuras complementarias guardadas en LocalStorage
El contexto `AppConfigContext` guarda datos de apoyo como:
- sucursales
- directorio de usuarios
- asignacion de registros por sucursal
- estados de citas
- facturas
- vacunas
- historial clinico
- notificaciones

## 6. Variables de entorno necesarias

### Frontend `Canivet/.env`
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_API_URL=http://localhost:5000
```

### Backend `backend/.env`
```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
ADMIN_ROLE=admin
DEFAULT_ROLE=user
ADMIN_PATH=/admin
USER_PATH=/
PORT=5000
CORS_ORIGINS=http://localhost:5173
ADMIN_EMAILS=admin@canivet.com
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_USE_TLS=true
MAIL_FROM=
CONTACT_RECIPIENT=
```

## 7. Proceso de instalacion tecnica

### Paso 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd canivet
```

### Paso 2. Configurar frontend
```bash
cd Canivet
npm install
```

### Paso 3. Configurar backend
```powershell
cd ..\backend
python -m venv .venv
.\.venv\Scripts\pip.exe install -r requirements.txt
```

### Paso 4. Crear archivos `.env`
- Configurar `Canivet/.env`
- Configurar `backend/.env`

### Paso 5. Ejecutar backend
```powershell
.\.venv\Scripts\python.exe app.py
```

### Paso 6. Ejecutar frontend
```powershell
cd ..\Canivet
npm run dev
```

### Paso 7. Probar el sistema
- Abrir `http://localhost:5173`
- Crear cuenta
- Confirmar correo si Supabase lo requiere
- Iniciar sesion
- Revisar acceso al panel `/admin`
