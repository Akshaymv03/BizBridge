from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'payment_method', 'payment_status', 'amount', 'created_at']
    list_filter = ['payment_method', 'payment_status', 'created_at']
    search_fields = ['order__order_number', 'razorpay_order_id', 'razorpay_payment_id', 'transaction_id']
    readonly_fields = ['created_at', 'updated_at']