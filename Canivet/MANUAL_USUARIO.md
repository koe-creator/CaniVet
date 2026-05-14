# MANUAL DE USUARIO CaniVet

## Introduccion
Este manual explica el uso basico del sistema CaniVet desde la perspectiva del usuario final. Las capturas aqui se describen en texto para que luego puedan ser reemplazadas por imagenes reales del sistema.

## 1. Como registrarse
1. Abrir la aplicacion en `http://localhost:5173`.
2. Entrar a la opcion `Registrate aqui` o abrir la ruta `/registro`.
3. Completar:
   - nombre completo
   - correo electronico
   - contraseña
   - confirmacion de contraseña
4. Presionar `Crear cuenta`.
5. Si todo sale bien, el sistema mostrara un mensaje indicando que la cuenta fue creada.

### Captura descrita
Pantalla de registro con un formulario centrado que contiene campos de nombre, correo, contraseña y confirmacion, junto con el boton `Crear cuenta`.

## 2. Como verificar OTP
Nota importante:
La version actual de CaniVet no tiene una pantalla propia para OTP dentro del frontend. La verificacion depende del flujo de confirmacion configurado en Supabase.

Flujo recomendado:
1. Luego del registro, revisar el correo electronico.
2. Abrir el mensaje enviado por Supabase.
3. Confirmar la cuenta usando el enlace o codigo enviado.
4. Regresar al sistema e iniciar sesion.

### Captura descrita
Correo de confirmacion de Supabase mostrando el enlace o codigo de verificacion enviado al usuario.

## 3. Como iniciar sesion
1. Ir a `/login`.
2. Escribir el correo electronico registrado.
3. Escribir la contraseña.
4. Presionar `Ingresar al sistema`.
5. Si las credenciales son correctas, el sistema redirige al panel administrativo.

### Captura descrita
Pantalla de login con el nombre CaniVet, campo de correo, campo de contraseña y boton azul `Ingresar al sistema`.

## 4. Como ver el dashboard
1. Iniciar sesion.
2. Entrar al modulo `Dashboard` desde el menu lateral.
3. Revisar indicadores generales:
   - clientes
   - mascotas
   - citas del dia
   - ingresos
4. Consultar graficos de ingresos, servicios y actividad reciente.

### Captura descrita
Panel administrativo con barra lateral izquierda, topbar superior y tarjetas de resumen en la zona principal.

## 5. Como registrar entrada de vehiculo
Observacion:
La version actual de CaniVet no maneja vehiculos. Este sistema esta orientado a gestion veterinaria.

Equivalente funcional dentro de CaniVet:
1. Entrar al modulo `Citas`.
2. Presionar `Nueva cita`.
3. Registrar fecha, hora, cliente, mascota, servicio y notas.
4. Guardar la cita como ingreso o atencion programada de la mascota.

### Captura descrita
Ventana modal de nueva cita con campos de fecha, hora, cliente, mascota, servicio, estado y sucursal.

## 6. Como registrar salida
Observacion:
La version actual no tiene un modulo llamado `salida` como en sistemas de parqueo.

Equivalente funcional dentro de CaniVet:
1. Abrir el modulo `Citas`.
2. Cambiar el estado de una cita a `Completada` o `Cancelada`.
3. Ir al modulo `Pagos` para registrar el cobro correspondiente.

### Captura descrita
Tabla de citas con selector de estado por cada registro y botones de accion para editar o eliminar.

## 7. Como ver pagos
1. Entrar al modulo `Pagos`.
2. Revisar la tabla de transacciones registradas.
3. Consultar:
   - cliente
   - monto
   - fecha
   - metodo de pago
   - comprobante
4. Si se desea, usar el boton para registrar un nuevo pago.

### Captura descrita
Tabla de pagos con montos destacados en color verde, metodo de pago etiquetado y acceso al comprobante generado.

## 8. Como cerrar sesion
1. En el panel administrativo, mirar la parte inferior del menu lateral.
2. Localizar el icono de cierre junto al nombre del usuario.
3. Presionarlo para salir del sistema.
4. El token de sesion se elimina y el usuario queda desconectado.

### Captura descrita
Seccion inferior del sidebar con avatar del usuario, nombre visible y un boton pequeño para cerrar sesion.

## Modulos disponibles para el usuario
- Dashboard
- Clientes
- Mascotas
- Citas
- Servicios
- Pagos
- Inventario
- Reportes
- Configuracion

## Recomendaciones de uso
- Confirmar el correo antes de iniciar sesion si Supabase lo exige.
- Completar los datos obligatorios en cada formulario.
- Verificar la sucursal activa antes de registrar informacion.
- Mantener actualizado el historial de mascotas y las citas.
