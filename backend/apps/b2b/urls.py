from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'b2b'

router = DefaultRouter()
router.register(r'b2b/rfq',    views.RFQViewSet,       basename='b2b-rfq')
router.register(r'b2b/orders', views.B2BOrderViewSet,  basename='b2b-order')
router.register(r'b2b/dashboard', views.B2BDashboardViewSet, basename='b2b-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]