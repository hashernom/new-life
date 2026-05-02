"""Funciones utilitarias para la creación y verificación de tokens JWT.

Implementa la generación de tokens con expiración configurable
y la decodificación/verificación de los mismos.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt

from backend.config import Config

# Constantes del payload JWT
JWT_SUBJECT_KEY: str = "sub"
JWT_IAT_KEY: str = "iat"
JWT_EXP_KEY: str = "exp"


def create_token(user_id: int) -> str:
    """Crea un token JWT para un usuario.

    Args:
        user_id: ID del usuario para incluir en el payload.

    Returns:
        Token JWT codificado como string.
    """
    now = datetime.now(timezone.utc)
    expiration = now + timedelta(hours=Config.JWT_EXPIRATION_HOURS)
    payload: dict = {
        JWT_SUBJECT_KEY: str(user_id),
        JWT_IAT_KEY: now,
        JWT_EXP_KEY: expiration,
    }
    token: str = jwt.encode(payload, Config.SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
    return token


def verify_token(token: str) -> Optional[int]:
    """Verifica y decodifica un token JWT.

    Args:
        token: Token JWT a verificar.

    Returns:
        ID del usuario (sub) si el token es válido, None en caso contrario.
    """
    try:
        payload: dict = jwt.decode(
            token, Config.SECRET_KEY, algorithms=[Config.JWT_ALGORITHM]
        )
        sub: Optional[str] = payload.get(JWT_SUBJECT_KEY)
        return int(sub) if sub is not None else None
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
