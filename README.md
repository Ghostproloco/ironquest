# IRONQUEST

**Tu próxima versión empieza hoy.** Primera versión de una app de entrenamiento en español, con diseño adaptable a móvil y ordenador y rangos por constancia.

## Funciones disponibles

- Perfil con alias, objetivo, nivel, material, días y tiempo disponible.
- Generador de sesiones generales de cuerpo completo: gimnasio, mancuernas o peso corporal.
- Registro de series, kilos y repeticiones/segundos; temporizador de descanso y sesión recuperable.
- Ocho rangos: Recluta, Bronce, Plata, Oro, Platino, Diamante, Élite y Leyenda.
- XP al finalizar una sesión (80 + 5 por serie, máximo 180); protección contra duplicar el mismo registro.
- Historial, volumen registrado, actividad semanal y racha de días.
- Registro opcional de peso y vasos de agua.
- Exportación/importación JSON con validación y confirmación antes de reemplazar datos.
- Manifest y service worker para funcionamiento sin conexión tras una primera carga completa. La instalación depende del soporte del navegador; faltan iconos PNG y pruebas de instalación para distribución móvil.

## Ejecutar

Requiere Node.js 20 o superior. No necesita paquetes externos.

```sh
npm test
npm run build
npm start
```

Abrir `http://localhost:4173`. Las fuentes de Google son opcionales: si no hay conexión, usa las fuentes del dispositivo. El resto de la app no depende de recursos externos.

## Estructura

- `src/core.js`: planes, rangos, XP, rachas y validación de copias.
- `app.js`: interfaz y persistencia.
- `style.css`: diseño responsive.
- `tests/core.test.js`: pruebas de las reglas de negocio.
- `.github/workflows/ci.yml`: pruebas y compilación automática en GitHub Actions.

## Datos y alcance

Los entrenamientos, pesos y hábitos se guardan en `localStorage` del navegador, separados por cuenta. Firebase Authentication gestiona las cuentas; todavía no hay sincronización del progreso. Los registros y rangos pueden editarse localmente y no son aptos para competiciones verificadas. El historial de entrenamiento, peso y hábitos no se envía a un backend. Al acceder con cuenta, Firebase y el proveedor elegido procesan los datos necesarios para autenticarte. La carga opcional de fuentes realiza una solicitud a Google Fonts. Las copias JSON incluyen los registros que el usuario haya guardado y se deben custodiar como datos personales.

Las rutinas son plantillas generales, no asesoramiento médico ni planes clínicos. El objetivo cambia el enfoque y los descansos; no hay cálculo de calorías, dieta, progresión automática de cargas ni garantías de resultados. La app no solicita permisos de cámara, ubicación, contactos ni sensores.

## Estado

Código del repositorio público `Ghostproloco/ironquest`. Consulta `ROADMAP.md` para las siguientes fases. No es todavía una aplicación nativa ni un producto listo para publicar en las tiendas.

## Acceso con cuenta

La app incorpora Google/correo, registro, verificación, recuperación y cierre de sesión. Está conectada al proyecto Firebase `ironquest-f628e`, con los proveedores Google y Email/Password habilitados y `ghostproloco.github.io` autorizado. El proyecto usa el plan Spark. Consulta `AUTH_SETUP.md`.

El progreso de cada cuenta continúa guardándose localmente, separado del invitado y de otras cuentas. Iniciar sesión no activa sincronización en la nube. La implementación no escribe contraseñas ni tokens en el almacenamiento gestionado por la app.
