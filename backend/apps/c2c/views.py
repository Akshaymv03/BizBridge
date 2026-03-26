from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import C2CListing
from .serializers import C2CListingSerializer, C2CListingCreateSerializer


class C2CListingViewSet(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return C2CListing.objects.select_related(
            'product', 'product__category', 'product__seller'
        ).filter(product__is_active=True)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return C2CListingCreateSerializer
        return C2CListingSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        serializer = C2CListingCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        listing = serializer.save()
        output = C2CListingSerializer(listing, context={'request': request})
        return Response(output.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if instance.product.seller != request.user:
            return Response(
                {'error': 'You can only edit your own listings'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = C2CListingCreateSerializer(
            instance, data=request.data,
            partial=partial,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        listing = serializer.save()
        return Response(
            C2CListingSerializer(listing, context={'request': request}).data
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.product.seller != request.user:
            return Response(
                {'error': 'You can only delete your own listings'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.product.delete()  # cascades to C2CListing
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_listings(self, request):
        """Return only the current user's C2C listings"""
        qs = C2CListing.objects.filter(
            product__seller=request.user
        ).select_related('product', 'product__category', 'product__seller')
        serializer = C2CListingSerializer(
            qs, many=True, context={'request': request}
        )
        return Response(serializer.data)