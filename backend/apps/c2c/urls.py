from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'c2c'

router = DefaultRouter()
router.register(r'c2c/listings', views.C2CListingViewSet, basename='c2c-listing')

urlpatterns = [
    path('', include(router.urls)),
]