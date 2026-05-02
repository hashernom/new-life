"""Inicialización de extensiones Flask.

Centraliza la creación de instancias de extensiones
como SQLAlchemy para evitar importaciones circulares.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db: SQLAlchemy = SQLAlchemy()
cors: CORS = CORS()
