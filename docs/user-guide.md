# 📖 Guía de Usuario — New Life

> Plataforma de Registro y Seguimiento de Esterilización Canina

---

## Índice

1. [Introducción](#introducción)
2. [Primeros pasos](#primeros-pasos)
   - [Registro de cuenta](#1-registro-de-cuenta)
   - [Inicio de sesión](#2-inicio-de-sesión)
3. [Gestión de mascotas](#gestión-de-mascotas)
   - [Registrar una mascota](#1-registrar-una-mascota)
   - [Ver tus mascotas](#2-ver-tus-mascotas)
   - [Editar una mascota](#3-editar-una-mascota)
   - [Eliminar una mascota](#4-eliminar-una-mascota)
4. [Estado de cumplimiento](#estado-de-cumplimiento)
5. [Panel de administración](#panel-de-administración)
6. [Preguntas frecuentes](#preguntas-frecuentes)
7. [Solución de problemas](#solución-de-problemas)

---

## Introducción

**New Life** es una aplicación web diseñada para ayudar a dueños de mascotas y organizaciones a llevar un control del registro canino y el estado de esterilización de cada animal.

Con New Life puedes:

- Crear una cuenta personalizada.
- Registrar tus mascotas con su información básica (nombre, edad, raza).
- Indicar si cada mascota está esterilizada o no.
- Visualizar de un vistazo qué mascotas **cumplen** (🟢) y cuáles **no cumplen** (🔴) con la esterilización.
- Editar o eliminar registros de mascotas.
- Si eres administrador, acceder a un panel global con estadísticas de todo el sistema.

---

## Primeros pasos

### 1. Registro de cuenta

Antes de usar New Life, necesitas crear una cuenta.

1. Abre el archivo [`frontend/index.html`](../frontend/index.html) en tu navegador.
2. Serás redirigido a la pantalla de **Inicio de Sesión**.
3. Haz clic en el enlace **"¿No tienes cuenta? Regístrate"**.
4. Completa el formulario de registro:

   | Campo | Descripción |
   |-------|-------------|
   | **Nombre** | Tu nombre completo (entre 2 y 100 caracteres) |
   | **Email** | Tu correo electrónico (debe ser único en el sistema) |
   | **Contraseña** | Mínimo 6 caracteres |

5. Haz clic en **"Crear Cuenta"**.

![Pantalla de registro](../docs/screenshots/register.png)
<!-- TODO: Agregar captura de pantalla real -->

> ✅ Si el registro es exitoso, serás redirigido automáticamente al Dashboard.

### 2. Inicio de sesión

Si ya tienes una cuenta:

1. En la pantalla de **Inicio de Sesión**, ingresa tu **email** y **contraseña**.
2. Haz clic en **"Iniciar Sesión"**.

![Pantalla de inicio de sesión](../docs/screenshots/login.png)
<!-- TODO: Agregar captura de pantalla real -->

> ✅ Si las credenciales son correctas, accederás a tu Dashboard personal.

---

## Gestión de mascotas

### 1. Registrar una mascota

Desde el Dashboard:

1. Haz clic en el botón **"+ Registrar Mascota"** (esquina superior derecha).
2. Completa el formulario:

   | Campo | Tipo | Obligatorio | Descripción |
   |-------|------|:-----------:|-------------|
   | **Nombre** | Texto | ✅ | Nombre de la mascota |
   | **Edad** | Número | ✅ | Edad en años (≥ 0) |
   | **Raza** | Texto | ✅ | Raza de la mascota |
   | **Esterilizado** | Casilla | ✅ | Marca si la mascota está esterilizada |

3. Haz clic en **"Guardar"**.

![Formulario de registro de mascota](../docs/screenshots/pet-form.png)
<!-- TODO: Agregar captura de pantalla real -->

> ✅ La mascota aparecerá en tu Dashboard inmediatamente después de guardarla.

### 2. Ver tus mascotas

El **Dashboard** muestra todas tus mascotas en forma de tarjetas (cards). Cada tarjeta incluye:

- **Nombre** de la mascota.
- **Edad** en años.
- **Raza**.
- **Estado de cumplimiento** (🟢 Cumple / 🔴 No cumple).
- Botones **"Editar"** y **"Eliminar"**.

![Dashboard con lista de mascotas](../docs/screenshots/dashboard.png)
<!-- TODO: Agregar captura de pantalla real -->

Si aún no tienes mascotas registradas, verás un mensaje de estado vacío con un botón para registrar tu primera mascota.

### 3. Editar una mascota

1. Desde el Dashboard, haz clic en **"Editar"** en la tarjeta de la mascota que deseas modificar.
2. El formulario se cargará con los datos actuales de la mascota.
3. Modifica los campos que necesites (puedes cambiar uno o varios).
4. Haz clic en **"Guardar cambios"**.

> 💡 **Tip:** Si solo necesitas actualizar el estado de esterilización, puedes marcar o desmarcar la casilla "Esterilizado" y guardar.

### 4. Eliminar una mascota

1. Desde el Dashboard, haz clic en **"Eliminar"** en la tarjeta de la mascota.
2. Aparecerá un cuadro de confirmación: `¿Estás seguro de eliminar a "[nombre]"?`
3. Haz clic en **"Aceptar"** para confirmar o **"Cancelar"** para volver atrás.

> ⚠️ **Advertencia:** Esta acción no se puede deshacer. La mascota será eliminada permanentemente.

---

## Estado de cumplimiento

Cada mascota tiene un indicador visual que muestra si cumple o no con la esterilización:

| Indicador | Significado | Descripción |
|:---------:|-------------|-------------|
| 🟢 **Cumple** | ✅ Esterilizado | La mascota está esterilizada (`is_spayed = true`) |
| 🔴 **No cumple** | ❌ No esterilizado | La mascota **no** está esterilizada (`is_spayed = false`) |

Este indicador se calcula automáticamente en el backend según el valor del campo `is_spayed` de cada mascota.

> **¿Por qué es importante?** La esterilización canina ayuda a controlar la población de animales callejeros, previene enfermedades y mejora la calidad de vida de las mascotas. New Life te ayuda a hacer seguimiento de este importante aspecto.

---

## Panel de administración

El **Panel de Administración** es una vista exclusiva para usuarios con rol `admin`. Proporciona una visión global del sistema.

### Acceder al panel

1. Inicia sesión con una cuenta que tenga rol de administrador.
2. Desde el Dashboard, haz clic en el botón **"Panel Admin"** (visible solo para administradores).

### Información disponible

#### Sección de Usuarios

Tabla con todos los usuarios registrados:

| Columna | Descripción |
|---------|-------------|
| **ID** | Identificador único del usuario |
| **Nombre** | Nombre completo |
| **Email** | Correo electrónico |
| **Rol** | `👤 Usuario` o `🔑 Admin` |
| **Registro** | Fecha de creación de la cuenta |
| **Mascotas** | Cantidad de mascotas registradas |

#### Sección de Mascotas

Tabla con todas las mascotas del sistema:

| Columna | Descripción |
|---------|-------------|
| **ID** | Identificador único de la mascota |
| **Nombre** | Nombre de la mascota |
| **Dueño** | Nombre del usuario dueño |
| **Edad** | Edad en años |
| **Raza** | Raza |
| **Estado** | 🟢 Cumple / 🔴 No cumple |

Además, se muestra la **tasa de cumplimiento** general del sistema, que es el porcentaje de mascotas esterilizadas sobre el total.

![Panel de administración](../docs/screenshots/admin.png)
<!-- TODO: Agregar captura de pantalla real -->

### ¿Cómo obtener una cuenta de administrador?

Consulta la sección [Panel Admin — Crear un usuario administrador](../README.md#crear-un-usuario-administrador) en el README principal.

---

## Preguntas frecuentes

### 1. ¿Puedo registrar más de una mascota?

Sí, no hay límite de mascotas por usuario. Puedes registrar todas las que necesites desde el botón **"+ Registrar Mascota"** en el Dashboard.

### 2. ¿Qué hago si olvidé mi contraseña?

Actualmente, New Life no cuenta con funcionalidad de recuperación de contraseña. Si olvidaste tu contraseña, contacta al administrador del sistema para que restablezca tu cuenta.

### 3. ¿Puedo compartir mi cuenta con otras personas?

No es recomendable. Cada usuario debe tener su propia cuenta para mantener la privacidad de los datos y la integridad del registro de mascotas.

### 4. ¿Los datos se pierden si cierro el navegador?

No. Los datos de tu cuenta y mascotas se almacenan en la base de datos del servidor (SQLite). Al cerrar sesión y volver a iniciar, tus datos seguirán ahí.

Sin embargo, el **token JWT** se almacena en el `localStorage` del navegador. Si cambias de navegador o dispositivo, deberás iniciar sesión nuevamente.

### 5. ¿Puedo usar New Life en mi teléfono móvil?

Sí. El frontend está diseñado con CSS responsive (Grid/Flexbox), por lo que se adapta a diferentes tamaños de pantalla, incluyendo dispositivos móviles.

---

## Solución de problemas

### Error de conexión con el servidor

**Síntoma:** Al intentar iniciar sesión o cargar el dashboard, aparece el mensaje *"Error de conexión con el servidor."*

**Posibles causas y soluciones:**

| Causa | Solución |
|-------|----------|
| El servidor Flask no está corriendo | Ejecuta `python backend/app.py` desde la terminal |
| El servidor está en otro puerto | Verifica que el servidor esté en `localhost:5000` |
| El frontend no puede alcanzar el backend | Asegúrate de que no haya un firewall bloqueando la conexión |

### Sesión expirada

**Síntoma:** Aparece el mensaje *"Sesión expirada. Inicia sesión nuevamente."* y eres redirigido al login.

**Causa:** El token JWT tiene una validez de 24 horas. Al expirar, debes iniciar sesión nuevamente.

**Solución:** Simplemente inicia sesión con tu email y contraseña.

### Error "Acceso denegado"

**Síntoma:** Al intentar acceder al Panel Admin, aparece *"Acceso denegado. Se requieren permisos de administrador."*

**Causa:** Tu cuenta tiene rol `user`, no `admin`.

**Solución:** Solicita a un administrador que te asigne el rol `admin`, o crea un nuevo usuario administrador siguiendo las instrucciones en el README.

### Error al registrar un email duplicado

**Síntoma:** Al registrarte, aparece *"El correo electrónico ya está registrado."*

**Causa:** Ya existe una cuenta con ese email.

**Solución:** Intenta iniciar sesión con ese email. Si no recuerdas la contraseña, contacta al administrador.

### La página no carga correctamente

**Síntoma:** La página se ve en blanco o con estilos rotos.

**Posibles causas y soluciones:**

| Causa | Solución |
|-------|----------|
| Archivos JS no se cargan | Abre la consola del navegador (F12) y verifica errores de carga |
| Ruta incorrecta del frontend | Asegúrate de abrir `frontend/index.html` directamente |
| Caché del navegador | Limpia la caché o abre en modo incógnito |

---

> **Documento:** Guía de Usuario v1.0  
> **Proyecto:** New Life — Plataforma de Registro y Seguimiento de Esterilización Canina  
> **Última actualización:** 2026-05-02
