# CRONOGRAMA DE ACTIVIDADES CaniVet

## 1. Proposito del cronograma

Este cronograma organiza el desarrollo y consolidacion del proyecto CaniVet de acuerdo con los modulos reales presentes en la plataforma. El enfoque no se limita a las pantallas visibles, sino que incorpora arquitectura, integraciones, datos, pruebas, documentacion y despliegue.

## 2. Horizonte propuesto del proyecto

- Duracion de referencia: 16 semanas
- Estructura: analisis, diseno, construccion, integracion, validacion y entrega
- Modalidad: incremental por modulos y por dependencias tecnicas

## 3. Fases generales

| Fase | Semanas | Objetivo |
|---|---|---|
| Inicio y analisis | 1-2 | Definir problema, actores, alcance y modulos |
| Diseno funcional y tecnico | 3-4 | Arquitectura, base de datos, flujos y UI |
| Construccion base | 5-8 | Autenticacion, CRUD core y estructura del panel |
| Construccion extendida | 9-12 | Modulos avanzados, reservas, correo, pagos, reportes |
| Integracion y calidad | 13-14 | Pruebas, ajustes, endurecimiento y trazabilidad |
| Documentacion y entrega | 15-16 | Manuales, cronograma final, empaquetado y presentacion |

## 4. Cronograma maestro por actividad

| ID | Actividad | Semanas | Dependencias | Entregable |
|---|---|---|---|---|
| A01 | Levantamiento de necesidades del negocio | 1 | Ninguna | Lista de requerimientos |
| A02 | Definicion del alcance y modulos | 1-2 | A01 | Mapa funcional del sistema |
| A03 | Diseno de arquitectura general | 2-3 | A02 | Arquitectura cliente-servidor |
| A04 | Diseno de base de datos inicial | 2-4 | A02 | Modelo de entidades y relaciones |
| A05 | Configuracion del entorno frontend | 3 | A03 | Proyecto React operativo |
| A06 | Configuracion del entorno backend | 3 | A03 | Proyecto Flask operativo |
| A07 | Integracion con Supabase | 3-4 | A04, A05, A06 | Conexion a datos y auth |
| A08 | Diseno de autenticacion y roles | 4-5 | A07 | Login, registro y rutas protegidas |
| A09 | Desarrollo del panel administrativo base | 5 | A08 | Layout, sidebar, topbar |
| A10 | Modulo Clientes | 5-6 | A09 | CRUD de clientes |
| A11 | Modulo Mascotas | 6-7 | A10 | CRUD de mascotas |
| A12 | Vacunas e historial clinico | 7-8 | A11 | Seguimiento de salud |
| A13 | Modulo Servicios | 6-7 | A09 | Catalogo de servicios |
| A14 | Modulo Citas | 7-8 | A10, A11, A13 | Agenda principal |
| A15 | Pagos e inventario | 8-9 | A10, A13, A14 | Control comercial |
| A16 | Dashboard con KPIs y alertas | 8-9 | A10-A15 | Panel de control |
| A17 | Pagina publica de servicios y contacto | 9 | A13 | Vitrina publica |
| A18 | Reservas online | 9-10 | A17, A14 | Captacion web |
| A19 | Integracion SMTP y notificaciones | 10-11 | A18 | Correos operativos |
| A20 | Stripe y pagos online | 10-11 | A15 | Checkout y webhook |
| A21 | Suscripciones | 11 | A10, A11, A15 | Planes recurrentes |
| A22 | Guarderia | 11-12 | A10, A11 | Control de asistencia |
| A23 | Paseos | 11-12 | A10, A11 | Seguimiento de paseos |
| A24 | Configuracion, sucursales y usuarios | 12 | A08 | Gobierno del sistema |
| A25 | Auditoria y trazabilidad | 12-13 | A24 | Registro de acciones |
| A26 | Reportes y exportaciones | 13 | A15, A16, A24 | Analitica y salida de datos |
| A27 | Pruebas funcionales integrales | 13-14 | A10-A26 | Matriz de validacion |
| A28 | Ajustes de usabilidad y correccion de errores | 14 | A27 | Version estable |
| A29 | Elaboracion documental | 15 | A27, A28 | Manuales y acta |
| A30 | Presentacion, empaquetado y entrega | 16 | A29 | Cierre del proyecto |

## 5. Cronograma por modulo funcional

### 5.1 Acceso y seguridad

| Modulo | Analisis | Diseno | Desarrollo | Pruebas | Cierre |
|---|---|---|---|---|---|
| Login y registro | S1 | S3 | S4-S5 | S13 | S15 |
| Roles y rutas protegidas | S2 | S4 | S5 | S13 | S15 |
| Usuarios del sistema | S2 | S4 | S12 | S13-S14 | S15 |

### 5.2 Operacion principal

| Modulo | Analisis | Diseno | Desarrollo | Pruebas | Cierre |
|---|---|---|---|---|---|
| Clientes | S1 | S4 | S5-S6 | S13 | S15 |
| Mascotas | S1 | S4 | S6-S7 | S13 | S15 |
| Vacunas | S2 | S4 | S7-S8 | S13 | S15 |
| Historial clinico | S2 | S4 | S7-S8 | S13 | S15 |
| Servicios | S1 | S4 | S6-S7 | S13 | S15 |
| Citas | S2 | S4 | S7-S8 | S13 | S15 |
| Pagos | S2 | S4 | S8-S9 | S13 | S15 |
| Inventario | S2 | S4 | S8-S9 | S13 | S15 |

### 5.3 Servicios complementarios

| Modulo | Analisis | Diseno | Desarrollo | Pruebas | Cierre |
|---|---|---|---|---|---|
| Suscripciones | S3 | S5 | S11 | S13 | S15 |
| Guarderia | S3 | S5 | S11-S12 | S13 | S15 |
| Paseos | S3 | S5 | S11-S12 | S13 | S15 |

### 5.4 Comercial y experiencia del cliente

| Modulo | Analisis | Diseno | Desarrollo | Pruebas | Cierre |
|---|---|---|---|---|---|
| Pagina publica | S2 | S4 | S9 | S13 | S15 |
| Contacto | S2 | S4 | S9 | S13 | S15 |
| Reservas online | S2 | S5 | S9-S10 | S13 | S15 |
| Correos automaticos | S3 | S5 | S10-S11 | S13 | S15 |
| Pagos online Stripe | S3 | S5 | S10-S11 | S13-S14 | S15 |

### 5.5 Gobierno, analitica y soporte

| Modulo | Analisis | Diseno | Desarrollo | Pruebas | Cierre |
|---|---|---|---|---|---|
| Dashboard | S2 | S5 | S8-S9 | S13 | S15 |
| Reportes | S3 | S5 | S13 | S14 | S15 |
| Configuracion general | S3 | S5 | S12 | S14 | S15 |
| Sucursales | S3 | S5 | S12 | S14 | S15 |
| Notificaciones | S3 | S5 | S10-S12 | S14 | S15 |
| Auditoria | S3 | S5 | S12-S13 | S14 | S15 |

## 6. Dependencias criticas

Para que el proyecto avance sin bloqueos, estas dependencias deben respetarse:

- No se debe cerrar `Mascotas` sin haber definido `Clientes`.
- No se debe cerrar `Citas` sin `Mascotas` y `Servicios`.
- `Reservas online` depende de `Servicios` y del flujo de `Citas`.
- `Stripe` depende de `Pagos` y configuracion externa.
- `Dashboard` y `Reportes` dependen de casi todos los modulos core.
- `Auditoria` y `Configuracion` dependen de tener roles y flujos administrativos definidos.

## 7. Hitos principales

| Hito | Semana | Resultado esperado |
|---|---|---|
| H1 | 2 | Alcance del sistema aprobado |
| H2 | 4 | Arquitectura y base de datos definidas |
| H3 | 6 | CRUD basico y acceso autenticado funcionando |
| H4 | 8 | Operacion core de clientes, mascotas, servicios y citas disponible |
| H5 | 10 | Pagina publica y reservas online funcionando |
| H6 | 11 | Correos y pagos online integrados |
| H7 | 13 | Modulos extendidos completos |
| H8 | 14 | Validacion integral ejecutada |
| H9 | 15 | Documentacion terminada |
| H10 | 16 | Proyecto listo para entrega |

## 8. Entregables por fase

### Fase 1. Inicio y analisis

- definicion del problema
- alcance funcional
- listado de actores
- backlog inicial

### Fase 2. Diseno

- arquitectura tecnica
- estructura del frontend y backend
- scripts de base de datos
- flujos de autenticacion y datos

### Fase 3. Construccion base

- login y registro
- panel administrativo
- CRUD de clientes, mascotas, servicios y citas

### Fase 4. Construccion extendida

- dashboard
- pagos
- inventario
- reservas online
- correo
- Stripe
- suscripciones
- guarderia
- paseos
- configuracion
- auditoria

### Fase 5. Integracion y calidad

- pruebas funcionales
- correccion de errores
- revision de permisos y sucursales
- validacion de integraciones

### Fase 6. Documentacion y entrega

- acta de proyecto
- manual tecnico
- manual de usuario
- cronograma final
- paquete documental

## 9. Riesgos que impactan el cronograma

| Riesgo | Efecto en calendario | Respuesta sugerida |
|---|---|---|
| Cambios de alcance tardios | Retraso de fases finales | Congelar alcance por iteracion |
| Problemas con credenciales externas | Bloqueo en SMTP o Stripe | Probar integraciones temprano |
| Diferencias entre tablas y UI | Retrabajo tecnico | Validar datos por modulo |
| Falta de pruebas continuas | Mas errores al integrar | Ejecutar validaciones por sprint |
| Dependencia de un solo desarrollador | Cuello de botella | Priorizar modulos criticos primero |

## 10. Recomendacion de seguimiento

Para un control efectivo, conviene revisar semanalmente:

- modulos completados
- incidencias pendientes
- dependencias bloqueadas
- estado de integraciones
- porcentaje documental

## 11. Conclusion

Este cronograma traduce el proyecto CaniVet en una secuencia realista de actividades basada en los modulos existentes del sistema. La mayor fortaleza del plan es que no separa analisis, desarrollo y documentacion como islas, sino que los conecta con la logica del producto: primero se construye la base, luego los modulos core, despues los servicios avanzados y finalmente la consolidacion documental y la entrega.
