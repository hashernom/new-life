"""Esquemas de validación para el modelo Pet.

Funciones helper para validar datos de entrada
en los endpoints CRUD de mascotas.
"""

from typing import Optional, Tuple

# --- Constantes de validación ---
FIELD_MAX_LENGTH: int = 100
AGE_MIN: int = 0
AGE_MAX: int = 50

# --- Mensajes de error ---
MSG_EMPTY_BODY = "El cuerpo de la solicitud no puede estar vacío."
MSG_NAME_REQUIRED = "El nombre de la mascota es obligatorio."
MSG_NAME_EMPTY = "El nombre no puede estar vacío."
MSG_NAME_MAX = f"El nombre no puede exceder los {FIELD_MAX_LENGTH} caracteres."
MSG_AGE_REQUIRED = "La edad es obligatoria."
MSG_AGE_INVALID = f"La edad debe ser un número entero mayor o igual a {AGE_MIN}."
MSG_BREED_REQUIRED = "La raza es obligatoria."
MSG_BREED_EMPTY = "La raza no puede estar vacía."
MSG_BREED_MAX = f"La raza no puede exceder los {FIELD_MAX_LENGTH} caracteres."
MSG_SPAYED_INVALID = "El campo is_spayed debe ser un booleano (true o false)."
MSG_NO_FIELDS = "No se proporcionaron campos válidos para actualizar."


def validate_create_pet_data(data: dict) -> Tuple[Optional[dict], Optional[str]]:
    """Valida los datos para crear una mascota.

    Args:
        data: Diccionario con los campos name, age, breed, is_spayed.

    Returns:
        Tupla (datos_validados, error). Si hay error, datos_validados es None.
    """
    if not data:
        return None, MSG_EMPTY_BODY

    name: str = data.get("name", "").strip()
    age = data.get("age")
    breed: str = data.get("breed", "").strip()
    is_spayed = data.get("is_spayed")

    if not name:
        return None, MSG_NAME_REQUIRED
    if len(name) > FIELD_MAX_LENGTH:
        return None, MSG_NAME_MAX

    if age is None:
        return None, MSG_AGE_REQUIRED
    if not isinstance(age, int) or age < AGE_MIN:
        return None, MSG_AGE_INVALID

    if not breed:
        return None, MSG_BREED_REQUIRED
    if len(breed) > FIELD_MAX_LENGTH:
        return None, MSG_BREED_MAX

    if not isinstance(is_spayed, bool):
        return None, MSG_SPAYED_INVALID

    return {
        "name": name,
        "age": age,
        "breed": breed,
        "is_spayed": is_spayed,
    }, None


def validate_update_pet_data(data: dict) -> Tuple[Optional[dict], Optional[str]]:
    """Valida los datos para actualizar una mascota (campos parciales).

    Args:
        data: Diccionario con campos opcionales name, age, breed, is_spayed.

    Returns:
        Tupla (datos_validados, error). Si hay error, datos_validados es None.
    """
    if not data:
        return None, MSG_EMPTY_BODY

    validated: dict = {}

    if "name" in data:
        name: str = data["name"].strip()
        if not name:
            return None, MSG_NAME_EMPTY
        if len(name) > FIELD_MAX_LENGTH:
            return None, MSG_NAME_MAX
        validated["name"] = name

    if "age" in data:
        age = data["age"]
        if not isinstance(age, int) or age < AGE_MIN:
            return None, MSG_AGE_INVALID
        validated["age"] = age

    if "breed" in data:
        breed: str = data["breed"].strip()
        if not breed:
            return None, MSG_BREED_EMPTY
        if len(breed) > FIELD_MAX_LENGTH:
            return None, MSG_BREED_MAX
        validated["breed"] = breed

    if "is_spayed" in data:
        if not isinstance(data["is_spayed"], bool):
            return None, MSG_SPAYED_INVALID
        validated["is_spayed"] = data["is_spayed"]

    if not validated:
        return None, MSG_NO_FIELDS

    return validated, None
