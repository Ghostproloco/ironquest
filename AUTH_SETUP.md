# Cuentas · configuración de activación

Esta implementación utiliza Firebase Authentication para Google y correo/contraseña, verificación de correo, recuperación y cierre de sesión. El progreso sigue siendo local, aislado por UID; no se ha implementado Firestore ni sincronización en la nube.

## Estado configurado

- Proyecto: `ironquest-f628e`, plan Spark sin facturación añadida.
- App web: IRONQUEST Web.
- Google y Email/Password: habilitados.
- Dominio de producción: `ghostproloco.github.io`.
- Configuración web pública añadida a `firebase-config.js`.
- SDK inicializado en navegador con el servicio real; pendiente validar un acceso completo con una cuenta elegida por el usuario y los correos reales.

## Referencia de configuración

1. Crear o seleccionar un proyecto propio y registrar una app web IRONQUEST.
2. Activar Authentication y los proveedores Google y Email/Password. Elegir el correo de soporte del propietario para Google.
3. En dominios autorizados, añadir `ghostproloco.github.io`. Añadir `localhost` solo si se necesitan pruebas locales.
4. Copiar el objeto público de configuración de esa app web en `firebase-config.js`, sustituyendo `null`.
5. Revisar las plantillas de correo, la política de contraseñas y activar la protección contra enumeración de correos.
6. Probar Google en Safari de iPhone y Chrome/Android. Se utiliza popup para evitar el flujo de redirección entre GitHub Pages y Firebase Hosting, que puede fallar con restricciones de almacenamiento de terceros. La interfaz explica si el navegador bloquea la ventana.
7. Probar creación real de cuenta, correo de verificación, recuperación, cambio de cuenta y cierre de sesión antes de dar el acceso por activado.

La configuración web (`apiKey`, `authDomain`, `projectId`, `appId`) es pública por diseño. No añadir claves de servicio, contraseñas ni OAuth client secrets al repositorio. El SDK se carga del CDN oficial únicamente si hay configuración completa. No se guardan contraseñas en localStorage ni en registros de la app.

## Datos y comportamiento

- `ironquest.state.v1`: progreso existente de invitado; no se migra ni se borra al acceder a una cuenta.
- `ironquest.account.v1.<uid>`: progreso local de cada cuenta, separado de las demás.
- La identidad autenticada siempre procede del SDK, no de un indicador guardado por la aplicación.
- Al cerrar sesión, se vuelve al espacio local del invitado.
- Firebase mantiene la sesión con su persistencia oficial. La app no registra ni reutiliza tokens OAuth de Google.
- El alta usa al menos 8 caracteres y confirmación de contraseña; el proveedor aplica su política adicional.
- Sin configuración se muestra el estado pendiente y los controles de proveedor permanecen desactivados; invitado sigue funcionando.
- El control de acceso no convierte localStorage en una base de datos protegida frente a quien use el mismo dispositivo. Para privacidad en dispositivos compartidos se recomienda exportar y borrar registros locales.

## Siguiente fase

Para guardar y sincronizar entrenamientos entre dispositivos se necesita una base de datos con reglas que aíslen cada UID, validación en servidor y resolución de conflictos. Este cambio no envía historial, peso ni hábitos a Firebase.

## Documentación oficial

- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/auth/web/password-auth
- https://firebase.google.com/docs/auth/web/redirect-best-practices
- https://firebase.google.com/docs/web/alt-setup
