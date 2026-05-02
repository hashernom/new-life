"""Operaciones CRUD para el modelo Pet.

Funciones de acceso a base de datos para mascotas.
Todas las funciones reciben y retornan instancias del modelo Pet.
"""

from typing import List, Optional

from sqlalchemy.orm import joinedload

from backend.extensions import db
from backend.models.pet import Pet


def get_pets_by_owner(owner_id: int) -> List[Pet]:
    """Obtiene todas las mascotas de un usuario.

    Args:
        owner_id: ID del usuario dueño.

    Returns:
        Lista de instancias de Pet.
    """
    return (
        Pet.query
        .options(joinedload(Pet.owner))
        .filter_by(owner_id=owner_id)
        .order_by(Pet.created_at.desc())
        .all()
    )


def get_pet_by_id(pet_id: int) -> Optional[Pet]:
    """Obtiene una mascota por su ID.

    Args:
        pet_id: ID de la mascota.

    Returns:
        Instancia de Pet o None si no existe.

    Nota:
        Se usa session.get() en lugar de Query.get() que está
        deprecado en SQLAlchemy 2.0 (legacy Query API).
    """
    return (
        db.session.get(Pet, pet_id)
    )


def create_pet(owner_id: int, name: str, age: int, breed: str, is_spayed: bool) -> Pet:
    """Crea una nueva mascota en la base de datos.

    Args:
        owner_id: ID del usuario dueño.
        name: Nombre de la mascota.
        age: Edad en años.
        breed: Raza.
        is_spayed: Estado de esterilización.

    Returns:
        Instancia de Pet creada.
    """
    pet = Pet(
        owner_id=owner_id,
        name=name,
        age=age,
        breed=breed,
        is_spayed=is_spayed,
    )
    db.session.add(pet)
    db.session.commit()
    return pet


def update_pet(pet: Pet, data: dict) -> Pet:
    """Actualiza los campos de una mascota existente.

    Solo actualiza los campos presentes en el diccionario data.

    Args:
        pet: Instancia de Pet a actualizar.
        data: Diccionario con campos a actualizar.

    Returns:
        Instancia de Pet actualizada.
    """
    for field, value in data.items():
        if hasattr(pet, field):
            setattr(pet, field, value)
    db.session.commit()
    return pet


def delete_pet(pet: Pet) -> None:
    """Elimina una mascota de la base de datos.

    Args:
        pet: Instancia de Pet a eliminar.
    """
    db.session.delete(pet)
    db.session.commit()


def get_all_pets_with_owners() -> List[Pet]:
    """Obtiene todas las mascotas con datos del dueño.

    Utiliza joinedload para evitar N+1 al acceder a pet.owner.

    Returns:
        Lista de instancias de Pet con la relación owner precargada.
    """
    return (
        Pet.query
        .options(joinedload(Pet.owner))
        .order_by(Pet.created_at.desc())
        .all()
    )
