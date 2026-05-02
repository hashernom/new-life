# 🐾 New Life — Plataforma de Registro y Seguimiento de Esterilización Canina

> **MVP** — Versión 1.0  
> Sistema web para el registro de mascotas y control del estado de esterilización canina.

![Captura de pantalla](docs/screenshots/dashboard.png)
<!-- TODO: Agregar captura de pantalla real del dashboard -->

---

## 📋 Características principales

| # | Funcionalidad | Descripción |
|---|--------------|-------------|
| 1 | **Registro de usuarios** | Creación de cuenta con nombre, email y contraseña |
| 2 | **Inicio de sesión seguro** | Autenticación mediante tokens JWT con expiración de 24 h |
| 3 | **Dashboard personal** | Vista de todas las mascotas del usuario con indicadores de cumplimiento |
| 4 | **Registro de mascotas** | Formulario para agregar mascotas con nombre, edad, raza y estado de esterilización |
| 5 | **Edición de mascotas** | Actualización parcial de datos de una mascota existente |
| 6 | **Eliminación de mascotas** | Borrado con confirmación previa |
| 7 | **Panel de administración** | Vista global de usuarios y mascotas con tasa de cumplimiento general |

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| **Backend** | Python 3.8+ · [Flask](https://flask.palletsprojects.com/) 3.1 |
| **Base de datos** | [SQLite](https://www.sqlite.org/) |
| **ORM** | [SQLAlchemy](https://www.sqlalchemy.org/) + Flask-SQLAlchemy |
| **Autenticación** | [JWT](https://jwt.io/) (PyJWT) con algoritmo HS256 |
| **Frontend** | HTML5 · CSS3 · JavaScript vanilla (SPA) |
| **Estilos** | CSS Grid / Flexbox (responsive) |

---

## 📁 Estructura del proyecto

```
new-life/
│
├── backend/                        # API REST (Flask)
│   ├── app.py                      # Punto de entrada
│   ├── config.py                   # Configuración (SECRET_KEY, DB URI)
│   ├── extensions.py               # Extensiones (SQLAlchemy, CORS)
│   ├── requirements.txt            # Dependencias Python
│   │
│   ├── models/                     # Modelos de datos
│   │   ├── user.py                 #   Usuario
│   │   └── pet.py                  #   Mascota
│   │
│   ├── schemas/                    # Validación de datos
│   │   ├── user_schema.py          #   Esquemas de usuario
│   │   └── pet_schema.py           #   Esquemas de mascota
│   │
│   ├── crud/                       # Acceso a base de datos
│   │   ├── user_crud.py            #   Operaciones de usuario
│   │   └── pet_crud.py             #   Operaciones de mascota
│   │
│   ├── services/                   # Lógica de negocio
│   │   ├── auth_service.py         #   Autenticación y JWT
│   │   └── pet_service.py          #   Gestión de mascotas
│   │
│   ├── routes/                     # Endpoints de la API
│   │   ├── auth_routes.py          #   /api/auth/*
│   │   ├── pet_routes.py           #   /api/pets/*
│   │   └── admin_routes.py         #   /api/admin/*
│   │
│   └── utils/                      # Utilidades
│       ├── jwt_utils.py            #   Creación/verificación de JWT
│       └── decorators.py           #   @jwt_required, @admin_required
│
├── frontend/                       # SPA (HTML + CSS + JS)
│   ├── index.html                  # Punto de entrada
│   ├── css/
│   │   └── style.css               # Estilos globales
│   ├── js/
│   │   ├── app.js                  # Router SPA
│   │   ├── api.js                  # Cliente HTTP (fetch + JWT)
│   │   ├── auth.js                 # Gestión de autenticación
│   │   ├── utils.js                # Utilidades
│   │   └── components/
│   │       ├── login.js            #   Vista de inicio de sesión
│   │       ├── register.js         #   Vista de registro
│   │       ├── dashboard.js        #   Dashboard del usuario
│   │       ├── pet-form.js         #   Formulario de mascota
│   │       └── admin.js            #   Panel de administración
│   └── assets/                     # Recursos estáticos
│
├── docs/
│   ├── architecture.md             # Documento de arquitectura
│   ├── api-reference.md            # Referencia de la API
│   └── user-guide.md               # Guía de usuario
│
├── instance/
│   └── newlife.db                  # Base de datos SQLite
│
└── README.md                       # Este documento
```

---

## ✅ Requisitos previos

- **Python** 3.8 o superior
- **pip** (gestor de paquetes de Python)
- **Navegador web** moderno (Chrome, Firefox, Edge)

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/new-life.git
cd new-life
```

### 2. Crear un entorno virtual

```bash
python -m venv venv
```

### 3. Activar el entorno virtual

**Windows (cmd/PowerShell):**

```bash
venv\Scripts\activate
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

### 4. Instalar dependencias

```bash
pip install -r backend/requirements.txt
```

### 5. Iniciar el servidor backend

```bash
cd backend
python app.py
```

El servidor se iniciará en `http://localhost:5000`.

### 6. Abrir el frontend

Abre el archivo [`frontend/index.html`](frontend/index.html) en tu navegador Chrome (o cualquier navegador moderno).

> **Nota:** El frontend debe servirse desde un servidor HTTP o abrirse directamente desde el sistema de archivos. Para desarrollo, abrir el archivo HTML directamente funciona con la mayoría de navegadores.

---

## 📖 Uso — Guía paso a paso

### Flujo completo del usuario

1. **Registro** — Crea una cuenta en la pantalla de registro (`#register`).
2. **Inicio de sesión** — Ingresa con tu email y contraseña (`#login`).
3. **Dashboard** — Visualiza tus mascotas registradas (`#dashboard`).
4. **Crear mascota** — Haz clic en "+ Registrar Mascota" y completa el formulario (`#pet/new`).
5. **Editar mascota** — Desde el dashboard, haz clic en "Editar" en la tarjeta de la mascota (`#pet/edit/<id>`).
6. **Eliminar mascota** — Desde el dashboard, haz clic en "Eliminar" y confirma la acción.
7. **Panel Admin** — Si tienes rol de administrador, accede al panel desde el botón "Panel Admin" en el dashboard (`#admin`).

---

## 📡 API Reference

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|:-------------:|
| `POST` | `/api/auth/register` | Registrar un nuevo usuario | ❌ No |
| `POST` | `/api/auth/login` | Iniciar sesión y obtener JWT | ❌ No |
| `GET` | `/api/auth/me` | Obtener datos del usuario autenticado | ✅ JWT |
| `GET` | `/api/pets` | Listar mascotas del usuario | ✅ JWT |
| `POST` | `/api/pets` | Registrar una nueva mascota | ✅ JWT |
| `GET` | `/api/pets/<id>` | Obtener detalle de una mascota | ✅ JWT |
| `PUT` | `/api/pets/<id>` | Actualizar datos de una mascota | ✅ JWT |
| `DELETE` | `/api/pets/<id>` | Eliminar una mascota | ✅ JWT |
| `GET` | `/api/admin/users` | Listar todos los usuarios (admin) | ✅ Admin |
| `GET` | `/api/admin/pets` | Listar todas las mascotas (admin) | ✅ Admin |

Para más detalles, consulta la [Referencia completa de la API](docs/api-reference.md).

---

## 🔧 Panel de Administración

El panel de administración permite visualizar:

- **Usuarios del sistema**: ID, nombre, email, rol, fecha de registro y cantidad de mascotas.
- **Mascotas del sistema**: ID, nombre, dueño, edad, raza y estado de cumplimiento.
- **Tasa de cumplimiento**: Porcentaje de mascotas esterilizadas respecto al total.

### Crear un usuario administrador

Para acceder al panel de administración, necesitas un usuario con rol `admin`. Puedes crearlo de dos formas:

#### Opción 1: Desde la consola interactiva de Flask

```bash
cd backend
python
```

```python
from app import create_app
from extensions import db
from models.user import User

app = create_app()
with app.app_context():
    admin = User(
        name="Admin",
        email="admin@newlife.com",
        role="admin"
    )
    admin.set_password("admin123")
    db.session.add(admin)
    db.session.commit()
    print("Usuario admin creado exitosamente")
```

#### Opción 2: Script directo en la base de datos

```bash
cd backend
python -c "
from app import create_app
from extensions import db
from models.user import User

app = create_app()
with app.app_context():
    admin = User(name='Admin', email='admin@newlife.com', role='admin')
    admin.set_password('admin123')
    db.session.add(admin)
    db.session.commit()
    print('Admin creado: admin@newlife.com / admin123')
"
```

> **Credenciales por defecto:** `admin@newlife.com` / `admin123`

---

## 📸 Capturas de pantalla

<!-- TODO: Agregar capturas de pantalla reales -->

| Pantalla | Descripción |
|----------|-------------|
| `docs/screenshots/login.png` | Pantalla de inicio de sesión |
| `docs/screenshots/register.png` | Pantalla de registro |
| `docs/screenshots/dashboard.png` | Dashboard con lista de mascotas |
| `docs/screenshots/pet-form.png` | Formulario de registro/edición de mascota |
| `docs/screenshots/admin.png` | Panel de administración |

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**.

```
MIT License

Copyright (c) 2026 New Life

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 Contribuciones

Este es un proyecto MVP en etapa de prototipo. Las contribuciones son bienvenidas. Por favor, abre un *issue* o *pull request* para sugerir cambios.

---

<p align="center">Hecho con ❤️ para el bienestar canino 🐶</p>
