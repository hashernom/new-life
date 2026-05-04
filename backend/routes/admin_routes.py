"""Rutas de administración.

Blueprint que agrupa los endpoints del panel de administración,
accesibles solo para usuarios con rol 'admin'.
"""

from typing import Tuple

from flask import Blueprint, Response, g, jsonify

from backend.crud.pet_crud import get_pet_by_id, update_pet
from backend.crud.user_crud import get_all_users_with_pet_count
from backend.services.pet_service import get_all_pets_admin
from backend.utils.decorators import admin_required, jwt_required

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.route("/users", methods=["GET"])
@jwt_required
@admin_required
def list_users() -> Tuple[Response, int]:
    """Lista todos los usuarios del sistema (solo admin).

    Headers:
        Authorization: Bearer <token> (rol admin requerido)

    Returns:
        200: Lista de usuarios con cantidad de mascotas.
        403: No es administrador.
    """
    users = get_all_users_with_pet_count()
    return jsonify({"users": users, "total": len(users)}), 200


@admin_bp.route("/pets", methods=["GET"])
@jwt_required
@admin_required
def list_pets() -> Tuple[Response, int]:
    """Lista todas las mascotas del sistema con datos del dueño (solo admin).

    Headers:
        Authorization: Bearer <token> (rol admin requerido)

    Returns:
        200: Lista de mascotas con owner_name, total y compliance_rate.
        403: No es administrador.
    """
    response, status = get_all_pets_admin()
    return jsonify(response), status


@admin_bp.route("/pets/<int:pet_id>/seize", methods=["PUT"])
@jwt_required
@admin_required
def seize_pet(pet_id: int) -> Tuple[Response, int]:
    """Ejecuta una orden de decomiso sobre una mascota (solo admin).

    Marca la mascota como no adoptable (adopted=False) y
    cambia su estado a 'incumplimiento'.

    Headers:
        Authorization: Bearer <token> (rol admin requerido)

    Args:
        pet_id: ID de la mascota a decomisar.

    Returns:
        200: Mascota decomisada exitosamente.
        404: Mascota no encontrada.
    """
    pet = get_pet_by_id(pet_id)
    if not pet:
        return jsonify({"error": "Mascota no encontrada"}), 404

    update_pet(pet, {"adopted": False, "status": "incumplimiento"})
    return jsonify({
        "message": f"Orden de decomiso ejecutada para {pet.name}.",
        "pet": pet.to_dict(),
    }), 200
