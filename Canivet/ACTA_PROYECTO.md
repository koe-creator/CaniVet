# ACTA DE PROYECTO

## 1. Identificacion general

- Nombre del proyecto: `CaniVet`
- Tipo de solucion: plataforma web para gestion veterinaria y cuidado canino
- Naturaleza del proyecto: academico con enfoque de implementacion real
- Fecha de referencia documental: mayo de 2026
- Plataforma objetivo: web responsiva para operacion administrativa y atencion al cliente

## 2. Resumen ejecutivo

CaniVet es una plataforma web orientada a centralizar la operacion de una clinica veterinaria o centro de servicios para mascotas. El sistema unifica procesos de atencion, registro, seguimiento, cobro, control operativo y comunicacion con clientes dentro de una sola solucion. En lugar de depender de hojas de calculo, cuadernos, mensajes sueltos o multiples herramientas desconectadas, CaniVet organiza la informacion de clientes, mascotas, citas, reservas, servicios, pagos, inventario y configuracion operativa bajo un flujo digital coherente.

La solucion combina un frontend en React con Vite, un backend en Flask y una base de datos en Supabase. Adicionalmente, incorpora autenticacion, control de acceso por roles, soporte de sucursales, correos automaticos, reservas online y una capa administrativa que permite consultar reportes y ejecutar tareas de seguimiento.

## 3. Situacion o problema identificado

En los entornos veterinarios pequenos y medianos, las operaciones suelen presentar varios problemas recurrentes:

- Informacion de clientes y mascotas dispersa en medios distintos.
- Dificultad para dar seguimiento a citas, vacunas e historial clinico.
- Poco control sobre pagos, enlaces de cobro, recibos y confirmaciones.
- Baja trazabilidad en servicios complementarios como guarderia, paseos y suscripciones.
- Falta de visibilidad sobre stock, alertas operativas e indicadores del negocio.
- Escasa estandarizacion en permisos de acceso, sucursales y comunicaciones.

Estas debilidades impactan la calidad del servicio, aumentan errores humanos y complican la toma de decisiones. CaniVet nace para atacar precisamente esa fragmentacion operativa.

## 4. Justificacion

El proyecto se justifica por la necesidad de contar con una plataforma centralizada, segura y escalable que permita administrar el ciclo completo de atencion al cliente y de seguimiento a la mascota. No se trata solamente de registrar datos, sino de convertir informacion operativa en capacidad de gestion.

Con CaniVet se busca:

- Mejorar la organizacion interna del negocio.
- Reducir tiempos de respuesta en recepcion, agenda y seguimiento.
- Mantener trazabilidad de servicios, pagos y atenciones realizadas.
- Facilitar el monitoreo de vacunacion, consultas y operaciones recurrentes.
- Habilitar una experiencia mas profesional para el cliente mediante reservas, confirmaciones y notificaciones.

## 5. Objetivo general

Desarrollar un sistema web integral para la gestion de procesos veterinarios y de cuidado canino que permita administrar usuarios, clientes, mascotas, citas, reservas, servicios, pagos, inventario, reportes y comunicaciones, con seguridad de acceso y soporte para operacion multi-sucursal.

## 6. Objetivos especificos

- Implementar autenticacion y control de acceso por roles con Supabase Auth.
- Permitir el registro y mantenimiento de clientes y mascotas.
- Gestionar citas internas y reservas online desde una interfaz unificada.
- Integrar seguimiento de vacunas e historial clinico de cada mascota.
- Registrar servicios, pagos presenciales y pagos online.
- Mantener control de inventario y alertas por bajo stock.
- Gestionar suscripciones, guarderia y paseos como servicios recurrentes.
- Incorporar configuracion de sucursales, usuarios y notificaciones.
- Generar reportes operativos y financieros exportables.
- Documentar funcional, tecnica y metodologicamente toda la solucion.

## 7. Alcance funcional del proyecto

El alcance actual del sistema contempla los siguientes modulos reales identificados en el codigo:

### 7.1 Modulos publicos

- Pagina de inicio.
- Inicio de sesion.
- Registro de usuarios.
- Catalogo de servicios.
- Formulario de contacto.
- Flujo de reserva online desde la pagina de servicios.

### 7.2 Modulos administrativos principales

- Dashboard general con indicadores, alertas y graficos.
- Clientes.
- Mascotas.
- Citas.
- Reservas online pendientes de confirmacion.
- Servicios.
- Pagos.
- Inventario.
- Reportes.
- Configuracion general.

### 7.3 Modulos administrativos complementarios

- Suscripciones.
- Guarderia.
- Paseos.
- Auditoria.

### 7.4 Capacidades transversales

- Control de roles `admin` y `user`.
- Gestion de sucursales y filtrado por sede.
- Notificaciones internas y por correo.
- Integracion con Stripe para pagos online.
- Registro de facturas y pagos online en Supabase.
- Alerta de vacunas y recordatorios.
- Historial clinico por mascota.
- Registro de trazabilidad operativa en auditoria.

## 8. Fuera de alcance en esta version

Aunque la plataforma es amplia, la version actual no cubre completamente los siguientes puntos:

- Aplicacion movil nativa.
- Facturacion fiscal certificada.
- Integracion bancaria local completa.
- Sistema SMS productivo.
- Telemedicina o videoconsultas.
- ERP contable externo.
- Motor automatizado de workflows empresariales.

## 9. Usuarios y actores involucrados

### 9.1 Usuarios directos

- Administrador general.
- Personal operativo de recepcion o caja.
- Personal de apoyo clinico.
- Responsable de sucursal.

### 9.2 Usuarios indirectos

- Clientes o propietarios de mascotas.
- Equipo docente o evaluador academico.
- Responsable institucional del proyecto.

### 9.3 Roles del sistema

- `admin`: acceso total al panel, reportes, auditoria, configuracion, usuarios y notificaciones.
- `user`: acceso operativo a dashboard, clientes, mascotas, citas, servicios, pagos, inventario, suscripciones, guarderia y paseos.

## 10. Arquitectura organizacional del sistema

El proyecto se apoya en tres capas principales:

- Frontend SPA en React para experiencia del usuario.
- Backend Flask para autenticacion complementaria, validacion, SMTP y endpoints de soporte.
- Supabase como base de datos, autenticacion y persistencia de gran parte de la operacion.

Esta distribucion permite mantener desacople entre interfaz, logica de negocio y datos.

## 11. Inventario de modulos del negocio cubiertos

| Area | Modulo | Proposito principal |
|---|---|---|
| Acceso | Login y registro | Autenticar usuarios y controlar entrada al sistema |
| Comercial | Servicios publicos | Mostrar oferta y captar reservas |
| CRM | Clientes | Mantener datos del propietario |
| Operacion | Mascotas | Gestionar perfil, salud y seguimiento del animal |
| Agenda | Citas | Coordinar atencion programada |
| Captacion | Reservas online | Recibir solicitudes desde la web publica |
| Ingresos | Pagos | Registrar cobros, metodos y comprobantes |
| Inventario | Inventario | Controlar productos, cantidades y stock critico |
| Analitica | Dashboard y reportes | Medir operacion, ingresos y comportamiento |
| Fidelizacion | Suscripciones | Gestionar planes recurrentes |
| Servicios complementarios | Guarderia y paseos | Registrar asistencia y ejecucion de servicios |
| Gobierno TI | Configuracion y auditoria | Controlar parametros, accesos y trazabilidad |

## 12. Requerimientos generales identificados

### 12.1 Funcionales

- El sistema debe permitir iniciar sesion y registrar usuarios.
- Debe ofrecer CRUD para entidades operativas principales.
- Debe relacionar mascotas con clientes.
- Debe relacionar citas con mascotas y servicios.
- Debe permitir reservas publicas y su posterior confirmacion.
- Debe permitir registrar vacunas e historial clinico.
- Debe emitir notificaciones por correo en eventos clave.
- Debe diferenciar permisos por rol.
- Debe permitir trabajar con sucursales.
- Debe generar reportes exportables.

### 12.2 No funcionales

- Interfaz comprensible y responsiva.
- Seguridad basada en tokens y control de roles.
- Configuracion por variables de entorno.
- Mantenibilidad por separacion modular.
- Escalabilidad funcional para agregar nuevos servicios.

## 13. Entregables del proyecto

Los entregables documentales y tecnicos asociados a esta fase incluyen:

- Acta de proyecto.
- Manual tecnico.
- Manual de usuario.
- Cronograma de actividades.
- Codigo fuente frontend.
- Codigo fuente backend.
- Scripts de migracion de base de datos.
- Paquete documental y de soporte bajo `docs/`.

## 14. Riesgos principales del proyecto

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Configuracion incompleta de variables de entorno | Alto | Validar `.env` de frontend y backend antes del despliegue |
| Credenciales SMTP o Stripe invalidas | Alto | Probar endpoints de correo y checkout en ambiente controlado |
| Inconsistencias entre frontend, backend y tablas | Alto | Mantener inventario de entidades y pruebas por modulo |
| Cambios de alcance no planificados | Medio | Priorizar backlog por criticidad operativa |
| Errores en carga de datos por sucursal o rol | Medio | Probar con usuarios `admin` y `user` y revisar filtros |
| Dependencia de servicios externos | Medio | Diseñar mensajes de error y procedimientos de contingencia |

## 15. Restricciones y supuestos

### Restricciones

- La plataforma depende de conectividad a internet para Supabase y servicios externos.
- Los correos requieren configuracion SMTP valida.
- Los pagos online requieren cuenta Stripe configurada.
- El comportamiento por rol y sucursal depende de datos correctos en `usuarios_sistema` y configuracion local.

### Supuestos

- La clinica dispone de personal con conocimientos basicos de herramientas web.
- Se cuenta con infraestructura minima para ejecutar frontend y backend.
- Los datos maestros iniciales pueden ser registrados manualmente durante la puesta en marcha.

## 16. Beneficios esperados

- Mayor control sobre la agenda y la atencion.
- Historial mas confiable de clientes y mascotas.
- Mejor seguimiento de vacunas, consultas y servicios.
- Disminucion de perdidas de informacion.
- Mejor experiencia de reserva y comunicacion para el cliente.
- Visibilidad operativa mediante dashboard y reportes.

## 17. Criterios de exito

Se considerara que el proyecto cumple sus objetivos cuando:

- Los usuarios puedan autenticarse y navegar segun su rol.
- Los modulos principales operen con persistencia en Supabase.
- Las reservas online puedan convertirse en citas operativas.
- Los correos clave puedan enviarse desde el backend.
- Se puedan registrar pagos, inventario, suscripciones, guarderia y paseos.
- Los reportes y el dashboard ofrezcan informacion util para gestion.

## 18. Estado actual del proyecto

Con base en la estructura del codigo, CaniVet se encuentra en una etapa funcional avanzada. El sistema ya dispone de frontend administrativo, backend de soporte, scripts de migracion, multiples modulos de negocio y documentacion base. La fase actual se enfoca en consolidacion documental, refinamiento operativo y fortalecimiento de calidad para presentacion o entrega formal.

## 19. Conclusion

CaniVet representa una solucion integral y bien encaminada para la digitalizacion de procesos veterinarios y de cuidado canino. Su valor no esta solo en la cantidad de modulos, sino en la articulacion entre atencion, operacion, seguimiento y analitica. Esta acta formaliza el alcance, el contexto y la intencion del proyecto, dejando claro que se trata de una plataforma con enfoque practico, escalable y defendible tanto en un entorno academico como en una operacion real adaptada.
