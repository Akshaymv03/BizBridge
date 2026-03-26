from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_method', 'payment_status', 'amount', 
                  'currency', 'razorpay_order_id', 'transaction_id', 'created_at']
        read_only_fields = ['id', 'razorpay_order_id', 'created_at']

class CreateRazorpayOrderSerializer(serializers.Serializer):
    order_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()
    order_id = serializers.UUIDField()