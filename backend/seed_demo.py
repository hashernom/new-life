"""Script de migracion y seed de datos demo para el panel de administracion.

Agrega las columnas faltantes (status, adopted) a la tabla pet,
crea los 6 usuarios demo con sus respectivas mascotas,
y actualiza el admin existente con datos completos.

Las fechas de creacion se asignan de forma realista para que
la logica de estados (certificado/gracia/incumplimiento) se
refleje correctamente segun el tiempo transcurrido.
"""

import sqlite3
import os
from datetime import datetime, timezone, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "instance", "newlife.db")


def migrate_and_seed():
    """Ejecuta la migracion de esquema y la insercion de datos demo."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # --- 1. Migrar esquema: agregar columnas faltantes ---
    cursor.execute("PRAGMA table_info(pet)")
    existing_cols = {row[1] for row in cursor.fetchall()}

    if "status" not in existing_cols:
        cursor.execute(
            'ALTER TABLE pet ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT "certificado"'
        )
        print("[OK] Columna status agregada a pet")
    else:
        print("[i] Columna status ya existe")

    if "adopted" not in existing_cols:
        cursor.execute(
            "ALTER TABLE pet ADD COLUMN adopted BOOLEAN NOT NULL DEFAULT 1"
        )
        print("[OK] Columna adopted agregada a pet")
    else:
        print("[i] Columna adopted ya existe")

    conn.commit()

    # --- 2. Verificar usuarios existentes ---
    cursor.execute('SELECT id, email, role FROM "user"')
    existing_users = {row["email"]: dict(row) for row in cursor.fetchall()}
    print(f"\n[*] Usuarios existentes: {len(existing_users)}")

    # --- 3. Crear usuarios demo (si no existen) ---
    demo_users = [
        {
            "name": "Carlos Mendoza",
            "email": "carlos.m@email.com",
            "password": "Demo123!",
            "role": "user",
        },
        {
            "name": "Maria Garcia",
            "email": "maria.g@email.com",
            "password": "Demo123!",
            "role": "user",
        },
        {
            "name": "Andres Perez",
            "email": "andres.p@email.com",
            "password": "Demo123!",
            "role": "user",
        },
        {
            "name": "Laura Jimenez",
            "email": "laura.j@email.com",
            "password": "Demo123!",
            "role": "user",
        },
        {
            "name": "Jorge Ramirez",
            "email": "jorge.r@email.com",
            "password": "Demo123!",
            "role": "user",
        },
        {
            "name": "Diana Torres",
            "email": "diana.t@email.com",
            "password": "Demo123!",
            "role": "user",
        },
    ]

    # Necesitamos generar password hashes - usamos werkzeug
    from werkzeug.security import generate_password_hash

    user_ids = {}
    for u in demo_users:
        if u["email"] in existing_users:
            print(f"[*] Usuario ya existe: {u['email']}")
            user_ids[u["email"]] = existing_users[u["email"]]["id"]
        else:
            now = datetime.now(timezone.utc).isoformat()
            cursor.execute(
                'INSERT INTO "user" (name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
                (
                    u["name"],
                    u["email"],
                    generate_password_hash(u["password"]),
                    u["role"],
                    now,
                    now,
                ),
            )
            user_ids[u["email"]] = cursor.lastrowid
            print(f"[OK] Usuario creado: {u['email']}")

    conn.commit()

    # --- 4. Crear mascotas demo con fechas realistas ---
    # Logica de fechas:
    #   - Certificado (verde): is_spayed=True, fecha reciente (hace 1 mes)
    #   - Gracia (naranja): is_spayed=False, fecha dentro de los ultimos 6 meses (hace 3 meses)
    #   - Incumplimiento (rojo): is_spayed=False, fecha hace mas de 6 meses (hace 10 meses)
    now = datetime.now(timezone.utc)

    demo_pets = [
        {
            "owner_email": "carlos.m@email.com",
            "name": "Luna",
            "age": 3,
            "breed": "Labrador",
            "is_spayed": True,
            "status": "certificado",
            "adopted": True,
            "created_at": now - timedelta(days=30),  # ~1 mes atras
        },
        {
            "owner_email": "maria.g@email.com",
            "name": "Toby",
            "age": 1,
            "breed": "Criollo",
            "is_spayed": True,
            "status": "certificado",
            "adopted": True,
            "created_at": now - timedelta(days=15),  # ~15 dias atras
        },
        {
            "owner_email": "andres.p@email.com",
            "name": "Rocky",
            "age": 2,
            "breed": "Pastor Aleman",
            "is_spayed": False,
            "status": "gracia",
            "adopted": True,
            "created_at": now - timedelta(days=90),  # ~3 meses atras (dentro de los 6 meses)
        },
        {
            "owner_email": "laura.j@email.com",
            "name": "Mila",
            "age": 4,
            "breed": "Poodle",
            "is_spayed": False,
            "status": "gracia",
            "adopted": True,
            "created_at": now - timedelta(days=150),  # ~5 meses atras (casi vence)
        },
        {
            "owner_email": "jorge.r@email.com",
            "name": "Max",
            "age": 5,
            "breed": "Bulldog",
            "is_spayed": False,
            "status": "incumplimiento",
            "adopted": True,
            "created_at": now - timedelta(days=300),  # ~10 meses atras (mas de 6 meses)
        },
        {
            "owner_email": "diana.t@email.com",
            "name": "Bella",
            "age": 2,
            "breed": "Golden Retriever",
            "is_spayed": False,
            "status": "incumplimiento",
            "adopted": True,
            "created_at": now - timedelta(days=365),  # ~1 ano atras
        },
    ]

    # Limpiar mascotas existentes para evitar duplicados
    cursor.execute("DELETE FROM pet WHERE owner_id IN (SELECT id FROM \"user\" WHERE email IN (?, ?, ?, ?, ?, ?))",
                   [u["email"] for u in demo_users])
    print("[*] Mascotas previas eliminadas para usuarios demo")

    for p in demo_pets:
        owner_id = user_ids[p["owner_email"]]
        created_at_iso = p["created_at"].isoformat()
        updated_at_iso = now.isoformat()
        cursor.execute(
            "INSERT INTO pet (owner_id, name, age, breed, is_spayed, status, adopted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (owner_id, p["name"], p["age"], p["breed"], p["is_spayed"], p["status"], p["adopted"], created_at_iso, updated_at_iso),
        )
        print(f"[OK] Mascota creada: {p['name']} (dueno: {p['owner_email']}, estado: {p['status']}, creada: {p['created_at'].strftime('%Y-%m-%d')})")

    conn.commit()

    # --- 5. Verificar resultados ---
    cursor.execute("SELECT COUNT(*) FROM \"user\"")
    total_users = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM pet")
    total_pets = cursor.fetchone()[0]
    print(f"\n[*] Resumen final:")
    print(f"   Usuarios totales: {total_users}")
    print(f"   Mascotas totales: {total_pets}")

    conn.close()
    print("\n[OK] Migracion y seed completados exitosamente.")


if __name__ == "__main__":
    migrate_and_seed()
