from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'full_name', 'total', 'order_status', 'payment_status', 'created_at']
    list_filter = ['order_status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'user__username', 'user__email', 'full_name', 'email']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'order_status', 'payment_status', 'payment_method')
        }),
        ('Shipping Information', {
            'fields': ('full_name', 'email', 'phone', 'address', 'city', 'state', 'zip_code', 'country')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'tax', 'shipping_cost', 'total')
        }),
        ('Tracking', {
            'fields': ('tracking_number', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'product_price', 'subtotal']
    list_filter = ['created_at']
    search_fields = ['order__order_number', 'product_name']