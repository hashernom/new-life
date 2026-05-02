# 📡 API Reference — New Life

> Documentación detallada de la API REST del sistema New Life.  
> **Base URL:** `http://localhost:5000`  
> **Formato:** JSON (`Content-Type: application/json`)

---

## Índice

1. [Convenciones generales](#convenciones-generales)
2. [Autenticación](#-autenticación)
   - [`POST /api/auth/register`](#1-post-apiauthregister)
   - [`POST /api/auth/login`](#2-post-apiauthlogin)
   - [`GET /api/auth/me`](#3-get-apiauthme)
3. [Mascotas](#-mascotas)
   - [`GET /api/pets`](#4-get-apipets)
   - [`POST /api/pets`](#5-post-apipets)
   - [`GET /api/pets/<id>`](#6-get-apipetsid)
   - [`PUT /api/pets/<id>`](#7-put-apipetsid)
   - [`DELETE /api/pets/<id>`](#8-delete-apipetsid)
4. [Administración](#-administración)
   - [`GET /api/admin/users`](#9-get-apiadminusers)
   - [`GET /api/admin/pets`](#10-get-apiadminpets)
5. [Códigos de error](#códigos-de-error)

---

## Convenciones generales

### Headers comunes

| Header | Valor | Obligatorio |
|--------|-------|:-----------:|
| `Content-Type` | `application/json` | ✅ Sí |
| `Authorization` | `Bearer <token_jwt>` | Depende del endpoint |

### Formato de respuesta exitosa

```json
{
  "message": "Operación exitosa",
  "data": { ... }
}
```

### Formato de respuesta de error

```json
{
  "error": "Descripción del error"
}
```

### Autenticación

Los endpoints marcados como **"JWT"** requieren el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Los endpoints marcados como **"Admin"** requieren además que el usuario tenga el rol `admin`.

---

## 🔐 Autenticación

### 1. `POST /api/auth/register`

Registra un nuevo usuario en el sistema.

#### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |

#### Autenticación

❌ **No requiere**

#### Request body

| Campo | Tipo | Obligatorio | Validación |
|-------|------|:-----------:|------------|
| `name` | `string` | ✅ | 2–100 caracteres |
| `email` | `string` | ✅ | Formato email válido, único en BD |
| `password` | `string` | ✅ | Mínimo 6 caracteres |

**Ejemplo:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "secreto123"
}
```

#### Response exitoso — `201 Created`

```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user",
    "created_at": "2026-05-02T10:00:00+00:00"
  }
}
```

#### Responses de error

| Código | Causa | Ejemplo |
|:------:|-------|---------|
| `400` | Cuerpo vacío | `{ "error": "El cuerpo de la solicitud no puede estar vacío." }` |
| `400` | Nombre inválido | `{ "error": "El nombre debe tener entre 2 y 100 caracteres." }` |
| `400` | Email inválido | `{ "error": "El formato del correo electrónico no es válido." }` |
| `400` | Contraseña corta | `{ "error": "La contraseña debe tener al menos 6 caracteres." }` |
| `400` | Email duplicado | `{ "error": "El correo electrónico ya está registrado." }` |

---

### 2. `POST /api/auth/login`

Inicia sesión y retorna un token JWT.

#### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |

#### Autenticación

❌ **No requiere**

#### Request body

| Campo | Tipo | Obligatorio |
|-------|------|:-----------:|
| `email` | `string` | ✅ |
| `password` | `string` | ✅ |

**Ejemplo:**

```json
{
  "email": "juan@example.com",
  "password": "secreto123"
}
```

#### Response exitoso — `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user",
    "created_at": "2026-05-02T10:00:00+00:00"
  }
}
```

> El token JWT expira en **24 horas** por defecto (configurable mediante `JWT_EXPIRATION_HOURS`).

#### Responses de error

| Código | Causa | Ejemplo |
|:------:|-------|---------|
| `400` | Cuerpo vacío | `{ "error": "El cuerpo de la solicitud no puede estar vacío." }` |
| `400` | Email faltante | `{ "error": "El correo electrónico es obligatorio." }` |
| `400` | Contraseña faltante | `{ "error": "La contraseña es obligatoria." }` |
| `401` | Credenciales inválidas | `{ "error": "Credenciales inválidas." }` |

---

### 3. `GET /api/auth/me`

Obtiene los datos del usuario autenticado.

#### Headers

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer <token>` |

#### Autenticación

✅ **JWT requerido**

#### Request body

Ninguno.

#### Response exitoso — `200 OK`

```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": "user",
  "created_at": "2026-05-02T10:00:00+00:00"
}
```

#### Responses de error

| Código | Causa | Ejemplo |
|:------:|-------|---------|
| `401` | Token no enviado | `{ "error": "Token de autenticación requerido" }` |
| `401` | Token inválido/expirado | `{ "error": "Token inválido o expirado" }` |
| `401` | Usuario no encontrado | `{ "error": "Usuario no encontrado" }` |

---

## 🐕 Mascotas

### 4. `GET /api/pets`

Lista todas las mascotas del usuario autenticado.

#### Headers

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer <token>` |

#### Autenticación

✅ **JWT requerido**

#### Request body

Ninguno.

#### Response exitoso — `200 OK`

```json
{
  "pets": [
    {
      "id": 1,
      "name": "Firulais",
      "age": 3,
      "breed": "Labrador",
      "is_spayed": true,
      "compliance_status": "Cumple",
      "created_at": "2026-05-01T10:00:00+00:00",
      "updated_at": "2026-05-01T10:00:00+00:00"
    },
    {
      "id": 2,
      "name": "Luna",
      "age": 1,
      "breed": "Poodle",
      "is_spayed": false,
      "compliance_status": "No cumple",
      "created_at": "2026-05-01T11:00:00+00:00",
      "updated_at": "2026-05-01T11:00:00+00:00"
    }
  ],
  "total": 2
}
```

#### Responses de error

| Código | Causa | Ejemplo |
|:------:|-------|---------|
| `401` | Token no enviado | `{ "error": "Token de autenticación requerido" }` |
| `401` | Token inválido/expirado | `{ "error": "Token inválido o expirado" }` |

---

### 5. `POST /api/pets`

Registra una nueva mascota para el usuario autenticado.

#### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |
| `Authorization` | `Bearer <token>` |

#### Autenticación

✅ **JWT requerido**

#### Request body

| Campo | Tipo | Obligatorio | Validación |
|-------|------|:-----------:|------------|
| `name` | `string` | ✅ | 1–100 caracteres |
| `age` | `integer` | ✅ | ≥ 0 |
| `breed` | `string` | ✅ | 1–100 caracteres |
| `is_spayed` | `boolean` | ✅ | `true` o `false` |

**Ejemplo:**

```json
{
  "name": "Firulais",
  "age": 3,
  "breed": "Labrador",
  "is_spayed": false
}
```

#### Response exitoso — `201 Created`

```json
{
  "message": "Mascota registrada exitosamente",
  "pet": {
    "id": 1,
    "name": "Firulais",
    "age": 3,
    "breed": "Labrador",
    "is_spayed": false,
    "compliance_status": "No cumple",
    "created_at": "2026-05-02T12:00:00+00:00",
    "updated_at": "2026-05-02T12:00:00+00:00"
  }
}
```

#### Responses de error

| Código | Causa | Ejemplo |
|:------:|-------|---------|
| `400` | Cuerpo vacío | `{ "error": "El cuerpo de la solicitud no puede estar vacío." }` |
| `400` | Nombre faltante | `{ "error": "El nombre de la mascota es obligatorio." }` |
| `400` | Edad inválida | `{ "error": "La edad debe ser un número entero mayor o igual a 0." }` |
| `400` | Raza faltante | `{ "error": "La raza es obligatoria." }` |
| `400` | `is_spayed` inválido | `{ "error": "El campo is_spayed debe ser un booleano (true o false)." }` |
| `401` | Token inválido/expirado | `{ "error": "Token inválido o expirado" }` |

---

### 6. `GET /api/pets/<id>`

Obtiene los detalles de una mascota específica del usuario autenticado.

#### Headers

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer <token>` |

#### Autenticación

✅ **JWT requerido**

#### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `integer` | ID de la mascota |

#### Request body

Ninguno.

#### Response exitoso — `200 OK`

```json
{
  "id": 1,
  "name": "Firulais",
  "age": 3,
  "breed": "Labrador",
  "is_spayed": false,
  "compliance_status": "No cumple",
  "created_at": "2026-05-01T10:00:00+00:00",
  "updated_at": "2026-05-01T10:00:00+00:00"
}
```

#### Responses de error

| Código | Causa | Ejemplo |
|:------:|-------|---------|
| `401` | Token inválido/expirado | `{ "error": "Token inválido o expirado" }` |
| `403` | No pertenece al usuario | `{ "error": "No tienes permiso para acceder a esta mascota." }` |
| `404` | No existe | `{ "error": "Mascota no encontrada" }` |

---

### 7. `PUT /api/pets/<id>`

Actualiza los datos de una mascota. Soporta actualización parcial (solo los campos enviados).

#### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |
| `Authorization` | `Bearer <token>` |

#### Autenticación

✅ **JWT requerido**

#### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `integer` | ID de la mascota a actualizar |

#### Request body (al menos un campo)

| Campo | Tipo | Obligatorio | Validación |
|-------|------|:-----------:|------------|
| `name` | `string` | ❌ | 1–100 caracteres |
| `age` | `integer` | ❌ | ≥ 0 |
| `breed` | `string` | ❌ | 1–100 caracteres |
| `is_spayed` | `boolean` | ❌ | `true` o `false` |

**Ejemplo (actualizar solo esterilización):**

```json
{
  "is_spayed": true
}
```

**Ejemplo (actualizar múltiples campos):**

```json
{
  "name": "Firulais Jr.",
  "age": 4,
  "is_spayed": true
}
```

#### Response exitoso — `200 OK`

```json
{
  "message": "Mascota actualizada exitosamente",
  "pet": {
    "id": 1,
    "name": "Firulais",
    "age": 3,
    "breed": "Labrador",
    "is_spayed": true,
    "compliance_status": "Cumple",
    "created_at": "2026-05-01T10:00:00+00:00",
    "updated_at": "2026-05-02T14:00:00+00:00"
  }
}
```

#### Responses de error

| Código | Causa | Ejemplo |
|:------:|-------|---------|
| `400` | Sin campos válidos | `{ "error": "No se proporcionaron campos válidos para actualizar." }` |
| `400` | Nombre vacío | `{ "error": "El nombre no puede estar vacío." }` |
| `400` | Edad inválida | `{ "error": "La edad debe ser un número entero mayor o igual a 0." }` |
| `401` | Token inválido/expirado | `{ "error": "Token inválido o expirado" }` |
| `403` | No pertenece al usuario | `{ "error": "No tienes permiso para modificar esta mascota." }` |
| `404` | No existe | `{ "error": "Mascota no encontrada" }` |

---

### 8. `DELETE /api/pets/<id>`

Elimina una mascota del usuario autenticado.

#### Headers

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer <token>` |

#### Autenticación

✅ **JWT requerido**

#### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `integer` | ID de la mascota a eliminar |

#### Request body

Ninguno.

#### Response exitoso — `200 OK`

```json
{
  "message": "Mascota eliminada exitosamente"
}
```

#### Responses de error

| Código | Causa | Ejemplo |
|:------:|-------|---------|
| `401` | Token inválido/expirado | `{ "error": "Token inválido o expirado" }` |
| `403` | No pertenece al usuario | `{ "error": "No tienes permiso para eliminar esta mascota." }` |
| `404` | No existe | `{ "error": "Mascota no encontrada" }` |

---

## 🔧 Administración

### 9. `GET /api/admin/users`

Lista todos los usuarios del sistema con su cantidad de mascotas. Solo accesible para administradores.

#### Headers

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer <token>` |

#### Autenticación

✅ **JWT requerido + rol `admin`**

#### Request body

Ninguno.

#### Response exitoso — `200 OK`

```json
{
  "users": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "created_at": "2026-05-01T10:00:00+00:00",
      "pet_count": 2
    },
    {
      "id": 2,
      "name": "Admin",
      "email": "admin@newlife.com",
      "role": "admin",
      "created_at": "2026-04-30T08:00:00+00:00",
      "pet_count": 0
    }
  ],
  "total": 2
}
```

#### Responses de error

| Código | Causa | Ejemplo |
|:------:|-------|---------|
| `401` | Token no enviado | `{ "error": "Token de autenticación requerido" }` |
| `401` | Token inválido/expirado | `{ "error": "Token inválido o expirado" }` |
| `403` | No es admin | `{ "error": "Acceso denegado. Se requiere rol de administrador" }` |

---

### 10. `GET /api/admin/pets`

Lista todas las mascotas del sistema con datos del dueño y tasa de cumplimiento. Solo accesible para administradores.

#### Headers

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer <token>` |

#### Autenticación

✅ **JWT requerido + rol `admin`**

#### Request body

Ninguno.

#### Response exitoso — `200 OK`

```json
{
  "pets": [
    {
      "id": 1,
      "name": "Firulais",
      "age": 3,
      "breed": "Labrador",
      "is_spayed": true,
      "compliance_status": "Cumple",
      "owner_name": "Juan Pérez",
      "created_at": "2026-05-01T10:00:00+00:00",
      "updated_at": "2026-05-01T10:00:00+00:00"
    },
    {
      "id": 2,
      "name": "Luna",
      "age": 1,
      "breed": "Poodle",
      "is_spayed": false,
      "compliance_status": "No cumple",
      "owner_name": "María García",
      "created_at": "2026-05-01T11:00:00+00:00",
      "updated_at": "2026-05-01T11:00:00+00:00"
    }
  ],
  "total": 2,
  "compliance_rate": 50.0
}
```

> El campo `compliance_rate` representa el porcentaje de mascotas esterilizadas sobre el total.

#### Responses de error

| Código | Causa | Ejemplo |
|:------:|-------|---------|
| `401` | Token no enviado | `{ "error": "Token de autenticación requerido" }` |
| `401` | Token inválido/expirado | `{ "error": "Token inválido o expirado" }` |
| `403` | No es admin | `{ "error": "Acceso denegado. Se requiere rol de administrador" }` |

---

## Códigos de error

| Código | Significado |
|:------:|-------------|
| `200` | OK — La solicitud se completó exitosamente |
| `201` | Created — El recurso fue creado exitosamente |
| `400` | Bad Request — Error de validación en los datos enviados |
| `401` | Unauthorized — Token JWT faltante, inválido o expirado |
| `403` | Forbidden — El usuario no tiene permisos para el recurso |
| `404` | Not Found — El recurso solicitado no existe |

---

## Resumen de endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|:----:|-------------|
| `POST` | `/api/auth/register` | ❌ | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | ❌ | Iniciar sesión |
| `GET` | `/api/auth/me` | ✅ JWT | Perfil del usuario |
| `GET` | `/api/pets` | ✅ JWT | Listar mascotas propias |
| `POST` | `/api/pets` | ✅ JWT | Crear mascota |
| `GET` | `/api/pets/<id>` | ✅ JWT | Detalle de mascota |
| `PUT` | `/api/pets/<id>` | ✅ JWT | Actualizar mascota |
| `DELETE` | `/api/pets/<id>` | ✅ JWT | Eliminar mascota |
| `GET` | `/api/admin/users` | ✅ Admin | Listar usuarios (admin) |
| `GET` | `/api/admin/pets` | ✅ Admin | Listar mascotas (admin) |

---

> **Documento:** API Reference v1.0  
> **Proyecto:** New Life — Plataforma de Registro y Seguimiento de Esterilización Canina  
> **Última actualización:** 2026-05-02
