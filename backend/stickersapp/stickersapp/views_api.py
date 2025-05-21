import random

from django.http import Http404
from geopy.geocoders import Nominatim
from rest_framework import status

from .permissions import Check_API_KEY_Auth
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime

class LoginView(APIView):
    def post(self, request):
        print('request.data',request.data['login'], request.data['password'])
        try:
            user = Users.objects.get(email=request.data['login'])
            userSerializer = UserSerializer(user)
            print(userSerializer['password'].value, userSerializer['email'].value)
            if (userSerializer['password'].value == request.data['password']):
                print('GRAZ', userSerializer.data)
                return Response({'data':userSerializer.data}, status=status.HTTP_200_OK)
            return Response('Неверный логин или пароль', status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response('Неверный логин или пароль', status=status.HTTP_400_BAD_REQUEST)
        # if not user:
        #     return Response('Неверный логин или пароль', status=status.HTTP_400_BAD_REQUEST)
        # userSerializer = UserSerializer(user)
        # print(userSerializer['password'].value, userSerializer['email'])
        # if (userSerializer['password'].value == request.data['password']):
        #     return Response('Authed', status=status.HTTP_200_OK)
        # # serializer = LoginSerializer(data=request.data)
        # #
        # # if serializer.is_valid():
        # #     result = serializer.save()
        # #
        # # return Response('result', status=status.HTTP_200_OK)


class TypeViewSet(APIView):
    serializer_class = TypeSerializer
    model = Types
    # permission_classes = (Check_API_KEY_Auth,)

    def get_queryset(self):
        types = Types.objects.all()
        return types
    def get(self, request, *args, **kwargs):

        try:
            id = request.query_params["id"]
            print(id, request)
            if id != None:
                type = Types.objects.get(id=id)
                serializer = TypeSerializer(type)
        except:
            types = self.get_queryset()
            serializer = TypeSerializer(types, many=True)

        return Response({'data':serializer.data})

    def post(self, request):
        serializer_for_writing = self.serializer_class(data=request.data)
        serializer_for_writing.is_valid(raise_exception=True)
        serializer_for_writing.save()
        return Response(data=serializer_for_writing.data, status=201)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=204)
class TypeViewObject(APIView):
    # permission_classes = (Check_API_KEY_Auth,)

    def get_object(self, pk):
        try:
            return Types.objects.get(pk=pk)
        except Types.DoesNotExist:
            return "DoesNotExist"

    def get(self, request, pk, format=None):
        type = self.get_object(pk)
        serializer = TypeSerializer(type)
        return Response({'data':serializer.data})

    def put(self, request, pk, format=None):
        type = self.get_object(pk)
        serializer = TypeSerializer(type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk, format=None):
        type = self.get_object(pk)
        type.delete()
        return Response(status=204)

class PhotoViewSet(APIView):
    # permission_classes = (Check_API_KEY_Auth,)
    serializer_class = PhotoSerializer
    model = Photos
    def get(self, request):
        photos = Photos.objects.all()
        serializer = PhotoSerializer(photos, many=True)
        return Response({"data": serializer.data})

    def post(self, request):
        coord_long = float(request.data.get("coord_long"))
        coord_lat = float(request.data.get("coord_lat"))
        geolocator = Nominatim(user_agent="stickers_app")
        location = geolocator.reverse(f"{coord_lat}, {coord_long}")
        data = request.data.copy()
        data['address'] = location.address
        data['coord_lat'] = coord_lat
        data['coord_long'] = coord_long
        data['request'] = request.data.get("request_id")
        serializer_for_writing = self.serializer_class(data=data)
        serializer_for_writing.is_valid(raise_exception=True)
        serializer_for_writing.save()
        return Response(data=serializer_for_writing.data, status=201)


class RequestViewSet(APIView):
    serializer_class = RequestSerializer
    model = Requests

    def get(self, request):
        request_id = request.query_params.get('id')  # Получаем ?id из запроса
        if request_id:
            try:
                request_obj = Requests.objects.get(id=request_id)
                serializer = self.serializer_class(request_obj)
                return Response({"data": serializer.data})
            except Requests.DoesNotExist:
                return Response({"error": "Заявка не найдена"}, status=status.HTTP_404_NOT_FOUND)
        else:
            requests = Requests.objects.all()
            serializer = self.serializer_class(requests, many=True)
            return Response({"data": serializer.data})

    def post(self, request):
        print('request.data',request.data)

        serializer_for_writing = self.serializer_class(data=request.data)
        serializer_for_writing.is_valid(raise_exception=True)
        serializer_for_writing.save()
        return Response(data=serializer_for_writing.data, status=201)

    def patch(self, request):
        request_id = request.data.get("id")
        new_status = request.data.get("status")

        if not request_id or new_status is None:
            return Response({"error": "Нужны поля 'id' и 'status'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            request_obj = Requests.objects.get(id=request_id)
        except Requests.DoesNotExist:
            return Response({"error": "Заявка не найдена"}, status=status.HTTP_404_NOT_FOUND)

        request_obj.status = new_status
        request_obj.save()

        serializer = self.serializer_class(request_obj)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)


class UserViewSet(APIView):
    # permission_classes = (Check_API_KEY_Auth,)
    serializer_class = UserSerializer
    model = Users
    def get(self, request):
        user_id = request.query_params.get('id')  # Получаем ?id из запроса
        if user_id:
            try:
                user = Users.objects.get(id=user_id)
                serializer = self.serializer_class(user)
                return Response({"data": serializer.data})
            except Requests.DoesNotExist:
                return Response({"error": "Заявка не найдена"}, status=status.HTTP_404_NOT_FOUND)
        else:
            users = Users.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response({"data": serializer.data})

    def put(self, request, *args, **kwargs):
        user_id = kwargs.get("pk") or request.data.get("id")
        if not user_id:
            return Response({"error": "Не передан ID пользователя"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Users.objects.get(id=user_id)
        except Users.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        # Генерация уникального 5-значного числа
        existing_numbers = set(
            Users.objects.values_list("login", flat=True))  # замените "login", если нужно другое поле

        max_attempts = 10000
        for _ in range(max_attempts):
            generated_login = random.randint(10000, 99999)
            if generated_login not in existing_numbers:
                break
        else:
            return Response({"error": "Не удалось сгенерировать уникальный логин"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Объединяем с остальными данными
        data_with_login = request.data.copy()
        data_with_login["login"] = generated_login

        # Сохраняем пользователя
        serializer_for_writing = self.serializer_class(data=data_with_login)
        serializer_for_writing.is_valid(raise_exception=True)
        serializer_for_writing.save()

        return Response(data=serializer_for_writing.data, status=201)