from rest_framework import serializers
from apps.products.models import Product, Category
from .models import C2CListing
import uuid
import re


def generate_slug(name):
    """Generate a unique slug from product name"""
    base = re.sub(r'[^\w\s-]', '', name.lower())
    base = re.sub(r'[\s_-]+', '-', base).strip('-')
    unique = str(uuid.uuid4())[:8]
    return f"{base}-{unique}"


class C2CListingSerializer(serializers.ModelSerializer):
    """Read serializer — flattens product fields for frontend"""
    id             = serializers.UUIDField(source='product.id', read_only=True)
    name           = serializers.CharField(source='product.name', read_only=True)
    description    = serializers.CharField(source='product.description', read_only=True)
    price          = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    image          = serializers.SerializerMethodField()
    category_name  = serializers.SerializerMethodField()
    seller_name    = serializers.CharField(source='product.seller.username', read_only=True)
    seller         = serializers.CharField(source='product.seller.id', read_only=True)
    stock_quantity = serializers.IntegerField(source='product.stock_quantity', read_only=True)
    is_active      = serializers.BooleanField(source='product.is_active', read_only=True)
    created_at     = serializers.DateTimeField(source='product.created_at', read_only=True)

    class Meta:
        model = C2CListing
        fields = [
            'id', 'name', 'description', 'price', 'image',
            'category_name', 'seller_name', 'seller',
            'stock_quantity', 'is_active', 'created_at',
            'condition', 'contact_email', 'contact_phone', 'is_sold',
        ]

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            url = obj.product.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None

    def get_category_name(self, obj):
        if obj.product.category:
            return obj.product.category.name
        return None


class C2CListingCreateSerializer(serializers.Serializer):
    """Write serializer — creates Product + C2CListing in one shot"""
    name           = serializers.CharField(max_length=255)
    description    = serializers.CharField()
    price          = serializers.DecimalField(max_digits=10, decimal_places=2)
    category       = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )
    stock_quantity = serializers.IntegerField(default=1, min_value=1)
    image          = serializers.ImageField(required=False, allow_null=True)
    condition      = serializers.ChoiceField(
        choices=C2CListing.CONDITION_CHOICES, default='good'
    )
    contact_email  = serializers.EmailField(required=False, allow_blank=True, default='')
    contact_phone  = serializers.CharField(
        max_length=30, required=False, allow_blank=True, default=''
    )

    def create(self, validated_data):
        request = self.context['request']

        # Pop C2CListing-specific fields
        condition     = validated_data.pop('condition', 'good')
        contact_email = validated_data.pop('contact_email', '')
        contact_phone = validated_data.pop('contact_phone', '')

        # Generate unique slug
        validated_data['slug'] = generate_slug(validated_data['name'])

        # Create the base product
        product = Product.objects.create(
            seller=request.user,
            business_models=['C2C'],
            min_order_quantity=1,
            is_active=True,
            **validated_data,
        )

        # Create the C2C listing wrapper
        listing = C2CListing.objects.create(
            product=product,
            condition=condition,
            contact_email=contact_email,
            contact_phone=contact_phone,
        )
        return listing

    def update(self, instance, validated_data):
        condition     = validated_data.pop('condition', instance.condition)
        contact_email = validated_data.pop('contact_email', instance.contact_email)
        contact_phone = validated_data.pop('contact_phone', instance.contact_phone)

        product = instance.product
        for attr, value in validated_data.items():
            setattr(product, attr, value)
        product.save()

        instance.condition     = condition
        instance.contact_email = contact_email
        instance.contact_phone = contact_phone
        instance.save()
        return instance