"""Modelo Pet para la aplicación New Life.

Define la tabla de mascotas con relación al usuario dueño
y propiedad calculada compliance_status.
"""

from datetime import datetime, timezone

from backend.extensions import db


class Pet(db.Model):
    """Representa una mascota registrada en el sistema.

    Attributes:
        id: Identificador único de la mascota.
        owner_id: ID del usuario dueño (FK -> User.id).
        name: Nombre de la mascota.
        age: Edad en años.
        breed: Raza de la mascota.
        is_spayed: Estado de esterilización.
        created_at: Fecha y hora de creación.
        updated_at: Fecha y hora de última actualización.
    """

    __tablename__ = "pet"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    owner_id = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=False, index=True
    )
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    breed = db.Column(db.String(100), nullable=False)
    is_spayed = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    owner = db.relationship("User", backref=db.backref("pets", lazy="dynamic"), lazy="joined")

    @property
    def compliance_status(self) -> str:
        """Indica si la mascota cumple con el estado de esterilización.

        Returns:
            "Cumple" si is_spayed es True, "No cumple" en caso contrario.
        """
        return "Cumple" if self.is_spayed else "No cumple"

    def to_dict(self) -> dict:
        """Convierte la mascota a diccionario serializable.

        Returns:
            Diccionario con los datos de la mascota.
        """
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "breed": self.breed,
            "is_spayed": self.is_spayed,
            "compliance_status": self.compliance_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f"<Pet {self.id}: {self.name}>"
