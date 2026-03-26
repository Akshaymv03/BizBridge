from django.db import models
from core.models import TimeStampedModel
import uuid


class RFQ(TimeStampedModel):
    """Request for Quote — buyer submits, suppliers respond"""

    STATUS_CHOICES = [
        ('unavailable', 'Unavailable'),
        ('pending',   'Pending'),
        ('responded', 'Responded'),
        ('accepted',  'Accepted'),
        ('rejected',  'Rejected'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Buyer
    buyer = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='rfqs'
    )

    # Product reference (optional — buyer may request without a specific product)
    product = models.ForeignKey(
        'products.Product', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='rfqs'
    )
    product_name = models.CharField(max_length=255)

    # Requirements
    quantity         = models.PositiveIntegerField()
    target_price     = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    delivery_terms   = models.CharField(max_length=100, blank=True)
    payment_terms    = models.CharField(max_length=100, blank=True)
    delivery_timeline = models.CharField(max_length=100, blank=True)
    destination      = models.CharField(max_length=255)
    message          = models.TextField(blank=True)

    # Contact
    company_name  = models.CharField(max_length=255, blank=True)
    contact_name  = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=30, blank=True)

    # Supplier response
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    quoted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    supplier_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"RFQ #{self.id} — {self.product_name} ({self.buyer.username})"


class B2BOrder(TimeStampedModel):
    """Bulk order placed after an accepted RFQ"""

    STATUS_CHOICES = [
        ('pending',    'Pending'),
        ('processing', 'Processing'),
        ('shipped',    'Shipped'),
        ('delivered',  'Delivered'),
        ('cancelled',  'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='b2b_orders'
    )
    rfq = models.OneToOneField(
        RFQ, on_delete=models.SET_NULL, null=True, blank=True, related_name='order'
    )

    order_number  = models.CharField(max_length=50, unique=True)
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount  = models.DecimalField(max_digits=12, decimal_places=2)
    notes         = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"B2BOrder {self.order_number} — {self.buyer.username}"


class B2BOrderItem(TimeStampedModel):
    order        = models.ForeignKey(B2BOrder, on_delete=models.CASCADE, related_name='items')
    product      = models.ForeignKey('products.Product', on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=255)
    unit_price   = models.DecimalField(max_digits=10, decimal_places=2)
    quantity     = models.PositiveIntegerField()
    subtotal     = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        self.subtotal = self.unit_price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"