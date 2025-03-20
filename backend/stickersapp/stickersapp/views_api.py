from django.http import Http404
from geopy.geocoders import Nominatim
from .permissions import Check_API_KEY_Auth
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime

class TypeViewSet(APIView):
    serializer_class = TypeSerializer
    model = Types
    permission_classes = (Check_API_KEY_Auth,)

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
    permission_classes = (Check_API_KEY_Auth,)

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
    permission_classes = (Check_API_KEY_Auth,)
    serializer_class = PhotoSerializer
    model = Photos
    def get(self, request):
        photos = Photos.objects.all()
        serializer = PhotoSerializer(photos, many=True)
        return Response({"data": serializer.data})

    def post(self, request):
        print('request.data',request.data)
        coord_long = float(request.data.get("coord_long"))
        coord_lat = float(request.data.get("coord_lat"))
        geolocator = Nominatim(user_agent="stickers_app")
        location = geolocator.reverse(f"{coord_lat}, {coord_long}")
        request.data.update({'address': location.address})
        print('request.data',request.data)
        serializer_for_writing = self.serializer_class(data=request.data)
        serializer_for_writing.is_valid(raise_exception=True)
        serializer_for_writing.save()
        return Response(data=serializer_for_writing.data, status=201)


class RequestViewSet(APIView):
    permission_classes = (Check_API_KEY_Auth,)
    serializer_class = RequestSerializer
    model = Requests
    def get(self, request):
        requests = Requests.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response({"data": serializer.data})

    def post(self, request):
        serializer_for_writing = self.serializer_class(data=request.data)
        serializer_for_writing.is_valid(raise_exception=True)
        serializer_for_writing.save()
        return Response(data=serializer_for_writing.data, status=201)

class UserViewSet(APIView):
    permission_classes = (Check_API_KEY_Auth,)
    serializer_class = UserSerializer
    model = Users
    def get(self, request):
        requests = Users.objects.all()
        serializer = UserSerializer(requests, many=True)
        return Response({"data": serializer.data})

    def post(self, request):
        serializer_for_writing = self.serializer_class(data=request.data)
        serializer_for_writing.is_valid(raise_exception=True)
        serializer_for_writing.save()
        return Response(data=serializer_for_writing.data, status=201)
