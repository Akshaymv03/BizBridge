from django.urls import path
from . import views

urlpatterns = [
    path('create-order/', views.create_razorpay_order, name='create-razorpay-order'),
    path('verify/', views.verify_payment, name='verify-payment'),
    path('failed/', views.payment_failed, name='payment-failed'),
]