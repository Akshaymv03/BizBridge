from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer, OrderListSerializer

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'list':
            return OrderListSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Return full order details
        output_serializer = OrderSerializer(order)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order"""
        order = self.get_object()
        
        if order.order_status in ['SHIPPED', 'DELIVERED']:
            return Response(
                {'error': 'Cannot cancel shipped or delivered orders'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.order_status = 'CANCELLED'
        order.save()
        
        return Response(OrderSerializer(order).data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get order statistics for the user"""
        orders = self.get_queryset()
        
        stats = {
            'total_orders': orders.count(),
            'pending_orders': orders.filter(order_status='PENDING').count(),
            'completed_orders': orders.filter(order_status='DELIVERED').count(),
            'total_spent': sum(order.total for order in orders.filter(payment_status='COMPLETED'))
        }
        
        return Response(stats)