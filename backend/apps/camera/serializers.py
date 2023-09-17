from django.contrib.auth import authenticate
from rest_framework import serializers
from apps.camera.models import Camera, Model


class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camera
        fields = "__all__"
        read_only_fields = ('user',)


class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = "__all__"




