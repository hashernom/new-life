"""Decoradores para protección de rutas.

Implementa los decoradores @jwt_required y @admin_required
para restringir el acceso a endpoints según autenticación y rol.
"""

from functools import wraps
from typing import Any, Callable, Tuple

from flask import g, jsonify, request

from backend.crud.user_crud import get_user_by_id
from backend.utils.jwt_utils import verify_token

# --- Constantes de mensajes de error ---
MSG_TOKEN_REQUIRED = "Token de autenticación requerido"
MSG_TOKEN_INVALID = "Token inválido o expirado"
MSG_USER_NOT_FOUND = "Usuario no encontrado"
MSG_ADMIN_REQUIRED = "Acceso denegado. Se requiere rol de administrador"

# --- Constantes de HTTP ---
BEARER_PREFIX: str = "Bearer "
HTTP_UNAUTHORIZED: int = 401
HTTP_FORBIDDEN: int = 403


def jwt_required(f: Callable[..., Any]) -> Callable[..., Any]:
    """Decorador que requiere un token JWT válido.

    Extrae el token del header Authorization, lo verifica y
    almacena el usuario autenticado en flask.g.current_user.

    Args:
        f: Función a decorar.

    Returns:
        Función decorada que verifica el JWT antes de ejecutar.
    """

    @wraps(f)
    def decorated(*args: Any, **kwargs: Any) -> Any:
        auth_header: str = request.headers.get("Authorization", "")

        if not auth_header.startswith(BEARER_PREFIX):
            return jsonify({"error": MSG_TOKEN_REQUIRED}), HTTP_UNAUTHORIZED

        token: str = auth_header.split(" ", 1)[1]

        user_id: int | None = verify_token(token)
        if user_id is None:
            return jsonify({"error": MSG_TOKEN_INVALID}), HTTP_UNAUTHORIZED

        user = get_user_by_id(user_id)
        if user is None:
            return jsonify({"error": MSG_USER_NOT_FOUND}), HTTP_UNAUTHORIZED

        g.current_user = user
        return f(*args, **kwargs)

    return decorated


def admin_required(f: Callable[..., Any]) -> Callable[..., Any]:
    """Decorador que requiere rol de administrador.

    Debe usarse después de @jwt_required para asegurar
    que el usuario autenticado tiene rol 'admin'.

    Mejora: En lugar de usar hasattr() que es frágil y podría
    ocultar errores de configuración, verifica explícitamente
    que g.current_user exista. Si no, retorna 401 (no autenticado)
    en lugar de 403 (no autorizado), que es semánticamente correcto.

    Args:
        f: Función a decorar.

    Returns:
        Función decorada que verifica el rol admin.
    """

    @wraps(f)
    def decorated(*args: Any, **kwargs: Any) -> Any:
        current_user = getattr(g, "current_user", None)
        if current_user is None:
            return jsonify({"error": MSG_TOKEN_REQUIRED}), HTTP_UNAUTHORIZED
        if current_user.role != "admin":
            return jsonify({"error": MSG_ADMIN_REQUIRED}), HTTP_FORBIDDEN
        return f(*args, **kwargs)

    return decorated
