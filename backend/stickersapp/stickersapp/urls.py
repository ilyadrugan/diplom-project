"""stickersapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework import routers
from .views_api import *
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
# ViewSets define the view behavior.

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
# router.register(r'types', TypeViewSet.as_view())
# router.register(r'photos', PhotoViewSet)
# router.register(r'requests', RequestViewSet)


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('types/', TypeViewSet.as_view()),
    path('types/<int:pk>', TypeViewObject.as_view()),
    path('photos/', PhotoViewSet.as_view()),
    path('requests/', RequestViewSet.as_view()),
    path('users/', UserViewSet.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)