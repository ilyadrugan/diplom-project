from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import *

class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')

        user = authenticate(username=login, password=password)
        if not user:
            raise serializers.ValidationError("Неверный логин или пароль")

        attrs['user'] = user
        return attrs

    def create(self, validated_data):
        user = validated_data['user']
        refresh = RefreshToken.for_user(user)

        return {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                # Добавь другие поля при необходимости
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }

class TypeSerializer(serializers.ModelSerializer):
    type_name = serializers.CharField(max_length=255)

    class Meta:
        model = Types
        fields = '__all__'

class PhotoSerializer(serializers.ModelSerializer):
    coord_long = serializers.CharField(max_length=255, allow_null=True)
    request_id = serializers.IntegerField()
    coord_lat = serializers.CharField(max_length=255, allow_null=True)
    photo_url = serializers.ImageField()
    address = serializers.CharField(max_length=255, allow_null=True)
    class Meta:
        model = Photos
        fields = '__all__'

class RequestSerializer(serializers.ModelSerializer):
    type_id = serializers.IntegerField()
    type = TypeSerializer(read_only=True)
    user_login = serializers.IntegerField()
    comment = serializers.CharField(max_length=255, allow_null=True)
    photos = PhotoSerializer(many=True, read_only=True)
    class Meta:
        model = Requests
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    login = serializers.IntegerField()
    email = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255)
    user_status = serializers.CharField(max_length=255, allow_null=True)
    name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255)
    class Meta:
        model = Users
        fields = '__all__'