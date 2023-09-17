from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from apps.partner.models import  Partner

class JSONSerializerField(serializers.Field):
    """ Serializer for JSONField -- required to make field writable"""
    def to_internal_value(self, data):
        return data
    def to_representation(self, value):
        return value

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(min_length=6, max_length=68, write_only=True)
    password2 = serializers.CharField(min_length=6, max_length=68, write_only=True)

    class Meta:
        model = Partner
        fields = ("username", "first_name", "email", "password", "password2")

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")

        if password != password2:
            raise serializers.ValidationError({"success": False, "message": "Password did not match, please try again"})
        return attrs

    def create(self, validated_data):
        del validated_data["password2"]
        return Partner.objects.create_user(**validated_data)


class LoginSerializer(serializers.ModelSerializer):
    email_or_username = serializers.CharField()
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)


    class Meta:
        model = Partner
        fields = ("id", "email_or_username", "password")

    def validate(self, attrs):
        email = attrs.get("email_or_username")
        password = attrs.get("password")

        user = authenticate(username=email, password=password)
        if not user:
            raise AuthenticationFailed({"success": False, "message": "Invalid credentials, try again"})

        attrs["user"] = user
        return attrs

class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=555)

    class Meta:
        model = Partner
        fields = ['token']



class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_message = {
        'bad_token': ('Token is expired or invalid')
    }

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):

        try:
            RefreshToken(self.token).blacklist()

        except TokenError:
            self.fail('bad_token')




class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = "__all__"



class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ("email","company_name", "phone_number", "first_name",)