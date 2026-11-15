import os

# Test-only values: no application .env or database is needed.
os.environ.setdefault('SECRET_KEY', 'isolated-tests-only-not-a-deployment-secret-at-least-50-characters')
from .base import *  # noqa

DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': ':memory:'}}
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
ALLOWED_HOSTS = ['testserver', 'localhost', '127.0.0.1']
