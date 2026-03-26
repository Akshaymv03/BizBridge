from django.db import models
import uuid

class Category(models.Model):
    BUSINESS_MODEL_CHOICES = [
        ('B2B', 'Business to Business'),
        ('B2C', 'Business to Consumer'),
        ('C2C', 'Consumer to Consumer'),
    ]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name         = models.CharField(max_length=100)
    slug         = models.SlugField(unique=True)
    parent       = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    business_model = models.CharField(
        max_length=3,
        choices=BUSINESS_MODEL_CHOICES,
        default='B2C',
        help_text='Which portal this category belongs to'
    )
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return f"[{self.business_model}] {self.name}"


class Product(models.Model):
    BUSINESS_MODEL_CHOICES = [
        ('B2B', 'Business to Business'),
        ('B2C', 'Business to Consumer'),
        ('C2C', 'Consumer to Consumer'),
    ]

    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name                = models.CharField(max_length=255)
    slug                = models.SlugField(unique=True)
    description         = models.TextField()
    price               = models.DecimalField(max_digits=10, decimal_places=2)
    bulk_price          = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    business_models     = models.JSONField(default=list, blank=True)
    category            = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    seller              = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='products')
    stock_quantity      = models.PositiveIntegerField(default=0)
    min_order_quantity  = models.PositiveIntegerField(default=1)
    image               = models.ImageField(upload_to='products/', null=True, blank=True)
    is_active           = models.BooleanField(default=True)
    featured            = models.BooleanField(default=False)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name