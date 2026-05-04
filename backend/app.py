"""Punto de entrada de la aplicación Flask New Life.

Inicializa la aplicación Flask, configura extensiones
(SQLAlchemy, CORS) y registra los blueprints de rutas.
También sirve los archivos estáticos del frontend.
"""

import os
from pathlib import Path

from flask import Flask, send_from_directory

from backend.config import Config
from backend.extensions import cors, db
from backend.routes.admin_routes import admin_bp
from backend.routes.auth_routes import auth_bp
from backend.routes.pet_routes import pet_bp

# Constantes de configuración
API_PREFIX: str = "/api/*"
CORS_ORIGINS: str = "*"
DEFAULT_PORT: int = 5000

# Ruta al directorio del frontend
FRONTEND_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")


def create_app() -> Flask:
    """Crea y configura la aplicación Flask.

    Returns:
        Instancia de Flask configurada y lista para ejecutar.
    """
    app: Flask = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar extensiones
    db.init_app(app)
    cors.init_app(app, resources={API_PREFIX: {"origins": CORS_ORIGINS}})

    # Registrar blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(pet_bp)
    app.register_blueprint(admin_bp)

    # Servir frontend estático
    @app.route("/")
    @app.route("/<path:path>")
    def serve_frontend(path: str = "index.html") -> Flask.response_class:
        """Sirve los archivos del frontend.

        Args:
            path: Ruta del archivo solicitado.

        Returns:
            Archivo solicitado o index.html para SPA routing.
        """
        full_path = os.path.join(FRONTEND_DIR, path)
        if path != "index.html" and os.path.isfile(full_path):
            return send_from_directory(FRONTEND_DIR, path)
        return send_from_directory(FRONTEND_DIR, "index.html")

    # Crear tablas en la base de datos
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app: Flask = create_app()
    app.run(debug=False, host='0.0.0.0', port=DEFAULT_PORT)
