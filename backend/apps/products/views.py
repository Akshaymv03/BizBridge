from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Min, Max
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset           = Product.objects.filter(is_active=True)
    serializer_class   = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['name', 'description']
    ordering_fields    = ['created_at', 'price', 'name']
    ordering           = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()

        # Business model filter
        business_model = self.request.query_params.get('business_model')
        if business_model:
            queryset = queryset.filter(business_models__icontains=business_model)

        # Category filter
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)

        # Price range filter
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Featured filter
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(featured=True)

        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)

        return queryset

    @action(detail=False, methods=['get'])
    def search_suggestions(self, request):
        query = request.query_params.get('q', '')
        if len(query) < 2:
            return Response([])

        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query),
            is_active=True
        )[:10]

        suggestions = [
            {
                'id': str(p.id),
                'name': p.name,
                'price': str(p.price),
                'image': p.image.url if p.image else None
            }
            for p in products
        ]
        return Response(suggestions)

    @action(detail=False, methods=['get'])
    def price_range(self, request):
        prices = Product.objects.filter(is_active=True).aggregate(
            min_price=Min('price'),
            max_price=Max('price')
        )
        return Response(prices)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter categories by business model if provided
        business_model = self.request.query_params.get('business_model')
        if business_model:
            queryset = queryset.filter(business_model=business_model)

        return queryset

    @action(detail=False, methods=['get'])
    def with_product_count(self, request):
        """Get categories with product count — filtered by business model"""
        business_model = request.query_params.get('business_model')

        categories = Category.objects.all()
        if business_model:
            categories = categories.filter(business_model=business_model)

        data = []
        for cat in categories:
            # Count only products matching this business model
            products = cat.products.filter(is_active=True)
            if business_model:
                products = products.filter(business_models__icontains=business_model)

            count = products.count()
            if count > 0:  # only return categories that have products
                data.append({
                    'id':            str(cat.id),
                    'name':          cat.name,
                    'slug':          cat.slug,
                    'business_model': cat.business_model,
                    'product_count': count,
                })

        return Response(data)