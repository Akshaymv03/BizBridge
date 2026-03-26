from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import Payment
from apps.orders.models import Order
from .serializers import (
    PaymentSerializer,
    CreateRazorpayOrderSerializer,
    VerifyPaymentSerializer
)
import razorpay
import hmac
import hashlib

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_razorpay_order(request):
    """Create a Razorpay order for payment"""
    serializer = CreateRazorpayOrderSerializer(data=request.data)
    
    if serializer.is_valid():
        order_id = serializer.validated_data['order_id']
        amount = serializer.validated_data['amount']
        
        try:
            # Get the order
            order = Order.objects.get(id=order_id, user=request.user)
            
            # Create Razorpay order
            razorpay_order = razorpay_client.order.create({
                'amount': int(float(amount) * 100),  # Convert to paise
                'currency': 'INR',
                'payment_capture': 1,
                'notes': {
                    'order_id': str(order.id),
                    'order_number': order.order_number
                }
            })
            
            # Create Payment record
            payment = Payment.objects.create(
                order=order,
                payment_method='CARD',  # Will be updated after payment
                amount=amount,
                razorpay_order_id=razorpay_order['id']
            )
            
            return Response({
                'razorpay_order_id': razorpay_order['id'],
                'razorpay_key_id': settings.RAZORPAY_KEY_ID,
                'amount': razorpay_order['amount'],
                'currency': razorpay_order['currency'],
                'order_number': order.order_number
            })
        
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """Verify Razorpay payment signature"""
    serializer = VerifyPaymentSerializer(data=request.data)
    
    if serializer.is_valid():
        razorpay_order_id = serializer.validated_data['razorpay_order_id']
        razorpay_payment_id = serializer.validated_data['razorpay_payment_id']
        razorpay_signature = serializer.validated_data['razorpay_signature']
        order_id = serializer.validated_data['order_id']
        
        try:
            # Verify signature
            generated_signature = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode(),
                f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
                hashlib.sha256
            ).hexdigest()
            
            if generated_signature == razorpay_signature:
                # Update payment
                payment = Payment.objects.get(razorpay_order_id=razorpay_order_id)
                payment.razorpay_payment_id = razorpay_payment_id
                payment.razorpay_signature = razorpay_signature
                payment.payment_status = 'COMPLETED'
                payment.save()
                
                # Update order
                order = payment.order
                order.payment_status = 'COMPLETED'
                order.order_status = 'PROCESSING'
                order.save()
                
                return Response({
                    'status': 'success',
                    'message': 'Payment verified successfully',
                    'order_number': order.order_number
                })
            else:
                return Response(
                    {'error': 'Invalid signature'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        except Payment.DoesNotExist:
            return Response(
                {'error': 'Payment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payment_failed(request):
    """Handle payment failure"""
    razorpay_order_id = request.data.get('razorpay_order_id')
    error_message = request.data.get('error_message', 'Payment failed')
    
    try:
        payment = Payment.objects.get(razorpay_order_id=razorpay_order_id)
        payment.payment_status = 'FAILED'
        payment.error_message = error_message
        payment.save()
        
        return Response({'status': 'Payment marked as failed'})
    except Payment.DoesNotExist:
        return Response(
            {'error': 'Payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
        