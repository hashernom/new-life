"""Modelo Pet para la aplicacion New Life.

Define la tabla de mascotas con relacion al usuario dueno
y propiedad calculada compliance_status.
"""

from datetime import datetime, timezone

from backend.extensions import db


class Pet(db.Model):
    """Representa una mascota registrada en el sistema.

    Attributes:
        id: Identificador unico de la mascota.
        owner_id: ID del usuario dueno (FK -> User.id).
        name: Nombre de la mascota.
        age: Edad en anos.
        breed: Raza de la mascota.
        is_spayed: Estado de esterilizacion.
        status: Estado de cumplimiento ('certificado', 'gracia', 'incumplimiento').
        adopted: Si la mascota esta disponible para adopcion.
        created_at: Fecha y hora de creacion.
        updated_at: Fecha y hora de ultima actualizacion.
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
    status = db.Column(db.String(20), nullable=False, default="certificado")
    adopted = db.Column(db.Boolean, nullable=False, default=True)
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
        """Indica si la mascota cumple con el estado de esterilizacion.

        Returns:
            "Cumple" si is_spayed es True, "No cumple" en caso contrario.
        """
        return "Cumple" if self.is_spayed else "No cumple"

    @property
    def status_label(self) -> str:
        """Etiqueta legible del estado de cumplimiento.

        Returns:
            Texto descriptivo del estado actual.
        """
        labels = {
            "certificado": "Certificado validado",
            "gracia": "En periodo de gracia (6 meses)",
            "incumplimiento": "Incumplimiento injustificado",
        }
        return labels.get(self.status, "Desconocido")

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
            "status": self.status,
            "status_label": self.status_label,
            "adopted": self.adopted,
            "compliance_status": self.compliance_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f"<Pet {self.id}: {self.name}>"
