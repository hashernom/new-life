"""Servicio de autenticación.

Contiene la lógica de negocio para registro, inicio de sesión
y generación/verificación de tokens JWT.
"""

from typing import Tuple

from backend.crud.user_crud import create_user, get_user_by_email
from backend.models.user import User
from backend.utils.jwt_utils import create_token

# --- Constantes de mensajes ---
MSG_EMAIL_EXISTS = "El correo electrónico ya está registrado."
MSG_INVALID_CREDENTIALS = "Credenciales inválidas."
MSG_USER_REGISTERED = "Usuario registrado exitosamente"


def register_user(name: str, email: str, password: str) -> Tuple[dict, int]:
    """Registra un nuevo usuario en el sistema.

    Patrón: Return early con tuplas de error, consistente con pet_service.
    En lugar de lanzar ValueError (que obliga a try/except en rutas),
    devuelve directamente la tupla (error_dict, status_code).

    Args:
        name: Nombre completo del usuario.
        email: Correo electrónico único.
        password: Contraseña en texto plano.

    Returns:
        Tupla (respuesta_dict, status_code).
    """
    existing = get_user_by_email(email)
    if existing:
        return {"error": MSG_EMAIL_EXISTS}, 400

    user = create_user(name=name, email=email, password=password)

    return {
        "message": MSG_USER_REGISTERED,
        "user": user.to_dict(),
    }, 201


def login_user(email: str, password: str) -> Tuple[dict, int]:
    """Autentica un usuario y genera un token JWT.

    Patrón: Return early con tuplas de error, consistente con pet_service.
    En lugar de lanzar ValueError, devuelve directamente la tupla de error.

    Args:
        email: Correo electrónico del usuario.
        password: Contraseña en texto plano.

    Returns:
        Tupla (respuesta_dict, status_code).
    """
    user = get_user_by_email(email)
    if not user or not user.check_password(password):
        return {"error": MSG_INVALID_CREDENTIALS}, 401

    token = create_token(user.id)

    return {
        "token": token,
        "user": user.to_dict(),
    }, 200


def get_current_user(user: User) -> Tuple[dict, int]:
    """Obtiene los datos del usuario autenticado.

    Args:
        user: Instancia del usuario autenticado.

    Returns:
        Tupla (datos_usuario_dict, status_code).
    """
    return user.to_dict(), 200
