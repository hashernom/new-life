"""Esquemas de validación para el modelo User.

Funciones helper para validar datos de entrada
en los endpoints de autenticación y usuario.
"""

import re
from typing import Optional, Tuple

# --- Constantes de validación ---
EMAIL_REGEX: str = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
NAME_MIN_LENGTH: int = 2
NAME_MAX_LENGTH: int = 100
PASSWORD_MIN_LENGTH: int = 6

# --- Mensajes de error ---
MSG_EMPTY_BODY = "El cuerpo de la solicitud no puede estar vacío."
MSG_NAME_REQUIRED = "El nombre es obligatorio."
MSG_NAME_LENGTH = f"El nombre debe tener entre {NAME_MIN_LENGTH} y {NAME_MAX_LENGTH} caracteres."
MSG_EMAIL_REQUIRED = "El correo electrónico es obligatorio."
MSG_EMAIL_INVALID = "El formato del correo electrónico no es válido."
MSG_PASSWORD_REQUIRED = "La contraseña es obligatoria."
MSG_PASSWORD_LENGTH = f"La contraseña debe tener al menos {PASSWORD_MIN_LENGTH} caracteres."


def validate_register_data(data: dict) -> Tuple[Optional[dict], Optional[str]]:
    """Valida los datos de registro de un usuario.

    Args:
        data: Diccionario con los campos name, email, password.

    Returns:
        Tupla (datos_validados, error). Si hay error, datos_validados es None.
    """
    if not data:
        return None, MSG_EMPTY_BODY

    name: str = data.get("name", "").strip()
    email: str = data.get("email", "").strip()
    password: str = data.get("password", "")

    if not name:
        return None, MSG_NAME_REQUIRED
    if len(name) < NAME_MIN_LENGTH or len(name) > NAME_MAX_LENGTH:
        return None, MSG_NAME_LENGTH

    if not email:
        return None, MSG_EMAIL_REQUIRED
    if not re.match(EMAIL_REGEX, email):
        return None, MSG_EMAIL_INVALID

    if not password:
        return None, MSG_PASSWORD_REQUIRED
    if len(password) < PASSWORD_MIN_LENGTH:
        return None, MSG_PASSWORD_LENGTH

    return {"name": name, "email": email.lower(), "password": password}, None


def validate_login_data(data: dict) -> Tuple[Optional[dict], Optional[str]]:
    """Valida los datos de inicio de sesión.

    Args:
        data: Diccionario con los campos email, password.

    Returns:
        Tupla (datos_validados, error). Si hay error, datos_validados es None.
    """
    if not data:
        return None, MSG_EMPTY_BODY

    email: str = data.get("email", "").strip()
    password: str = data.get("password", "")

    if not email:
        return None, MSG_EMAIL_REQUIRED

    if not password:
        return None, MSG_PASSWORD_REQUIRED

    return {"email": email.lower(), "password": password}, None
