"""Punto de entrada WSGI para Render.

Render ejecuta Gunicorn con este archivo como entry point,
evitando problemas de sintaxis con paréntesis en el Procfile.
"""
from backend.app import create_app

app = create_app()

if __name__ == "__main__":
    app.run()
