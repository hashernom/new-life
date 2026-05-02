"""Modelo User para la aplicación New Life.

Define la tabla de usuarios con métodos para manejo seguro
de contraseñas usando werkzeug.security.
"""

from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from backend.extensions import db


class User(db.Model):
    """Representa un usuario del sistema.

    Attributes:
        id: Identificador único del usuario.
        name: Nombre completo del usuario.
        email: Correo electrónico único usado para login.
        password_hash: Hash de la contraseña (generado con werkzeug).
        role: Rol del usuario ('user' o 'admin').
        created_at: Fecha y hora de creación.
        updated_at: Fecha y hora de última actualización.
    """

    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="user")
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def set_password(self, password: str) -> None:
        """Genera y almacena el hash de la contraseña.

        Args:
            password: Contraseña en texto plano.
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Verifica si la contraseña coincide con el hash almacenado.

        Args:
            password: Contraseña en texto plano a verificar.

        Returns:
            True si la contraseña es correcta, False en caso contrario.
        """
        return check_password_hash(self.password_hash, password)

    def to_dict(self) -> dict:
        """Convierte el usuario a diccionario serializable.

        Returns:
            Diccionario con los datos públicos del usuario.
        """
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self) -> str:
        return f"<User {self.id}: {self.email}>"
