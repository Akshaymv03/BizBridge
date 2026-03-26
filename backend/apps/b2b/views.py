from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import RFQ, B2BOrder
from .serializers import (
    RFQSerializer, RFQListSerializer,
    B2BOrderSerializer, DashboardStatsSerializer,
)


class RFQViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RFQSerializer

    def get_queryset(self):
        return RFQ.objects.filter(buyer=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return RFQListSerializer
        return RFQSerializer

    @action(detail=False, methods=['get'])
    def my_quotes(self, request):
        """Alias used by the frontend — returns the buyer's RFQ list"""
        queryset = self.get_queryset()
        serializer = RFQListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        rfq = self.get_object()
        if rfq.status in ['accepted', 'cancelled']:
            return Response(
                {'error': f'Cannot cancel an RFQ with status "{rfq.status}"'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        rfq.status = 'cancelled'
        rfq.save()
        return Response(RFQSerializer(rfq).data)


class B2BOrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = B2BOrderSerializer

    def get_queryset(self):
        return B2BOrder.objects.filter(buyer=self.request.user).prefetch_related('items')

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in ['shipped', 'delivered']:
            return Response(
                {'error': 'Cannot cancel a shipped or delivered order'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = 'cancelled'
        order.save()
        return Response(B2BOrderSerializer(order).data)


class B2BDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        rfqs   = RFQ.objects.filter(buyer=user)
        orders = B2BOrder.objects.filter(buyer=user)

        total_spent = orders.filter(status='delivered').aggregate(
            total=Sum('total_amount')
        )['total'] or 0

        data = {
            'total_rfqs':    rfqs.count(),
            'pending_rfqs':  rfqs.filter(status='pending').count(),
            'active_orders': orders.exclude(status__in=['delivered', 'cancelled']).count(),
            'total_spent':   total_spent,
        }
        return Response(data)

    @action(detail=False, methods=['get'])
    def activity(self, request):
        user = request.user
        rfqs = RFQ.objects.filter(buyer=user).order_by('-created_at')[:5]
        orders = B2BOrder.objects.filter(buyer=user).order_by('-created_at')[:5]

        activity = []
        for rfq in rfqs:
            activity.append({
                'type': 'rfq',
                'id': str(rfq.id),
                'label': f'RFQ for {rfq.product_name}',
                'status': rfq.status,
                'date': rfq.created_at,
            })
        for order in orders:
            activity.append({
                'type': 'order',
                'id': str(order.id),
                'label': f'Order {order.order_number}',
                'status': order.status,
                'date': order.created_at,
            })

        activity.sort(key=lambda x: x['date'], reverse=True)
        return Response(activity[:10])