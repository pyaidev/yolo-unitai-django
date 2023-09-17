from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
# import Q
from django.db.models import Q
User = get_user_model()

class CustomAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(Q(email=username) | Q(username=username))
        except User.DoesNotExist:
            return None

        # Verify the user's password
        return user if user.check_password(password) else None