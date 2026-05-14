# MANUAL DE USUARIO CaniVet

## 1. Introduccion

Este manual explica como utilizar CaniVet desde la perspectiva del usuario final. El sistema esta pensado para personal administrativo, operativo y de apoyo en una clinica veterinaria o centro de servicios para mascotas. Tambien contempla interacciones publicas para clientes que visitan la pagina, consultan servicios o generan una reserva online.

## 2. A quien va dirigido

- Administrador del sistema.
- Personal de recepcion.
- Personal de caja.
- Encargado de servicios y seguimiento.
- Usuario operativo con permisos limitados.

## 3. Requisitos basicos de uso

- Navegador moderno.
- Conexion a internet.
- Credenciales validas.
- Acceso al frontend de CaniVet.

## 4. Tipos de acceso

### 4.1 Usuario publico

Puede:

- ver la pagina principal
- consultar servicios
- enviar mensajes por contacto
- registrarse
- iniciar sesion
- realizar una reserva online

### 4.2 Usuario operativo

Puede:

- entrar al panel
- gestionar clientes, mascotas, citas, servicios, pagos e inventario
- usar suscripciones, guarderia y paseos

### 4.3 Administrador

Ademas de lo anterior, puede:

- ver reportes
- gestionar configuracion
- administrar usuarios y roles
- trabajar con sucursales
- consultar auditoria
- emitir notificaciones internas o por correo

## 5. Flujo de acceso al sistema

### 5.1 Registro

1. Abrir la aplicacion.
2. Entrar a la opcion de registro.
3. Completar correo y contrasena.
4. Confirmar el registro segun el flujo de Supabase.
5. Iniciar sesion con la cuenta creada.

### 5.2 Inicio de sesion

1. Ir a la pantalla de login.
2. Escribir correo y contrasena.
3. Pulsar el boton de acceso.
4. Esperar la validacion del sistema.
5. Entrar al panel segun los permisos del rol.

### 5.3 Cierre de sesion

1. Ir al panel administrativo.
2. Ubicar el bloque del usuario en la parte inferior del menu lateral.
3. Presionar el boton de cerrar sesion.

## 6. Navegacion general del panel

Una vez autenticado, el usuario vera:

- barra lateral con modulos
- encabezado superior con contexto de pagina
- contenido central con tablas, formularios y acciones

El menu lateral puede mostrar distintos modulos segun el rol del usuario.

## 7. Modulo Dashboard

### 7.1 Para que sirve

El dashboard resume el estado del negocio y presenta alertas operativas.

### 7.2 Que informacion muestra

- total de clientes
- total de mascotas
- citas del dia
- ingresos acumulados
- suscripciones activas
- guarderia activa
- paseos en curso
- notificaciones pendientes
- alertas de vacunas
- inventario critico

### 7.3 Como usarlo

1. Abrir `Dashboard`.
2. Revisar las tarjetas KPI.
3. Consultar graficos de ingresos y servicios.
4. Observar alertas destacadas.
5. Refrescar manualmente si se requiere.

## 8. Modulo Clientes

### 8.1 Objetivo

Registrar y mantener informacion de propietarios o clientes.

### 8.2 Operaciones comunes

- crear cliente
- editar cliente
- eliminar cliente
- buscar cliente
- asociar cliente a sucursal

### 8.3 Flujo sugerido

1. Abrir `Clientes`.
2. Pulsar `Nuevo cliente`.
3. Completar nombre y datos de contacto.
4. Guardar.
5. Verificar que aparezca en la tabla.

## 9. Modulo Mascotas

### 9.1 Objetivo

Administrar el perfil completo de la mascota y su seguimiento de salud.

### 9.2 Informacion que maneja

- nombre de la mascota
- tipo o especie
- raza
- edad
- cliente propietario
- sucursal asociada

### 9.3 Funciones extendidas del modulo

- registro de vacunas
- historial clinico
- resumen de salud
- alertas de vacunas vencidas o proximas
- consulta de actividades de paseo y guarderia

### 9.4 Como registrar una mascota

1. Entrar a `Mascotas`.
2. Pulsar `Nueva mascota`.
3. Elegir el cliente propietario.
4. Completar datos generales.
5. Guardar.

### 9.5 Como registrar vacunas

1. Ubicar la mascota en la tabla.
2. Pulsar `Vacunas`.
3. Agregar nombre de vacuna, fecha aplicada y proxima dosis.
4. Guardar.

### 9.6 Como registrar historial clinico

1. Ubicar la mascota.
2. Pulsar `Historial`.
3. Registrar fecha de consulta, motivo, sintomas, diagnostico, tratamiento y observaciones.
4. Guardar la consulta.

### 9.7 Cuando usar este modulo antes de otros

Es recomendable crear primero el cliente y luego la mascota antes de programar citas, suscripciones o servicios complementarios.

## 10. Modulo Citas

### 10.1 Objetivo

Gestionar la agenda principal de atencion.

### 10.2 Operaciones disponibles

- crear cita
- editar cita
- eliminar cita
- consultar citas del dia
- cambiar estado
- convertir reservas online en citas
- enviar confirmaciones
- crear enlaces de pago online

### 10.3 Como crear una cita

1. Abrir `Citas`.
2. Pulsar `Nueva cita`.
3. Seleccionar cliente, mascota y servicio.
4. Indicar fecha, hora y notas.
5. Guardar.

### 10.4 Como confirmar una reserva online

1. Ir a `Citas`.
2. Abrir la pestaña de `Reservas`.
3. Seleccionar la reserva pendiente.
4. Confirmar la reserva.
5. Completar o validar cliente, mascota y servicio.
6. Guardar para crear la cita oficial.

### 10.5 Como rechazar una reserva online

1. Ir a la lista de reservas.
2. Seleccionar la reserva.
3. Pulsar `Rechazar`.
4. Confirmar la accion.
5. Si el cliente tiene correo, el sistema puede enviar la notificacion correspondiente.

## 11. Modulo Servicios

### 11.1 Objetivo

Administrar el catalogo de servicios ofrecidos por la clinica.

### 11.2 Operaciones

- crear servicio
- editar servicio
- eliminar servicio
- visualizar precio y descripcion

### 11.3 Relacion con otros modulos

Los servicios se usan en:

- pagina publica
- citas
- reservas online
- pagos
- reportes

## 12. Modulo Pagos

### 12.1 Objetivo

Registrar los cobros realizados a clientes.

### 12.2 Datos frecuentes

- cliente
- monto
- metodo de pago
- estado
- fecha

### 12.3 Como registrar un pago

1. Entrar a `Pagos`.
2. Pulsar `Nuevo pago`.
3. Seleccionar cliente.
4. Introducir monto y metodo.
5. Guardar.

### 12.4 Acciones relacionadas

- envio de recibo por correo
- relacion con facturas
- relacion con pagos online

## 13. Modulo Inventario

### 13.1 Objetivo

Controlar productos o insumos del negocio.

### 13.2 Operaciones

- registrar producto
- actualizar cantidad
- actualizar precio
- eliminar producto
- identificar bajo stock

### 13.3 Buenas practicas

- revisar el inventario critico desde dashboard
- actualizar cantidades despues de entradas o salidas
- mantener categorias y descripcion claras

## 14. Modulo Reportes

Disponible para usuarios con permisos de administracion.

### 14.1 Tipos de reportes identificados

- resumen financiero
- metodos de pago
- servicios mas rentables
- clientes destacados
- reporte por mascota
- inventario
- comparativo por sucursal

### 14.2 Exportaciones

El usuario puede exportar reportes en:

- CSV
- JSON
- formato imprimible

### 14.3 Flujo recomendado

1. Abrir `Reportes`.
2. Seleccionar el tipo de analisis.
3. Revisar tarjetas resumen y graficos.
4. Exportar si se necesita compartir o archivar.

## 15. Modulo Configuracion

Disponible para administradores.

### 15.1 Seccion General

Permite definir:

- nombre de la clinica
- telefono
- email de contacto
- zona horaria
- moneda

### 15.2 Seccion Sucursales

Permite:

- crear sucursal
- editar sucursal
- eliminar sucursal
- definir estado operativo

### 15.3 Seccion Usuarios y roles

Permite:

- registrar acceso por correo
- asignar rol
- activar o desactivar acceso
- asociar sucursales permitidas

### 15.4 Seccion Notificaciones

Permite:

- crear notificaciones manuales
- enviar mensajes internos
- enviar correo a un cliente
- revisar historial reciente

## 16. Modulo Suscripciones

### 16.1 Objetivo

Gestionar planes recurrentes relacionados con clientes, mascotas o servicios.

### 16.2 Operaciones

- crear suscripcion
- editar suscripcion
- eliminar suscripcion
- activar o pausar suscripcion
- revisar proximo cobro

## 17. Modulo Guarderia

### 17.1 Objetivo

Registrar asistencia de mascotas al servicio de guarderia.

### 17.2 Operaciones

- registrar ingreso
- registrar salida
- agregar notas
- asociar cliente y mascota

## 18. Modulo Paseos

### 18.1 Objetivo

Controlar servicios de paseo programados o en curso.

### 18.2 Informacion manejada

- mascota
- cliente
- fecha
- hora de inicio
- hora de fin
- duracion
- distancia
- paseador
- estado
- notas

### 18.3 Operaciones

- crear paseo
- editar paseo
- actualizar estado
- eliminar paseo

## 19. Modulo Auditoria

Disponible para administradores.

### 19.1 Objetivo

Consultar acciones registradas automaticamente por el sistema.

### 19.2 Utilidad

- dar seguimiento a cambios
- validar operaciones sensibles
- reforzar control interno

## 20. Uso de la pagina publica

### 20.1 Inicio

Presenta la propuesta general del sistema y acceso a otras secciones.

### 20.2 Servicios

Permite:

- consultar la oferta de servicios
- revisar nombre, descripcion y precio
- abrir el formulario de reserva

### 20.3 Contacto

Permite enviar mensajes a la clinica desde la pagina.

### 20.4 Reserva online

1. Ir a servicios.
2. Seleccionar `Reservar`.
3. Completar nombre, contacto, mascota, servicio, fecha y notas.
4. Enviar.
5. Esperar confirmacion por parte del negocio.

## 21. Recomendaciones operativas

- Registrar primero el cliente y luego su mascota.
- Mantener las citas con estados actualizados.
- Revisar vacunas proximas o vencidas cada dia.
- Controlar el stock antes de que llegue a nivel critico.
- Confirmar que el correo del cliente este correcto antes de notificar.
- Revisar permisos por rol despues de crear usuarios nuevos.
- Verificar la sucursal activa antes de registrar informacion.

## 22. Solucion de problemas comunes

### No puedo iniciar sesion

- Verificar correo y contrasena.
- Confirmar que la cuenta este habilitada.
- Revisar si Supabase requiere confirmacion previa del correo.

### No se envia un correo

- Revisar que el cliente tenga email.
- Confirmar que SMTP este configurado en backend.
- Consultar al administrador tecnico.

### No veo un modulo en el menu

- Probablemente el rol actual no tiene permiso.
- Solicitar revision de acceso al administrador.

### No aparecen datos en una tabla

- Verificar filtros de sucursal o busqueda.
- Revisar si el registro realmente fue guardado.

## 23. Conclusiones de uso

CaniVet esta pensado para que la operacion diaria se gestione desde un solo lugar. La clave de un buen uso es respetar el flujo natural del negocio: crear clientes, registrar mascotas, programar citas, cobrar servicios, mantener seguimiento clinico y utilizar reportes para tomar decisiones. Mientras mas disciplinado sea el registro, mayor valor genera la plataforma.
