"""Rutas CRUD de mascotas.

Blueprint que agrupa los endpoints para gestionar mascotas
del usuario autenticado.
"""

from typing import Tuple

from flask import Blueprint, Response, g, jsonify, request

from backend.schemas.pet_schema import (
    validate_create_pet_data,
    validate_update_pet_data,
)
from backend.services.pet_service import (
    create_pet_for_user,
    delete_pet_for_user,
    get_pet_for_user,
    get_user_pets,
    update_pet_for_user,
)
from backend.utils.decorators import jwt_required

pet_bp = Blueprint("pets", __name__, url_prefix="/api/pets")


@pet_bp.route("", methods=["GET"])
@jwt_required
def list_pets() -> Tuple[Response, int]:
    """Lista todas las mascotas del usuario autenticado.

    Headers:
        Authorization: Bearer <token>

    Returns:
        200: Lista de mascotas con compliance_status y total.
    """
    response, status = get_user_pets(g.current_user)
    return jsonify(response), status


@pet_bp.route("", methods=["POST"])
@jwt_required
def create_pet() -> Tuple[Response, int]:
    """Registra una nueva mascota para el usuario autenticado.

    Headers:
        Authorization: Bearer <token>

    Request body:
        name (str): Nombre de la mascota.
        age (int): Edad en años.
        breed (str): Raza.
        is_spayed (bool): Estado de esterilización.

    Returns:
        201: Mascota creada exitosamente.
        400: Error de validación.
    """
    data = request.get_json(silent=True)
    validated, error = validate_create_pet_data(data)
    if error:
        return jsonify({"error": error}), 400

    response, status = create_pet_for_user(g.current_user, **validated)
    return jsonify(response), status


@pet_bp.route("/<int:pet_id>", methods=["GET"])
@jwt_required
def get_pet(pet_id: int) -> Tuple[Response, int]:
    """Obtiene los detalles de una mascota específica.

    Headers:
        Authorization: Bearer <token>

    Args:
        pet_id: ID de la mascota.

    Returns:
        200: Datos de la mascota.
        403: No pertenece al usuario.
        404: Mascota no encontrada.
    """
    response, status = get_pet_for_user(g.current_user, pet_id)
    return jsonify(response), status


@pet_bp.route("/<int:pet_id>", methods=["PUT"])
@jwt_required
def update_pet(pet_id: int) -> Tuple[Response, int]:
    """Actualiza los datos de una mascota (campos parciales).

    Headers:
        Authorization: Bearer <token>

    Args:
        pet_id: ID de la mascota.

    Request body (al menos uno):
        name (str, opcional): Nombre.
        age (int, opcional): Edad.
        breed (str, opcional): Raza.
        is_spayed (bool, opcional): Estado de esterilización.

    Returns:
        200: Mascota actualizada.
        400: Error de validación.
        403: No pertenece al usuario.
        404: Mascota no encontrada.
    """
    data = request.get_json(silent=True)
    validated, error = validate_update_pet_data(data)
    if error:
        return jsonify({"error": error}), 400

    response, status = update_pet_for_user(g.current_user, pet_id, validated)
    return jsonify(response), status


@pet_bp.route("/<int:pet_id>", methods=["DELETE"])
@jwt_required
def delete_pet(pet_id: int) -> Tuple[Response, int]:
    """Elimina una mascota del usuario autenticado.

    Headers:
        Authorization: Bearer <token>

    Args:
        pet_id: ID de la mascota.

    Returns:
        200: Mascota eliminada.
        403: No pertenece al usuario.
        404: Mascota no encontrada.
    """
    response, status = delete_pet_for_user(g.current_user, pet_id)
    return jsonify(response), status
