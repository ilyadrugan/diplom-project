from rest_framework import serializers
from .models import *

class TypeSerializer(serializers.ModelSerializer):
    type_name = serializers.CharField(max_length=255)

    class Meta:
        model = Types
        fields = '__all__'

class PhotoSerializer(serializers.ModelSerializer):
    coord_long = serializers.CharField(max_length=255, allow_null=True)
    request_id = serializers.CharField(max_length=255, allow_null=True)
    coord_lat = serializers.CharField(max_length=255, allow_null=True)
    photo_url = serializers.ImageField()
    address = serializers.CharField(max_length=255, allow_null=True)
    class Meta:
        model = Photos
        fields = '__all__'

class RequestSerializer(serializers.ModelSerializer):
    type_id = serializers.IntegerField()
    user_login = serializers.IntegerField()
    comment = serializers.CharField(max_length=255, allow_null=True)
    class Meta:
        model = Requests
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    login = serializers.IntegerField()
    email = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255)
    user_status = serializers.CharField(max_length=255, allow_null=True)

    class Meta:
        model = Users
        fields = '__all__'