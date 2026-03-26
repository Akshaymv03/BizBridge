from django.contrib import admin
from .models import C2CListing


@admin.register(C2CListing)
class C2CListingAdmin(admin.ModelAdmin):
    list_display  = ['__str__', 'condition', 'is_sold', 'contact_email', 'created_at']
    list_filter   = ['condition', 'is_sold', 'created_at']
    search_fields = ['product__name', 'contact_email']
    readonly_fields = ['created_at', 'updated_at']