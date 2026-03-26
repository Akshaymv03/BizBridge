from django.db import models
from core.models import TimeStampedModel


class C2CListing(TimeStampedModel):
    """
    Thin wrapper around products.Product for C2C-specific fields.
    The product itself lives in products.Product with business_models=['C2C'].
    This model adds condition, contact info, and marks it as a C2C listing.
    """
    CONDITION_CHOICES = [
        ('new',       'New'),
        ('like_new',  'Like New'),
        ('good',      'Good'),
        ('fair',      'Fair'),
        ('for_parts', 'For Parts / Not Working'),
    ]

    product = models.OneToOneField(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='c2c_listing'
    )
    condition      = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    contact_email  = models.EmailField(blank=True)
    contact_phone  = models.CharField(max_length=30, blank=True)
    is_sold        = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"C2C: {self.product.name} [{self.condition}]"