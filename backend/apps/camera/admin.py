from django.contrib import admin
from .models import Camera, Model


# class Camera(BaseModel):
#     user = models.ForeignKey('partner.Partner', on_delete=models.CASCADE, verbose_name="Пользователь")
#     address = models.CharField(max_length=100, unique=True, verbose_name="Адрес")
#     title = models.CharField(max_length=100, verbose_name="Название")
#     object_id = models.CharField(max_length=100, verbose_name="ID объектов")
#     model = models.ForeignKey(Model, on_delete=models.CASCADE, verbose_name="Модель")
#     chat_id = models.CharField(max_length=100, verbose_name="Токен")
#     toke_bot = models.CharField(max_length=100, verbose_name="Токен бота")
#     shablon_sobsheniya = models.CharField(max_length=100, verbose_name="Шаблон сообщения")


@admin.register(Camera)
class CameraAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'user',)
    list_display_links = ('id', 'title', )



@admin.register(Model)
class ModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', )