from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_details', 'product_name',
            'product_price', 'quantity', 'subtotal', 'created_at'
        ]
        read_only_fields = ['id', 'subtotal', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_email', 'order_number', 'full_name', 'email',
            'phone', 'address', 'city', 'state', 'zip_code', 'country',
            'subtotal', 'tax', 'shipping_cost', 'total', 'order_status',
            'payment_status', 'payment_method', 'tracking_number', 'notes',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'order_number', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(write_only=True)

    class Meta:
        model = Order
        fields = [
            'full_name', 'email', 'phone', 'address', 'city', 'state',
            'zip_code', 'country', 'payment_method', 'notes', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        # ── Frontend sends either of these field names ──────────────────────
        # Cart items:  { product, product_name, product_price, quantity }
        # C2C items:   { product, product_name, product_price, quantity }
        # Legacy:      { product_id, name, price, quantity }
        # Handle all variants safely:
        def get_field(item, *keys, default=0):
            for k in keys:
                if k in item and item[k] is not None:
                    return item[k]
            return default

        # Calculate totals
        subtotal = sum(
            float(get_field(item, 'product_price', 'price', default=0)) *
            int(get_field(item, 'quantity', default=1))
            for item in items_data
        )
        tax           = round(subtotal * 0.1, 2)   # 10% tax
        shipping_cost = 50 if subtotal < 500 else 0
        total         = subtotal + tax + shipping_cost

        # Generate unique order number
        order_number = Order().generate_order_number()

        # Create order
        order = Order.objects.create(
            user=user,
            order_number=order_number,
            subtotal=subtotal,
            tax=tax,
            shipping_cost=shipping_cost,
            total=total,
            **validated_data
        )

        # Create order items — handle both field name conventions
        for item_data in items_data:
            product_id    = get_field(item_data, 'product', 'product_id', default=None)
            product_name  = get_field(item_data, 'product_name', 'name', default='Unknown Product')
            product_price = float(get_field(item_data, 'product_price', 'price', default=0))
            quantity      = int(get_field(item_data, 'quantity', default=1))

            OrderItem.objects.create(
                order=order,
                product_id=product_id,
                product_name=str(product_name),
                product_price=product_price,
                quantity=quantity,
            )

        return order


class OrderListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for order lists"""
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'total', 'order_status',
            'payment_status', 'item_count', 'created_at'
        ]

    def get_item_count(self, obj):
        return obj.items.count()