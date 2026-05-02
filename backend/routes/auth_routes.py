"""Rutas de autenticación.

Blueprint que agrupa los endpoints de registro, inicio de sesión
 y perfil del usuario autenticado.
"""

from typing import Tuple

from flask import Blueprint, Response, g, jsonify, request

from backend.schemas.user_schema import validate_login_data, validate_register_data
from backend.services.auth_service import get_current_user, login_user, register_user
from backend.utils.decorators import jwt_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register() -> Tuple[Response, int]:
    """Registra un nuevo usuario.

    Request body:
        name (str): Nombre completo.
        email (str): Correo electrónico.
        password (str): Contraseña (mín. 6 caracteres).

    Returns:
        201: Usuario registrado exitosamente.
        400: Error de validación o email duplicado.
    """
    data = request.get_json(silent=True)
    validated, error = validate_register_data(data)
    if error:
        return jsonify({"error": error}), 400

    response, status = register_user(**validated)
    return jsonify(response), status


@auth_bp.route("/login", methods=["POST"])
def login() -> Tuple[Response, int]:
    """Inicia sesión y retorna un token JWT.

    Request body:
        email (str): Correo electrónico.
        password (str): Contraseña.

    Returns:
        200: Token JWT y datos del usuario.
        401: Credenciales inválidas.
    """
    data = request.get_json(silent=True)
    validated, error = validate_login_data(data)
    if error:
        return jsonify({"error": error}), 400

    response, status = login_user(**validated)
    return jsonify(response), status


@auth_bp.route("/me", methods=["GET"])
@jwt_required
def me() -> Tuple[Response, int]:
    """Obtiene los datos del usuario autenticado.

    Headers:
        Authorization: Bearer <token>

    Returns:
        200: Datos del usuario.
        401: Token inválido o expirado.
    """
    response, status = get_current_user(g.current_user)
    return jsonify(response), status
