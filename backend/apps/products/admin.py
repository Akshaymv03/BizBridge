from django.contrib import admin
from .models import Product, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent', 'created_at']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'seller', 'is_active', 'created_at']
    list_filter = ['is_active', 'featured', 'business_models', 'category']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
