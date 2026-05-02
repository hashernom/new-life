"""Operaciones CRUD para el modelo User.

Funciones de acceso a base de datos para usuarios.
Todas las funciones reciben y retornan instancias del modelo User.
"""

from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import load_only

from backend.extensions import db
from backend.models.pet import Pet
from backend.models.user import User


def get_user_by_id(user_id: int) -> Optional[User]:
    """Obtiene un usuario por su ID.

    Args:
        user_id: ID del usuario.

    Returns:
        Instancia de User o None si no existe.
    """
    return User.query.get(user_id)


def get_user_by_email(email: str) -> Optional[User]:
    """Obtiene un usuario por su correo electrónico.

    Args:
        email: Correo electrónico del usuario.

    Returns:
        Instancia de User o None si no existe.
    """
    return User.query.filter_by(email=email.lower()).first()


def create_user(name: str, email: str, password: str, role: str = "user") -> User:
    """Crea un nuevo usuario en la base de datos.

    Args:
        name: Nombre completo del usuario.
        email: Correo electrónico único.
        password: Contraseña en texto plano (se hashea internamente).
        role: Rol del usuario (default: 'user').

    Returns:
        Instancia de User creada.
    """
    user = User(name=name, email=email.lower(), role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return user


def get_all_users_with_pet_count() -> list[dict]:
    """Obtiene todos los usuarios con la cantidad de mascotas registradas.

    Utiliza una subconsulta para contar mascotas en una sola query,
    evitando el problema N+1 de llamar user.pets.count() por cada usuario.

    Optimización:
    - Imports de sqlalchemy y Pet movidos al tope del módulo (PEP 8).
    - Eliminado joinedload(User.pets) redundante: la subconsulta ya provee
      el conteo, no es necesario cargar la relación pets en memoria.

    Returns:
        Lista de diccionarios con datos del usuario y pet_count.
    """
    # Subconsulta: COUNT de mascotas agrupado por owner_id
    pet_count_subquery = (
        db.session.query(
            Pet.owner_id,
            func.count(Pet.id).label("pet_count"),
        )
        .group_by(Pet.owner_id)
        .subquery()
    )

    users = (
        User.query
        .outerjoin(pet_count_subquery, User.id == pet_count_subquery.c.owner_id)
        .add_columns(pet_count_subquery.c.pet_count)
        .order_by(User.created_at.desc())
        .all()
    )

    result = []
    for user, pet_count in users:
        user_dict = user.to_dict()
        user_dict["pet_count"] = pet_count or 0
        result.append(user_dict)
    return result
