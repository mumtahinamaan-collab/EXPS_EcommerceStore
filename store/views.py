from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

import stripe
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from datetime import timedelta
import uuid
import random

from.models import (
    User, Product, Category, Cart, Order, OrderItem, Payment, Tracking,
)
from.serializers import (
    ProductSerializer, CategorySerializer, CartSerializer, OrderSerializer,
)

# ============================================================
# CATEGORY / PRODUCTS (Same)
# ============================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True, context={"request": request})
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def random_products(request):
    products = list(Product.objects.all())
    random.shuffle(products)
    serializer = ProductSerializer(products[:8], many=True, context={"request": request})
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def list_product(request):
    products = Product.objects.all().order_by("-id")
    category = request.GET.get("category")
    if category:
        products = products.filter(category__name__iexact=category)
    serializer = ProductSerializer(products, many=True, context={"request": request})
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    serializer = ProductSerializer(product, context={"request": request})
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def product_search(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return Response([])
    products = Product.objects.filter(name__icontains=query)
    serializer = ProductSerializer(products, many=True, context={"request": request})
    return Response(serializer.data)

# ============================================================
# AUTH
# ============================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    first_name = request.data.get("first_name","").strip()
    last_name = request.data.get("last_name","").strip()
    email = request.data.get("email","").strip().lower()
    password = request.data.get("password")
    if not first_name or not last_name or not email or not password:
        return Response({"message": "All fields are required"}, status=400)
    if len(password) < 8:
        return Response({"message": "Password must be at least 8 characters"}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({"message": "Email already registered"}, status=400)
    user = User.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
    return Response({"message": "Registered successfully", "user_id": user.id}, status=201)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email","").strip().lower()
    password = request.data.get("password")
    if not email or not password:
        return Response({"message": "Email and password are required"}, status=400)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "Invalid email or password"}, status=401)
    if not user.is_active or not check_password(password, user.password):
        return Response({"message": "Invalid email or password"}, status=401)
    refresh = RefreshToken.for_user(user)
    return Response({
        "message": "Login successful",
        "userId": user.id,
        "userName": f"{user.first_name} {user.last_name}",
        "email": user.email,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }, status=200)

@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get("email","").strip().lower()
    if not email:
        return Response({"message": "Email is required"}, status=400)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "No account found with this email"}, status=404)
    token = uuid.uuid4().hex
    user.reset_token = token
    user.reset_token_created = timezone.now()
    user.save(update_fields=["reset_token", "reset_token_created"])
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    send_mail(
        subject="Shopora - Reset Your Password",
        message=f"Hello {user.first_name},\n\nReset link: {reset_link}\n\nExpires in 15 min.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
    return Response({"message": "Password reset link has been sent to your email"}, status=200)

@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    token = request.data.get("token")
    password = request.data.get("password")
    if not token or not password:
        return Response({"message": "Token and password are required"}, status=400)
    try:
        user = User.objects.get(reset_token=token)
    except User.DoesNotExist:
        return Response({"message": "Invalid or expired token"}, status=400)
    if not user.reset_token_created or timezone.now() > user.reset_token_created + timedelta(minutes=15):
        return Response({"message": "Reset token has expired"}, status=400)
    if len(password) < 8:
        return Response({"message": "Password must be at least 8 characters"}, status=400)
    user.set_password(password)
    user.reset_token = None
    user.reset_token_created = None
    user.save(update_fields=["password", "reset_token", "reset_token_created"])
    return Response({"message": "Password reset successfully"}, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response({"id": request.user.id, "email": request.user.email, "name": f"{request.user.first_name} {request.user.last_name}"})

# ============================================================
# CART
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart_items(request):
    carts = Cart.objects.filter(user=request.user).select_related("product")
    serializer = CartSerializer(carts, many=True, context={"request": request})
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("productId")
    quantity = int(request.data.get("quantity", 1))
    if not product_id:
        return Response({"message": "Product ID is required"}, status=400)
    product = get_object_or_404(Product, id=product_id)
    if not product.in_stock or product.quantity <= 0:
        return Response({"message": "Product is out of stock"}, status=400)
    if quantity > product.quantity:
        return Response({"message": f"Only {product.quantity} items are available"}, status=400)
    cart, created = Cart.objects.get_or_create(user=request.user, product=product, defaults={"quantity": quantity})
    if not created:
        if cart.quantity + quantity > product.quantity:
            return Response({"message": f"Only {product.quantity} items are available"}, status=400)
        cart.quantity += quantity
        cart.save(update_fields=["quantity"])
    return Response({"message": "Product added to cart", "quantity": cart.quantity}, status=200)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_cart_item(request):
    cart_id = request.data.get("cart_id")
    quantity = int(request.data.get("quantity", 0))
    if not cart_id or quantity <= 0:
        return Response({"message": "Cart ID and valid quantity are required"}, status=400)
    cart = get_object_or_404(Cart, id=cart_id, user=request.user)
    if quantity > cart.product.quantity:
        return Response({"message": f"Only {cart.product.quantity} items are available"}, status=400)
    cart.quantity = quantity
    cart.save(update_fields=["quantity"])
    return Response({"message": "Cart updated", "quantity": cart.quantity}, status=200)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, cart_id):
    cart = get_object_or_404(Cart, id=cart_id, user=request.user)
    cart.delete()
    return Response({"message": "Item removed from cart"}, status=200)

# ============================================================
# ORDER HELPERS - FIXED FOR FRONTEND
# ============================================================

def make_unique_order_number():
    while True:
        number = str(random.randint(100000000, 999999999))
        if not Order.objects.filter(order_number=number).exists():
            return number

def create_stripe_payment_intent(order, payment):
    # FIX 1: Key yahan set karo, upar nahi
    stripe.api_key = settings.STRIPE_SECRET_KEY
    if not stripe.api_key:
        raise Exception("STRIPE_SECRET_KEY is missing in settings.py")

    try:
        amount = int(float(order.total_amount) * 100)
        print(f"STRIPE INTENT -> Order: {order.order_number}, Amount: {amount}, Key: {stripe.api_key[:12]}...")

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            metadata={"order_number": order.order_number, "user_id": str(order.user.id)},
            automatic_payment_methods={"enabled": True},
        )
        payment.payment_reference = intent.id
        payment.save(update_fields=["payment_reference", "updated_at"])
        return intent
    except Exception as e:
        print("REAL STRIPE ERROR:", str(e))
        raise Exception(str(e))

# ============================================================
# CREATE ORDER - FRONTEND KE HISAB SE SIMPLIFIED
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    address = request.data.get("address","").strip()
    payment_method = request.data.get("payment_method") or request.data.get("paymentMethod")
    buy_now_product_id = request.data.get("buy_now_product_id") or request.data.get("buyNowProductId")
    buy_now_quantity = request.data.get("buy_now_quantity") or request.data.get("buyNowQuantity") or 1

    if not address:
        return Response({"message": "Address is required"}, status=400)
    if payment_method not in ["cod", "stripe"]:
        return Response({"message": "Invalid payment method"}, status=400)

    # ================= BUY NOW =================
    if buy_now_product_id:
        try:
            buy_now_quantity = int(buy_now_quantity)
        except:
            buy_now_quantity = 1

        try:
            with transaction.atomic():
                product = get_object_or_404(Product.objects.select_for_update(), id=buy_now_product_id)
                if not product.in_stock or product.quantity < buy_now_quantity:
                    return Response({"message": f"Only {product.quantity} items available for {product.name}"}, status=400)

                order_number = make_unique_order_number()
                subtotal = product.price * buy_now_quantity

                order = Order.objects.create(
                    user=request.user, order_number=order_number, address=address,
                    total_amount=subtotal, status="pending",
                    payment_method=payment_method, payment_status="pending",
                )
                OrderItem.objects.create(order=order, product=product, quantity=buy_now_quantity, price=product.price, subtotal=subtotal)

                product.quantity -= buy_now_quantity
                if product.quantity <= 0:
                    product.quantity = 0
                    product.in_stock = False
                product.save(update_fields=["quantity", "in_stock"])

                payment = Payment.objects.create(order=order, payment_method=payment_method, payment_status="pending")
                Tracking.objects.create(order=order, status="pending", remark="Order placed")

                if payment_method == "cod":
                    return Response({"message": "Order placed successfully", "order_number": order_number, "total_amount": str(order.total_amount)}, status=201)

                # STRIPE
                intent = create_stripe_payment_intent(order, payment)
                return Response({
                    "message": "Order created. Complete Stripe payment.",
                    "order_number": order_number,
                    "total_amount": str(order.total_amount),
                    "client_secret": intent.client_secret,
                }, status=201)

        except Exception as e:
            return Response({"message": f"Stripe error: {str(e)}"}, status=400)

    # ================= CART ORDER =================
    try:
        with transaction.atomic():
            carts = list(Cart.objects.select_for_update().filter(user=request.user).select_related("product"))
            if not carts:
                return Response({"message": "Cart is empty"}, status=400)

            for cart in carts:
                if not cart.product.in_stock or cart.quantity > cart.product.quantity:
                    return Response({"message": f"{cart.product.name} is out of stock"}, status=400)

            order_number = make_unique_order_number()
            order = Order.objects.create(user=request.user, order_number=order_number, address=address, total_amount=0, status="pending", payment_method=payment_method, payment_status="pending")

            total_amount = 0
            for cart in carts:
                subtotal = cart.product.price * cart.quantity
                OrderItem.objects.create(order=order, product=cart.product, quantity=cart.quantity, price=cart.product.price, subtotal=subtotal)
                total_amount += subtotal
                cart.product.quantity -= cart.quantity
                if cart.product.quantity <= 0:
                    cart.product.quantity = 0
                    cart.product.in_stock = False
                cart.product.save(update_fields=["quantity", "in_stock"])

            order.total_amount = total_amount
            order.save(update_fields=["total_amount"])

            payment = Payment.objects.create(order=order, payment_method=payment_method, payment_status="pending")
            Tracking.objects.create(order=order, status="pending", remark="Order placed")

            if payment_method == "cod":
                Cart.objects.filter(user=request.user).delete()
                return Response({"message": "Order placed successfully", "order_number": order_number, "total_amount": str(order.total_amount)}, status=201)

            intent = create_stripe_payment_intent(order, payment)
            return Response({
                "message": "Order created. Complete Stripe payment.",
                "order_number": order_number,
                "total_amount": str(order.total_amount),
                "client_secret": intent.client_secret,
            }, status=201)

    except Exception as e:
        print("ORDER ERROR:", str(e))
        return Response({"message": f"Stripe error: {str(e)}"}, status=400)

# ============================================================
# CONFIRM STRIPE
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def confirm_stripe_payment(request):
    order_number = request.data.get("order_number")
    if not order_number:
        return Response({"message": "Order number is required"}, status=400)
    order = get_object_or_404(Order, order_number=order_number, user=request.user)
    try:
        payment = order.payment
    except:
        return Response({"message": "Payment record not found"}, status=404)

    if not payment.payment_reference:
        return Response({"message": "Stripe PaymentIntent not found"}, status=400)

    stripe.api_key = settings.STRIPE_SECRET_KEY
    try:
        intent = stripe.PaymentIntent.retrieve(payment.payment_reference)
    except Exception as e:
        return Response({"message": "Unable to verify payment", "error": str(e)}, status=400)

    if intent.status == "succeeded":
        payment.payment_status = "paid"
        payment.save(update_fields=["payment_status", "updated_at"])
        order.payment_status = "paid"
        order.status = "confirmed"
        order.save(update_fields=["payment_status", "status", "updated_at"])
        Cart.objects.filter(user=request.user).delete()
        Tracking.objects.create(order=order, status="confirmed", remark="Payment successful")
        return Response({"message": "Payment successful", "order_number": order.order_number}, status=200)

    if intent.status in ["requires_payment_method", "canceled"]:
        payment.payment_status = "failed"
        payment.save(update_fields=["payment_status"])
        order.payment_status = "failed"
        order.status = "cancelled"
        order.save(update_fields=["payment_status", "status"])
        # Restore stock
        for item in OrderItem.objects.filter(order=order).select_related("product"):
            if item.product:
                item.product.quantity += item.quantity
                item.product.in_stock = True
                item.product.save(update_fields=["quantity", "in_stock"])
        return Response({"message": "Payment failed"}, status=400)

    return Response({"message": "Payment is still processing", "stripe_status": intent.status}, status=202)

# ============================================================
# MY ORDERS / CANCEL
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user).prefetch_related("items__product", "tracking", "payment").order_by("-created_at")
    serializer = OrderSerializer(orders, many=True, context={"request": request})
    return Response(serializer.data, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def cancel_order(request, order_number):
    order = get_object_or_404(Order.objects.select_for_update(), order_number=order_number, user=request.user)
    if order.status not in ["pending", "confirmed"]:
        return Response({"message": "This order cannot be cancelled"}, status=400)
    try:
        payment = order.payment
    except:
        payment = None

    stripe.api_key = settings.STRIPE_SECRET_KEY
    if payment and payment.payment_method == "stripe" and payment.payment_status == "paid" and payment.payment_reference:
        try:
            stripe.Refund.create(payment_intent=payment.payment_reference, metadata={"order_number": order.order_number})
            payment.payment_status = "refunded"
            payment.save(update_fields=["payment_status"])
            order.payment_status = "refunded"
        except Exception as e:
            return Response({"message": "Refund could not be processed", "error": str(e)}, status=400)

    for item in OrderItem.objects.filter(order=order).select_related("product"):
        if item.product:
            item.product.quantity += item.quantity
            item.product.in_stock = True
            item.product.save(update_fields=["quantity", "in_stock"])

    order.status = "cancelled"
    order.save(update_fields=["status", "payment_status"])
    Tracking.objects.create(order=order, status="cancelled", remark="Order cancelled by user", order_cancelled_by_user=True)
    return Response({"message": "Order cancelled successfully", "order_number": order.order_number}, status=200)