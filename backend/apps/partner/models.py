from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken
from treasuremap.fields import LatLongField

from .validators import CustomFileExtensionValidator
from .manager import AccountManager


class Partner(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name="email", max_length=60, unique=True, db_index=True, blank=True, null=True)
    username = models.CharField(max_length=30, unique=True, verbose_name="логин")
    first_name = models.CharField(max_length=30, blank=True, null=True, verbose_name="Имя")
    last_name = models.CharField(max_length=30, blank=True, null=True, verbose_name="Фамилия")
    company_name = models.CharField(max_length=30, blank=True, null=True, verbose_name="Название компании")
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name= "Дата регистрации")
    last_login = models.DateTimeField(auto_now=True, verbose_name= "Последний вход")
    phone_number = models.CharField(max_length=30, blank=True, null=True, verbose_name="Номер телефона")
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name"]

    objects = AccountManager()

    avatar = models.ImageField(upload_to="users/%Y/%m/", blank=True, null=True)

    def __str__(self):
        return str(self.username) if self.username else str(self.email)

    def has_module_perms(self, app_label):
        return self.is_superuser

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    @property
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        data = {"refresh": str(refresh), "access": str(refresh.access_token)}
        return data

    @property
    def image_url(self):
        if self.avatar:
            if settings.DEBUG:
                return f'{settings.LOCAL_BASE_URL}{self.avatar.url}'
            return f'{settings.PROD_BASE_URL}{self.avatar.url}'
        else:
            return None


    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"


class PartnerProfile(models.Model):
    user = models.OneToOneField(Partner, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to="profile_pics", blank=True, null=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return str(self.user)

    @property
    def full_address(self):
        return f"{self.city} {self.state}"

    class Meta:
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"
        ordering = ["-id"]

















