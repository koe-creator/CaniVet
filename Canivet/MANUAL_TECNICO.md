# MANUAL TECNICO CaniVet

## 1. Introduccion tecnica

Este manual describe la estructura tecnica real del sistema CaniVet a partir de los modulos, rutas, componentes y tablas identificadas en el repositorio. Su proposito es servir como referencia para desarrollo, mantenimiento, despliegue, soporte y evolucion del proyecto.

## 2. Vision general de la arquitectura

CaniVet implementa una arquitectura cliente servidor apoyada en servicios externos:

- Frontend SPA desarrollado con React y Vite.
- Backend API desarrollado con Flask.
- Base de datos y autenticacion gestionadas principalmente por Supabase.
- Integraciones externas para correo SMTP y Stripe Checkout.

### 2.1 Distribucion por capas

| Capa | Tecnologia | Responsabilidad |
|---|---|---|
| Presentacion | React 19 + Vite | UI publica y panel administrativo |
| Logica cliente | Hooks, contextos, servicios JS | Estado, reglas de UI, consumo de APIs y Supabase |
| API de soporte | Flask 3 | Auth complementaria, validaciones, correo, Stripe y CRUD backend |
| Persistencia | Supabase PostgreSQL | Almacenamiento de entidades principales y extendidas |
| Integraciones | SMTP, Stripe | Comunicacion y pagos online |

## 3. Estructura del repositorio

```text
canivet/
|-- Canivet/                  # Frontend principal React
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- router/
|   |   |-- services/
|   |   |-- styles/
|   |   `-- utils/
|   |-- public/
|   |-- ACTA_PROYECTO.md
|   |-- MANUAL_TECNICO.md
|   |-- MANUAL_USUARIO.md
|   `-- CRONOGRAMA.md
|-- backend/
|   |-- core/
|   |-- routes/
|   |-- tests/
|   |-- app.py
|   `-- requirements.txt
|-- docs/                     # Entregables adicionales y scripts documentales
|-- migration.sql
|-- migration_v2.sql
|-- migration_v3.sql
`-- migration_v4.sql
```

## 4. Frontend

### 4.1 Stack principal

- React
- React Router
- Vite
- CSS modular por archivo
- Chart.js para visualizaciones
- Supabase JS client

### 4.2 Enrutamiento

Las rutas principales definidas en `src/router/AppRouter.jsx` son:

- `/` -> `HomePage`
- `/login` -> `LoginPage`
- `/registro` -> `RegisterPage`
- `/admin/*` -> `AdminLayout` protegido por `ProtectedRoute`

### 4.3 Distribucion funcional del frontend

#### Paginas publicas

- `HomePage`
- `LoginPage`
- `RegistrerPage`
- `Services`
- `Contact`

#### Paginas administrativas

- `Dashboard`
- `Clients`
- `Pets`
- `Appointments`
- `Services`
- `Payments`
- `Inventory`
- `Reports`
- `Settings`
- `Subscriptions`
- `Daycare`
- `Walks`
- `Audit`

#### Componentes estructurales

- `AdminLayout`
- `PublicLayout`
- `Sidebar`
- `Topbar`
- `Navbar`

#### Componentes UI reutilizables

- `Button`
- `Card`
- `Input`
- `Modal`
- `Pagination`
- `Table`
- `Toast`
- `Badge`
- `ErrorBanner`

### 4.4 Gestion de estado en frontend

El proyecto combina varias estrategias:

- `AuthContext` para sesion y usuario.
- `AppConfigContext` para configuracion global, sucursales, permisos, notificaciones y entidades extendidas.
- Hooks por dominio como `useAppointments`, `useClients`, `usePets`, `useInventory`, `useAuth` y `useSupabaseCRUD`.

### 4.5 Modulos funcionales del frontend

#### Dashboard

- Carga clientes, mascotas, citas, pagos, servicios e inventario.
- Muestra KPIs, alertas de vacunas, stock critico, suscripciones proximas y actividad reciente.
- Implementa auto refresh periodico.

#### Clientes

- CRUD de propietarios.
- Soporte de filtrado y asignacion de sucursal.

#### Mascotas

- CRUD principal de mascotas.
- Gestion de vacunas.
- Gestion de historial clinico.
- Perfil ampliado con resumen de salud.
- Consulta de paseos, guarderia y fotos de servicio.

#### Citas

- CRUD de citas.
- Bandeja de reservas online.
- Confirmacion o rechazo de reservas.
- Envio de correos de confirmacion.
- Generacion de enlace Stripe para pagos online.

#### Servicios

- Catalogo interno y publico de servicios.
- Relacion con reservas y citas.

#### Pagos

- Registro de cobros.
- Asociacion con cliente.
- Soporte de metodos y estados.
- Integracion con facturas y pagos online por contexto.

#### Inventario

- CRUD de productos.
- Identificacion de bajo stock.

#### Reportes

- Reportes financieros.
- Distribucion por metodos de pago.
- Rentabilidad por servicio.
- Top clientes.
- Analisis por mascota.
- Resumen por sucursal.
- Valoracion del inventario.
- Exportacion a CSV, JSON y formato imprimible.

#### Configuracion

- Datos de clinica.
- Sucursales.
- Usuarios y roles.
- Notificaciones manuales.
- Parametros operativos.

#### Suscripciones

- Registro de planes recurrentes por cliente o mascota.
- Seguimiento de monto, proximo cobro y estado.

#### Guarderia

- Registro de asistencia, check in y check out.

#### Paseos

- Programacion y seguimiento de paseos.
- Control de estado y auditoria asociada.

#### Auditoria

- Consulta de acciones registradas.
- Exportacion de trazabilidad.

## 5. Backend Flask

### 5.1 Archivo de entrada

El backend se inicializa en `backend/app.py`. Este archivo:

- Carga variables de entorno con `load_dotenv`.
- Configura CORS.
- Define handlers globales de error.
- Expone endpoints de autenticacion.
- Registra blueprints funcionales.

### 5.2 Blueprints registrados

| Prefix | Archivo | Funcion |
|---|---|---|
| `/api/clientes` | `routes/clientes.py` | CRUD de clientes |
| `/api/mascotas` | `routes/mascotas.py` | CRUD de mascotas |
| `/api/citas` | `routes/citas.py` | CRUD de citas y confirmacion por correo |
| `/api/servicios` | `routes/servicios.py` | CRUD de servicios |
| `/api/pagos` | `routes/pagos.py` | CRUD de pagos |
| `/api/inventario` | `routes/inventario.py` | CRUD de inventario |
| `/api/contacto` | `routes/contact.py` | Contacto publico y correo |
| `/api/reservas` | `routes/reservas.py` | Reservas online publicas y gestion interna |
| `/api/stripe` | `routes/stripe_payments.py` | Checkout y webhook Stripe |
| `/api/email` | `routes/email_bp.py` | Notificaciones SMTP |

### 5.3 Endpoints base del backend

#### Salud

- `GET /health`

#### Autenticacion

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/me`
- `POST /auth/redirect`

#### Citas

- `GET /api/citas/`
- `GET /api/citas/hoy`
- `POST /api/citas/`
- `PUT /api/citas/<id>`
- `DELETE /api/citas/<id>`
- `POST /api/citas/notify-confirmation`

#### Reservas online

- `POST /api/reservas/`
- `GET /api/reservas/`
- `PUT /api/reservas/<id>`

#### Stripe

- `POST /api/stripe/checkout`
- `POST /api/stripe/webhook`

#### Email

- `POST /api/email/test`
- `POST /api/email/reserva`
- `POST /api/email/cita-confirmada`
- `POST /api/email/reserva-rechazada`
- `POST /api/email/recibo-pago`
- `POST /api/email/alerta-vacuna`
- `POST /api/email/recordatorio-cita`
- `POST /api/email/link-pago`
- `POST /api/email/manual-notification`
- `POST /api/email/client-welcome`

## 6. Capa de autenticacion y seguridad

### 6.1 Autenticacion

La autenticacion principal se apoya en Supabase Auth. El backend complementa este flujo con:

- Extraccion de bearer token.
- Decodificacion y verificacion JWT.
- Resolucion de rol.
- Rutas protegidas mediante decoradores.

### 6.2 Control de acceso

En frontend, `AppConfigContext` define paginas accesibles por rol:

- `admin`: acceso total al panel.
- `user`: acceso operativo sin reportes, auditoria ni configuracion avanzada.

### 6.3 CORS

`backend/app.py` toma `CORS_ORIGINS` y habilita los origenes configurados.

### 6.4 Recomendaciones de seguridad

- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` en frontend.
- Mantener separados los `.env` de frontend y backend.
- Validar que Stripe y SMTP no usen credenciales placeholder.
- Aplicar revisiones periodicas a roles, usuarios y sucursales.

## 7. Validaciones de datos

El backend utiliza `core/validators.py` para validar payloads:

- `CLIENT_VALIDATOR`
- `PET_VALIDATOR`
- `APPOINTMENT_VALIDATOR`
- `SERVICE_VALIDATOR`
- `PAYMENT_VALIDATOR`
- `INVENTORY_VALIDATOR`
- `CONTACT_VALIDATOR`

Estas validaciones cubren campos obligatorios, formato de correo, numericos, limites y carga parcial para updates.

## 8. Servicios de acceso a datos

### 8.1 Servicio generico

`core/services.py` define `SupabaseEntityService`, una capa CRUD reutilizable para:

- listar
- consultar por id
- crear
- actualizar
- eliminar

La clase trabaja por tabla y campo de orden, y soporta filtros y busqueda ligera.

### 8.2 Patron dominante

El proyecto usa dos caminos de acceso a datos:

- Desde frontend con `supabase.from(...)`
- Desde backend con `SupabaseEntityService` y `table(...)`

Esto significa que parte importante de la operacion se resuelve directamente desde la UI y otra parte pasa por API Flask cuando requiere validacion adicional o integracion externa.

## 9. Modelo de datos

### 9.1 Tablas operativas principales

Usadas por CRUD y dashboard:

- `clientes`
- `mascotas`
- `citas`
- `servicios`
- `pagos`
- `inventario`

### 9.2 Tablas extendidas y de soporte

Identificadas en migraciones y `AppConfigContext`:

- `vacunas`
- `historial_clinico`
- `suscripciones`
- `guarderia`
- `paseos`
- `facturas`
- `pagos_online`
- `notificaciones`
- `auditoria`
- `sucursales`
- `fotos_servicio`
- `reservas_online`
- `usuarios_sistema`

### 9.3 Funciones de cada grupo de tablas

| Grupo | Tablas | Uso |
|---|---|---|
| Core comercial | `clientes`, `mascotas`, `citas`, `servicios`, `pagos`, `inventario` | Operacion diaria |
| Salud | `vacunas`, `historial_clinico` | Seguimiento clinico y preventivo |
| Ingresos extendidos | `facturas`, `pagos_online`, `suscripciones` | Cobro recurrente y digital |
| Servicios especiales | `guarderia`, `paseos`, `fotos_servicio` | Servicios complementarios |
| Gobierno | `notificaciones`, `auditoria`, `sucursales`, `usuarios_sistema` | Control operativo y trazabilidad |
| Captacion | `reservas_online` | Solicitudes publicas desde la web |

### 9.4 Migraciones identificadas

- `migration.sql`: crea el bloque grande de tablas extendidas.
- `migration_v2.sql`: crea `reservas_online`.
- `migration_v3.sql`: ajusta politicas RLS sobre tablas extendidas.
- `migration_v4.sql`: crea `usuarios_sistema`.

## 10. Integraciones

### 10.1 Supabase

Se utiliza para:

- autenticacion
- persistencia de datos
- lectura y escritura de la mayoria de entidades

### 10.2 SMTP

`core/email_service.py` y `routes/email_bp.py` soportan:

- email de prueba
- confirmacion de reserva
- alerta al administrador
- confirmacion de cita
- rechazo de reserva
- recibo de pago
- alerta de vacuna
- recordatorio de cita
- enlace de pago
- notificacion manual
- bienvenida a cliente

### 10.3 Stripe

`routes/stripe_payments.py` implementa:

- creacion de checkout session
- retorno de URL para pago
- procesamiento de webhook
- actualizacion de `pagos_online`

## 11. Variables de entorno relevantes

### 11.1 Frontend

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL`

### 11.2 Backend

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `CORS_ORIGINS`
- `PORT`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `ADMIN_EMAILS`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FRONTEND_URL`

## 12. Flujo tecnico de procesos clave

### 12.1 Login

1. Usuario envia credenciales desde frontend.
2. Backend llama a Supabase Auth.
3. Se devuelve token.
4. Frontend valida redireccion segun rol.
5. `ProtectedRoute` protege el panel.

### 12.2 Reserva online

1. Cliente visita pagina de servicios.
2. Completa formulario de reserva.
3. La reserva se guarda en `reservas_online`.
4. Se envian correos al cliente y al administrador.
5. Desde admin, la reserva puede rechazarse o confirmarse.
6. Al confirmarla, se crea una cita formal.

### 12.3 Confirmacion de cita

1. El admin confirma una reserva o crea una cita.
2. El frontend puede invocar el backend de confirmacion.
3. El backend valida payload.
4. Se emite correo de confirmacion si SMTP esta configurado.

### 12.4 Pago online

1. Se genera registro contextual de pago.
2. El admin solicita checkout de Stripe.
3. Stripe devuelve session y URL.
4. El cliente paga.
5. El webhook actualiza `pagos_online`.

### 12.5 Vacunas e historial clinico

1. En el modulo Mascotas se registran dosis y consultas.
2. Los datos se guardan en tablas especializadas.
3. El dashboard y reportes usan esa informacion para alertas y analitica.

## 13. Estrategia de pruebas observada

El repositorio contiene:

- `backend/tests/test_app.py`
- `Canivet/tests/validators.test.js`

Esto indica al menos cobertura inicial sobre backend y validaciones cliente. Aun asi, por el volumen de modulos, conviene ampliar pruebas sobre:

- reservas online
- flujos de correo
- confirmacion de citas
- pagos online
- permisos por rol
- filtros por sucursal

## 14. Despliegue local

### 14.1 Frontend

```bash
cd Canivet
npm install
npm run dev
```

### 14.2 Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## 15. Mantenimiento recomendado

- Revisar periodicamente variables de entorno.
- Mantener sincronizadas las migraciones con la realidad del frontend.
- Documentar cada nueva tabla o endpoint.
- Registrar cambios funcionales por modulo.
- Monitorear logs de correo y pagos.
- Ejecutar pruebas despues de cambios en auth, pagos o reservas.

## 16. Deuda tecnica y oportunidades de mejora

- Unificar mas claramente que operaciones pasan por frontend directo y cuales por backend.
- Endurecer reglas de seguridad y RLS segun ambiente final.
- Expandir pruebas automatizadas por dominio.
- Formalizar manejo de errores y trazas en produccion.
- Consolidar documentacion viva de base de datos y contratos API.
- Evaluar centralizacion de mas logica clinica en servicios especializados.

## 17. Conclusion tecnica

CaniVet no es una maqueta simple: la base actual refleja un sistema modular con frontend administrativo robusto, backend de soporte util y una capa de datos rica en entidades. La arquitectura ya resuelve escenarios reales como reservas publicas, confirmaciones por correo, pagos online, historial clinico, control multi-sucursal y auditoria. Este manual tecnico deja documentado ese alcance para facilitar sostenibilidad y crecimiento.
