"""Configuración centralizada de la aplicación Flask.

Contiene las variables de configuración para la aplicación,
incluyendo secretos, URI de base de datos y expiración de JWT.
"""

import os
from datetime import timedelta
from typing import Final


class Config:
    """Configuración principal de la aplicación."""

    SECRET_KEY: Final[str] = os.environ.get("SECRET_KEY", "new-life-secret-key-change-in-production")
    # Ruta absoluta a la BD para evitar conflictos entre procesos
    _base_dir: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    SQLALCHEMY_DATABASE_URI: Final[str] = os.environ.get(
        "DATABASE_URL", f"sqlite:///{os.path.join(_base_dir, 'instance', 'newlife.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS: Final[bool] = False
    JWT_EXPIRATION_HOURS: Final[int] = int(os.environ.get("JWT_EXPIRATION_HOURS", "24"))
    JWT_ALGORITHM: Final[str] = "HS256"
