from rest_framework import serializers
from .models import RFQ, B2BOrder, B2BOrderItem


class RFQSerializer(serializers.ModelSerializer):
    buyer_username = serializers.CharField(source='buyer.username', read_only=True)

    class Meta:
        model = RFQ
        fields = [
            'id', 'buyer', 'buyer_username',
            'product', 'product_name',
            'quantity', 'target_price',
            'delivery_terms', 'payment_terms', 'delivery_timeline',
            'destination', 'message',
            'company_name', 'contact_name', 'contact_email', 'contact_phone',
            'status', 'quoted_price', 'supplier_notes',
            'created_at', 'updated_at',
        ]
        # ✅ removed 'status' from read_only_fields
        read_only_fields = ['id', 'buyer', 'quoted_price', 'supplier_notes', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['buyer'] = self.context['request'].user
        return super().create(validated_data)

    # ✅ ONLY allow "unavailable" status update
    def update(self, instance, validated_data):
        new_status = validated_data.get('status')

        if new_status == 'unavailable':
            instance.status = 'unavailable'

        # ❌ block all other status updates
        validated_data.pop('status', None)

        return super().update(instance, validated_data)


class RFQListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    class Meta:
        model = RFQ
        fields = [
            'id', 'product_name', 'quantity', 'target_price',
            'destination', 'status', 'quoted_price', 'created_at',
        ]


class B2BOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = B2BOrderItem
        fields = ['id', 'product', 'product_name', 'unit_price', 'quantity', 'subtotal']
        read_only_fields = ['subtotal']


class B2BOrderSerializer(serializers.ModelSerializer):
    items = B2BOrderItemSerializer(many=True, read_only=True)
    buyer_username = serializers.CharField(source='buyer.username', read_only=True)

    class Meta:
        model = B2BOrder
        fields = [
            'id', 'buyer', 'buyer_username', 'rfq',
            'order_number', 'status', 'total_amount', 'notes',
            'items', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'buyer', 'order_number', 'created_at', 'updated_at']

    def create(self, validated_data):
        import random, string
        validated_data['buyer'] = self.context['request'].user
        validated_data['order_number'] = 'B2B' + ''.join(
            random.choices(string.ascii_uppercase + string.digits, k=10)
        )
        return super().create(validated_data)


class DashboardStatsSerializer(serializers.Serializer):
    total_rfqs     = serializers.IntegerField()
    pending_rfqs   = serializers.IntegerField()
    active_orders  = serializers.IntegerField()
    total_spent    = serializers.DecimalField(max_digits=12, decimal_places=2)