# CaniVet - Sistema de Gestion Canina y Veterinaria

## Descripcion

CaniVet es una plataforma web integral para la administracion de clinicas veterinarias y centros de cuidado canino. El sistema centraliza procesos de autenticacion, gestion de clientes, mascotas, citas, servicios, pagos, inventario, reportes y notificaciones por correo electronico.

El proyecto fue concebido como una solucion administrativa moderna que reduzca la dispersion de informacion y mejore la trazabilidad de cada operacion del negocio. Su arquitectura permite separar responsabilidades entre interfaz, API, autenticacion y persistencia, lo que facilita tanto el mantenimiento como la escalabilidad.

## Objetivo

Digitalizar y optimizar la operacion diaria del negocio veterinario, ofreciendo una solucion moderna, organizada y escalable que mejore la trazabilidad de la informacion y la calidad del servicio.

## Problema que resuelve

En muchas clinicas y centros de cuidado animal, la informacion se gestiona de forma manual o en herramientas dispersas. Esto genera errores de registro, dificultad para consultar historiales, lentitud para programar servicios y poca capacidad analitica para tomar decisiones. CaniVet responde a este problema mediante una plataforma centralizada que integra operaciones y datos relacionados.

## Caracteristicas principales

- Autenticacion con Supabase Auth.
- Panel administrativo con rutas protegidas.
- CRUD para clientes, mascotas, citas, servicios, pagos e inventario.
- Modulos adicionales de suscripciones, guarderia, paseos y auditoria.
- Reportes con exportacion a CSV, JSON y formato imprimible.
- Integracion de correo electronico mediante Gmail SMTP.
- Arquitectura desacoplada entre frontend React y backend Flask.

## Modulos del sistema

- Inicio, login y registro.
- Dashboard administrativo.
- Gestion de clientes.
- Gestion de mascotas.
- Agenda de citas.
- Catalogo de servicios.
- Gestion de pagos.
- Control de inventario.
- Suscripciones.
- Guarderia y paseos.
- Reportes y analitica.
- Auditoria y configuracion.

## Tecnologias utilizadas

- Frontend: React 19, Vite, CSS.
- Backend: Flask 3, flask-cors, requests.
- Base de datos: Supabase PostgreSQL.
- Autenticacion: Supabase Auth.
- Reportes: Chart.js.
- Pagos: Stripe Payment Links.
- Control de versiones: Git y GitHub.

## Estructura general

```text
canivet/
|-- Canivet/            # Frontend React
|-- backend/            # API Flask y logica de negocio
|-- docs/               # Documentacion y entregables
|-- migration.sql       # Scripts de base de datos
|-- migration_v2.sql
|-- migration_v3.sql
`-- migration_v4.sql
```

## Instalacion

### Frontend

```bash
cd Canivet
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Requisitos previos

- Node.js 18 o superior.
- Python 3.12 o superior.
- Cuenta y proyecto configurado en Supabase.
- Credenciales SMTP validas si se desea habilitar correo.
- Navegador moderno para acceso al panel.

## Variables de entorno importantes

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

## Flujo general de uso

1. El usuario se registra o inicia sesion.
2. El sistema valida la identidad y determina el rol.
3. El usuario accede al panel administrativo.
4. Desde el panel puede gestionar clientes, mascotas, citas, servicios, pagos e inventario.
5. Los reportes permiten revisar indicadores y exportar resultados.
6. Las funciones de correo y contacto apoyan la comunicacion operativa.

## Buenas practicas aplicadas

- Separacion por capas y modulos.
- Uso de rutas protegidas.
- Validaciones de datos en backend.
- Variables de entorno para configuracion sensible.
- Versionado de migraciones y entregables.

## Documentacion incluida

- `Acta_Proyecto_CaniVet.docx`
- `Plan_Actividades_CaniVet.docx`
- `Cronograma_CaniVet.docx`
- `Manual_Usuario_CaniVet.docx`
- `Manual_Tecnico_CaniVet.docx`
- `Analisis_Diseno_CaniVet.docx`

## Estado del proyecto

Proyecto academico en desarrollo avanzado con modulos funcionales y paquete documental base listo para entrega.

## Mejoras futuras

- Historial clinico mas detallado.
- Mayor automatizacion de notificaciones.
- Version movil o adaptacion progresiva ampliada.
- Reportes gerenciales mas profundos.
- Integracion con procesos de facturacion formales.
