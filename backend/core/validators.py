import re
from copy import deepcopy


EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _as_string(value):
    return "" if value is None else str(value).strip()


def required_text(label, min_length=1):
    def validate(value):
        text = _as_string(value)
        if len(text) < min_length:
            return None, f"{label} es requerido."
        return text, None

    return validate


def optional_text(label, max_length=None):
    def validate(value):
        text = _as_string(value)
        if not text:
            return "", None
        if max_length and len(text) > max_length:
            return None, f"{label} supera el limite permitido."
        return text, None

    return validate


def email_field(label, required=False):
    def validate(value):
        text = _as_string(value)
        if not text:
            if required:
                return None, f"{label} es requerido."
            return "", None
        if not EMAIL_REGEX.match(text):
            return None, f"{label} no es valido."
        return text.lower(), None

    return validate


def number_field(label, minimum=None, integer=False, required=False):
    def validate(value):
        if value in (None, ""):
            if required:
                return None, f"{label} es requerido."
            return None, None

        try:
            parsed = int(value) if integer else float(value)
        except (TypeError, ValueError):
            return None, f"{label} debe ser numerico."

        if minimum is not None and parsed < minimum:
            return None, f"{label} debe ser mayor o igual a {minimum}."

        return parsed, None

    return validate


class EntityValidator:
    def __init__(self, required_fields, optional_fields=None):
        self.required_fields = required_fields
        self.optional_fields = optional_fields or {}

    def validate(self, payload, partial=False):
        data = deepcopy(payload) if isinstance(payload, dict) else {}
        errors = {}
        cleaned = {}

        if not isinstance(payload, dict):
            return {}, {"body": "Se esperaba un objeto JSON valido."}

        validators = self.optional_fields if partial else {**self.required_fields, **self.optional_fields}

        for field, validator in validators.items():
            if partial and field not in data:
                continue

            value, error = validator(data.get(field))
            if error:
                errors[field] = error
            elif field in data or not partial:
                cleaned[field] = value

        if partial and not cleaned and not errors:
            errors["body"] = "Debe enviar al menos un campo para actualizar."

        return cleaned, errors


CLIENT_VALIDATOR = EntityValidator(
    required_fields={
        "nombre": required_text("El nombre"),
    },
    optional_fields={
        "email": email_field("El correo electronico"),
        "telefono": optional_text("El telefono", max_length=20),
        "direccion": optional_text("La direccion", max_length=180),
    },
)

PET_VALIDATOR = EntityValidator(
    required_fields={
        "nombre": required_text("El nombre"),
        "cliente_id": required_text("El cliente"),
    },
    optional_fields={
        "especie": optional_text("La especie", max_length=50),
        "raza": optional_text("La raza", max_length=80),
        "sexo": optional_text("El sexo", max_length=20),
        "edad": optional_text("La edad", max_length=40),
        "peso": number_field("El peso", minimum=0),
    },
)

APPOINTMENT_VALIDATOR = EntityValidator(
    required_fields={
        "fecha": required_text("La fecha"),
        "hora": required_text("La hora"),
        "cliente_id": required_text("El cliente"),
        "mascota_id": required_text("La mascota"),
        "servicio_id": required_text("El servicio"),
    },
    optional_fields={
        "notas": optional_text("Las notas", max_length=300),
        "estado": optional_text("El estado", max_length=40),
    },
)

SERVICE_VALIDATOR = EntityValidator(
    required_fields={
        "nombre": required_text("El nombre"),
        "precio": number_field("El precio", minimum=0, required=True),
    },
    optional_fields={
        "descripcion": optional_text("La descripcion", max_length=300),
        "duracion": optional_text("La duracion", max_length=40),
    },
)

PAYMENT_VALIDATOR = EntityValidator(
    required_fields={
        "cliente_id": required_text("El cliente"),
        "monto": number_field("El monto", minimum=0, required=True),
    },
    optional_fields={
        "metodo": optional_text("El metodo", max_length=40),
        "estado": optional_text("El estado", max_length=40),
    },
)

INVENTORY_VALIDATOR = EntityValidator(
    required_fields={
        "nombre": required_text("El nombre"),
        "cantidad": number_field("La cantidad", minimum=0, integer=True, required=True),
        "precio": number_field("El precio", minimum=0, required=True),
    },
    optional_fields={
        "descripcion": optional_text("La descripcion", max_length=300),
        "categoria": optional_text("La categoria", max_length=80),
    },
)

CONTACT_VALIDATOR = EntityValidator(
    required_fields={
        "nombre": required_text("El nombre"),
        "email": email_field("El correo electronico", required=True),
        "mensaje": required_text("El mensaje", min_length=10),
    },
    optional_fields={
        "asunto": optional_text("El asunto", max_length=120),
    },
)
