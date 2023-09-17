from django.db import models
from apps.common.models import BaseModel
import os



class Model(BaseModel):
    title = models.CharField(max_length=100, verbose_name="Название")
    adress_model = models.FileField(verbose_name="Адресс модел")
    adress_nastroiki = models.FileField(verbose_name="Адресс настроеки")


    @property
    def model_file_path(self):
        return self.adress_model.path

    class Meta:
        db_table = "model"
        verbose_name = "Модель"
        verbose_name_plural = "Модели"

    def __str__(self):
        return self.title


class Camera(BaseModel):
    user = models.ForeignKey('partner.Partner', on_delete=models.CASCADE, verbose_name="Пользователь")
    address = models.CharField(max_length=100, unique=True, verbose_name="Адрес")
    title = models.CharField(max_length=100, verbose_name="Название")
    object_id = models.CharField(max_length=100, verbose_name="ID объектов")
    model = models.ForeignKey(Model, on_delete=models.CASCADE, verbose_name="Модель")
    chat_id = models.CharField(max_length=100, verbose_name="Токен")
    toke_bot = models.CharField(max_length=100, verbose_name="Токен бота")
    shablon_sobsheniya = models.CharField(max_length=100, verbose_name="Шаблон сообщения")


    class Meta:
        db_table = "camera"
        verbose_name = "Камера"
        verbose_name_plural = "Камеры"


    def __str__(self):
        return self.title
