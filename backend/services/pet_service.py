"""Servicio de mascotas.

Contiene la logica de negocio para la gestion de mascotas,
incluyendo validaciones de pertenencia, operaciones CRUD
y calculo automatico del estado de cumplimiento.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple

from backend.crud.pet_crud import (
    create_pet,
    delete_pet,
    get_all_pets_with_owners,
    get_pet_by_id,
    get_pets_by_owner,
    update_pet,
)
from backend.models.pet import Pet
from backend.models.user import User

# --- Constantes de mensajes ---
MSG_PET_NOT_FOUND = "Mascota no encontrada"
MSG_PET_CREATED = "Mascota registrada exitosamente"
MSG_PET_UPDATED = "Mascota actualizada exitosamente"
MSG_PET_DELETED = "Mascota eliminada exitosamente"
MSG_PERMISSION_DENIED_ACCESS = "No tienes permiso para acceder a esta mascota."
MSG_PERMISSION_DENIED_MODIFY = "No tienes permiso para modificar esta mascota."
MSG_PERMISSION_DENIED_DELETE = "No tienes permiso para eliminar esta mascota."

# --- Constantes de negocio ---
GRACIA_PERIOD_DAYS = 180  # 6 meses de periodo de gracia para esterilizacion


def _calculate_status(pet: Pet) -> str:
    """Calcula el estado de cumplimiento segun la logica de la Ley Angel.

    Logica:
        - Si is_spayed es True -> "certificado" (verde).
        - Si is_spayed es False y pasaron <= 180 dias desde created_at -> "gracia" (naranja).
        - Si is_spayed es False y pasaron > 180 dias desde created_at -> "incumplimiento" (rojo).

    Args:
        pet: Instancia de Pet con sus campos actuales.

    Returns:
        String con el estado calculado: "certificado", "gracia" o "incumplimiento".
    """
    if pet.is_spayed:
        return "certificado"

    now = datetime.utcnow()
    created = pet.created_at.replace(tzinfo=None) if pet.created_at.tzinfo else pet.created_at
    days_since_creation = (now - created).days

    if days_since_creation <= GRACIA_PERIOD_DAYS:
        return "gracia"

    return "incumplimiento"


def _get_pet_or_error(pet_id: int) -> Tuple[Optional[Pet], Optional[Tuple[dict, int]]]:
    """Obtiene una mascota por ID o retorna una respuesta de error 404.

    Patron: Extraccion de logica repetida (D.R.Y).
    Centraliza la busqueda de mascota y el manejo del caso "no encontrada".

    Args:
        pet_id: ID de la mascota a buscar.

    Returns:
        Tupla (pet, None) si se encuentra, o (None, respuesta_error) si no.
    """
    pet = get_pet_by_id(pet_id)
    if not pet:
        return None, ({"error": MSG_PET_NOT_FOUND}, 404)
    return pet, None


def _verify_ownership(pet: Pet, user: User, error_msg: str) -> Optional[Tuple[dict, int]]:
    """Verifica que la mascota pertenezca al usuario.

    Patron: Guard Clause. Separa la validacion de pertenencia
    de la logica de negocio principal.

    Args:
        pet: Instancia de Pet.
        user: Usuario autenticado.
        error_msg: Mensaje de error personalizado segun la operacion.

    Returns:
        None si la verificacion pasa, o una tupla de error si falla.
    """
    if pet.owner_id != user.id:
        return {"error": error_msg}, 403
    return None


def get_user_pets(user: User) -> Tuple[dict, int]:
    """Obtiene todas las mascotas del usuario autenticado.

    Recalcula el estado de cada mascota antes de devolverla.

    Args:
        user: Instancia del usuario autenticado.

    Returns:
        Tupla (respuesta_dict, status_code).
    """
    pets = get_pets_by_owner(user.id)
    # Recalcular estado en tiempo real
    for pet in pets:
        pet.status = _calculate_status(pet)
    return {
        "pets": [pet.to_dict() for pet in pets],
        "total": len(pets),
    }, 200


def create_pet_for_user(
    user: User, name: str, age: int, breed: str, is_spayed: bool
) -> Tuple[dict, int]:
    """Crea una nueva mascota para el usuario autenticado.

    El estado se asigna automaticamente segun is_spayed.

    Args:
        user: Instancia del usuario dueno.
        name: Nombre de la mascota.
        age: Edad en anos.
        breed: Raza.
        is_spayed: Estado de esterilizacion.

    Returns:
        Tupla (respuesta_dict, status_code).
    """
    pet = create_pet(
        owner_id=user.id,
        name=name,
        age=age,
        breed=breed,
        is_spayed=is_spayed,
    )
    # Asignar estado segun la logica de negocio
    pet.status = _calculate_status(pet)
    from backend.extensions import db
    db.session.commit()
    return {
        "message": MSG_PET_CREATED,
        "pet": pet.to_dict(),
    }, 201


def get_pet_for_user(user: User, pet_id: int) -> Tuple[dict, int]:
    """Obtiene una mascota especifica del usuario.

    Recalcula el estado antes de devolverla.

    Args:
        user: Instancia del usuario autenticado.
        pet_id: ID de la mascota.

    Returns:
        Tupla (respuesta_dict, status_code).
    """
    pet, error = _get_pet_or_error(pet_id)
    if error:
        return error

    ownership_error = _verify_ownership(pet, user, MSG_PERMISSION_DENIED_ACCESS)
    if ownership_error:
        return ownership_error

    # Recalcular estado en tiempo real
    pet.status = _calculate_status(pet)
    return pet.to_dict(), 200


def update_pet_for_user(
    user: User, pet_id: int, data: dict
) -> Tuple[dict, int]:
    """Actualiza una mascota del usuario.

    Recalcula el estado automaticamente si cambio is_spayed.

    Args:
        user: Instancia del usuario autenticado.
        pet_id: ID de la mascota a actualizar.
        data: Diccionario con campos a actualizar.

    Returns:
        Tupla (respuesta_dict, status_code).
    """
    pet, error = _get_pet_or_error(pet_id)
    if error:
        return error

    ownership_error = _verify_ownership(pet, user, MSG_PERMISSION_DENIED_MODIFY)
    if ownership_error:
        return ownership_error

    updated_pet = update_pet(pet, data)
    # Recalcular estado despues de la actualizacion
    updated_pet.status = _calculate_status(updated_pet)
    from backend.extensions import db
    db.session.commit()
    return {
        "message": MSG_PET_UPDATED,
        "pet": updated_pet.to_dict(),
    }, 200


def delete_pet_for_user(user: User, pet_id: int) -> Tuple[dict, int]:
    """Elimina una mascota del usuario.

    Args:
        user: Instancia del usuario autenticado.
        pet_id: ID de la mascota a eliminar.

    Returns:
        Tupla (respuesta_dict, status_code).
    """
    pet, error = _get_pet_or_error(pet_id)
    if error:
        return error

    ownership_error = _verify_ownership(pet, user, MSG_PERMISSION_DENIED_DELETE)
    if ownership_error:
        return ownership_error

    delete_pet(pet)
    return {"message": MSG_PET_DELETED}, 200


def get_all_pets_admin() -> Tuple[dict, int]:
    """Obtiene todas las mascotas del sistema (solo admin).

    Recalcula el estado de cada mascota en tiempo real y
    calcula metricas de cumplimiento basadas en el estado actual.

    Returns:
        Tupla (respuesta_dict, status_code) con lista de mascotas,
        total y tasa de cumplimiento.
    """
    pets = get_all_pets_with_owners()
    total = len(pets)

    # Recalcular estado de cada mascota en tiempo real
    for pet in pets:
        pet.status = _calculate_status(pet)

    # Metricas de cumplimiento basadas en estado real
    certificado_count = sum(1 for pet in pets if pet.status == "certificado")
    gracia_count = sum(1 for pet in pets if pet.status == "gracia")
    incumplimiento_count = sum(1 for pet in pets if pet.status == "incumplimiento")
    compliance_rate = round(certificado_count / total * 100, 1) if total > 0 else 0.0

    pets_data = [
        {
            **pet.to_dict(),
            "owner_name": pet.owner.name if pet.owner else None,
            "owner_email": pet.owner.email if pet.owner else None,
        }
        for pet in pets
    ]

    return {
        "pets": pets_data,
        "total": total,
        "compliance_rate": compliance_rate,
        "certificado_count": certificado_count,
        "gracia_count": gracia_count,
        "incumplimiento_count": incumplimiento_count,
    }, 200
