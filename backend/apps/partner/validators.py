from pathlib import Path

import magic
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _


@deconstructible
class CustomFileExtensionValidator:
    def __init__(self, allowed_file_types):
        allowed_file_types = [allowed_file_type.lower() for allowed_file_type in allowed_file_types]
        self.allowed_file_types = allowed_file_types

    def __call__(self, value):
        self.validate(value)

    def validate(self, value):
        fake_extension = Path(value.name).suffix[1:].lower()
        org_extension = magic.from_buffer(value.read(), mime=True).split("/")[1].lower()
        if org_extension not in self.allowed_file_types:
            raise ValidationError(
                _(
                    f"Your image fake extension is {fake_extension} and original extension is {org_extension}."
                    f" Allowed extensions are {self.allowed_file_types}"
                ),
                code="invalid",
                params={
                    "fake_extension": fake_extension,
                    "original_extension": org_extension,
                    "allowed_extensions": ", ".join(self.allowed_file_types),
                    "value": value,
                },
            )
