from django.contrib import admin
from .models import RFQ, B2BOrder, B2BOrderItem


class B2BOrderItemInline(admin.TabularInline):
    model = B2BOrderItem
    extra = 0
    readonly_fields = ['subtotal']


@admin.register(RFQ)
class RFQAdmin(admin.ModelAdmin):
    list_display = ['id', 'product_name', 'buyer', 'quantity', 'target_price', 'status', 'created_at']
    list_filter  = ['status', 'created_at']
    search_fields = ['product_name', 'buyer__username', 'contact_email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-created_at']


@admin.register(B2BOrder)
class B2BOrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'buyer', 'status', 'total_amount', 'created_at']
    list_filter  = ['status', 'created_at']
    search_fields = ['order_number', 'buyer__username']
    readonly_fields = ['id', 'order_number', 'created_at', 'updated_at']
    inlines = [B2BOrderItemInline]
    ordering = ['-created_at']