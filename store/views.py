from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from django.shortcuts import get_object_or_404

from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password,check_password
from django.core.mail import send_mail
from django.conf import settings


from django.utils import timezone
from datetime import timedelta
import uuid

from django.db import transaction
import random

from .models import (
    User,
    Product,
    ProductImage,
    Category,
    Cart,
    Address,
    Payment,
    Tracking,
)

from .serializers import (
    ProductSerializer,
    
    CategorySerializer,
    CartSerializer,
    # ReviewSerializer,
    OrderSerializer,
    # WishlistSerializer,
    # AddressSerializer,
    # SavedCardSerializer,
)

# CATEGORY

@api_view(["GET"])
@permission_classes([AllowAny])
def category_list(request):

    categories = Category.objects.all()

    serializer = CategorySerializer(
        categories,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)

# RANDOM PRODUCTS

@api_view(["GET"])
@permission_classes([AllowAny])
def random_products(request):

    products = list(Product.objects.all())

    random.shuffle(products)
    
    limited_prodcuts = products[0:8]

    category = request.GET.get("category")

    serializer = ProductSerializer(
        limited_prodcuts,
        many=True,
    )

    return Response(serializer.data)

# PRODUCTS LIST

@api_view(["GET"])
@permission_classes([AllowAny])
def list_product(request):

    products = Product.objects.all().order_by("-id")

    category = request.GET.get("category")

    if category:
        products = products.filter(
            category__name__iexact=category
        )

    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)

# PRODUCT DETAIL

@api_view(["GET"])
@permission_classes([AllowAny])
def product_detail(request, slug):

    product = get_object_or_404(
        Product,
        slug=slug
    )

    serializer = ProductSerializer(
        product,
        context={"request": request}
    )

    return Response(serializer.data)

# PRODUCT SEARCH

@api_view(["GET"])
def product_search(request):

    query = request.GET.get("q")

    products = Product.objects.filter(
        name__icontains=query
    )

    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data)

# REGISTER

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):

    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password")

    if not first_name or not last_name or not email or not password:
        return Response(
            {"message": "All fields are required"},
            status=400
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"message": "Email already registered"},
            status=400
        )

    user = User.objects.create(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=make_password(password),
    )

    return Response(
        {
            "message": "Registered successfully",
            "user_id": user.id,
        },
        status=201
    )

# LOGIN

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):

    email = request.data.get("email", "").strip().lower()

    password = request.data.get("password")
    if not email or not password:
        return Response(
            {"message": "Email and password are required"},
                status=400
    )
    try:
        user=User.objects.get(email=email)
        if check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            return Response(
                {"message": "Login successful",

                "userId": user.id,

                "userName": f"{user.first_name} {user.last_name}",

                "email": user.email,

                "access": str(refresh.access_token),

                "refresh": str(refresh),
        },
                status=200
    )
        else:
            return Response(
            {"message": "Invalid email or password"},
            status=401
        )
    except User.DoesNotExist:
                return Response(
                    {"message": "Invalid email or password"},
                    status=401
        )

# FORGOT PASSWORD

@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password(request):

    email = request.data.get("email", "").strip().lower()

    if not email:
        return Response(
            {"message": "Email is required"},
            status=400
        )

    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        return Response(
            {"message": "No account found with this email"},
            status=404
        )

    # Generate token
    token = uuid.uuid4().hex

    # Save token
    user.reset_token = token
    user.reset_token_created = timezone.now()

    user.save(
        update_fields=[
            "reset_token",
            "reset_token_created"
        ]
    )

    # Frontend reset password page
    reset_link = (
        f"{settings.FRONTEND_URL}"
        f"/reset-password?token={token}"
    )

    # Send email
    send_mail(
        subject="Shopora - Reset Your Password",

        message=f"""Hello {user.first_name}, 
        You requested to reset your Shopora password.
        Click the link below to create a new password:
        {reset_link}
        This link will expire in 15 minutes.
        If you did not request this password reset,
        you can safely ignore this email.
        Thanks,
        Shopora Team
        """,

        from_email=settings.DEFAULT_FROM_EMAIL,

        recipient_list=[user.email],

        fail_silently=False,
    )

    return Response(
        {
            "message": "Password reset link has been sent to your email"
        },
        status=200
    )


# RESET PASSWORD

@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):

    token = request.data.get("token")
    password = request.data.get("password")

    if not token or not password:
        return Response(
            {
                "message": "Token and password are required"
            },
            status=400
        )

    try:
        user = User.objects.get(
            reset_token=token
        )

    except User.DoesNotExist:
        return Response(
            {
                "message": "Invalid or expired token"
            },
            status=400
        )

    # Check token time
    if not user.reset_token_created:
        return Response(
            {
                "message": "Invalid or expired token"
            },
            status=400
        )

    # Token expires after 15 minutes
    if timezone.now() > (
        user.reset_token_created +
        timedelta(minutes=15)
    ):
        return Response(
            {
                "message": "Reset token has expired"
            },
            status=400
        )

    # Password length
    if len(password) < 8:
        return Response(
            {
                "message": "Password must be at least 8 characters"
            },
            status=400
        )

    # Save new password
    user.password = make_password(password)

    # Remove used token
    user.reset_token = None
    user.reset_token_created = None

    user.save(
        update_fields=[
            "password",
            "reset_token",
            "reset_token_created"
        ]
    )

    return Response(
        {
            "message": "Password reset successfully"
        },
        status=200
    )

# GET CART

@api_view(["GET"])
def get_cart_items(request, user_id):

    carts = Cart.objects.filter(
        user_id=user_id,
        is_order_placed=False
    ).select_related("product")

    serializer = CartSerializer(
        carts,
        many=True
    )

    return Response(serializer.data)

# ADD TO CART

@api_view(["POST"])
def add_to_cart(request):

    user_id = request.data.get("userId")
    product_id = request.data.get("productId")
    quantity = request.data.get("quantity", 1)

    try:
        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)

        cart, created = Cart.objects.get_or_create(
            user=user,
            product=product,
            is_order_placed=False,
            defaults={
                "quantity": quantity
            }
        )

        if not created:
            cart.quantity += quantity
            cart.save()

        return Response(
            {
                "message": "Product added to cart",
                "quantity": cart.quantity
            },
            status=200
        )

    except User.DoesNotExist:
        return Response(
            {"message": "User not found"},
            status=404
        )

    except Product.DoesNotExist:
        return Response(
            {"message": "Product not found"},
            status=404
        )

    except Exception as e:
        print("ADD TO CART ERROR:", e)

        return Response(
            {"message": str(e)},
            status=500
    )
@api_view(["PUT"])
def update_cart_item(request):

    cart_id = request.data.get("cart_id")
    quantity = request.data.get("quantity")

    try:
        cart = Cart.objects.get(
            id=cart_id,
            is_order_placed=False
        )

        cart.quantity = quantity
        cart.save()

        return Response(
            {"message": "Cart updated"},
            status=200
        )

    except Cart.DoesNotExist:
        return Response(
            {"message": "Cart item not found"},
            status=404
        )

# REMOVE FROM CART

@api_view(["DELETE"])
def remove_from_cart(request, cart_id):
        try:
            cart = Cart.objects.get(id=cart_id,is_order_placed=False)
            cart.delete()
            return Response(
            {"message": "Item deleted from Cart"},status=200)

        except Cart.DoesNotExist:
            return Response(
                {"message": "Cart item not found"},status=404)

# CREATE ORDER / CHECKOUT

def make_unique_order_number():

    while True:

        num = str(random.randint(100000000, 999999999))

        if not Address.objects.filter(order_number=num).exists():
            return num


@api_view(["POST"])
def create_order(request):

    user_id = request.data.get("userId")
    address = request.data.get("address")
    payment_method = request.data.get("paymentMethod")

    card_number = request.data.get("cardNumber")
    card_holder = request.data.get("cardHolder")
    expiry = request.data.get("expiry")
    cvv = request.data.get("cvv")

    try:

        # User check
        user = User.objects.get(id=user_id)

        # User ka active cart
        carts = Cart.objects.filter(
            user=user,
            is_order_placed=False
        )

        if not carts.exists():
            return Response(
                {"message": "Cart is empty"},
                status=400
            )

        # Order number
        order_number = make_unique_order_number()

        # Cart items ko order placed mark karein
        carts.update(
            order_number=order_number,
            is_order_placed=True
        )

        # Address save
        Address.objects.create(
            user=user,
            order_number=order_number,
            address=address
        )

        # Payment save
        Payment.objects.create(
            user=user,
            order_number=order_number,
            payment_method=payment_method,

            card_number=(
                card_number
                if payment_method == "online"
                else None
            ),

            card_holder=(
                card_holder
                if payment_method == "online"
                else None
            ),

            expiry_date=(
                expiry
                if payment_method == "online"
                else None
            ),

            cvv=(
                cvv
                if payment_method == "online"
                else None
            ),
        )

        return Response(
            {
                "message": "Order placed successfully!",
                "order_number": order_number
            },
            status=201
        )

    except User.DoesNotExist:

        return Response(
            {"message": "User not found"},
            status=404
        )

    except Exception as e:

        print("CREATE ORDER ERROR:", e)

        return Response(
            {
                "message": str(e)
            },
            status=500
        )
# MY ORDERS
@api_view(["GET"])
def my_orders(request, user_id):

    try:

        user = User.objects.get(
            id=user_id
        )

        orders = Address.objects.filter(
            user=user
        ).order_by("-order_at")

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data,
            status=200
        )

    except User.DoesNotExist:

        return Response(
            {
                "message": "User not found"
            },
            status=404
        )

    except Exception as e:

        print("MY ORDERS ERROR:", e)

        return Response(
            {
                "message": str(e)
            },
            status=500
        )


@api_view(["POST"])
def cancel_order(request, order_number):

    try:

        # Find order
        address = Address.objects.get(
            order_number=order_number
        )

        # Get latest tracking status
        tracking = Tracking.objects.filter(
            cart__order_number=order_number,
            cart__is_order_placed=True
        ).order_by("-status_date").first()

        current_status = (
            tracking.status
            if tracking
            else "pending"
        )

        # Only pending orders can be cancelled
        if current_status != "pending":

            return Response(
                {
                    "message": (
                        "Only pending orders "
                        "can be cancelled"
                    ),
                    "status": current_status
                },
                status=400
            )

        # Get order carts
        carts = Cart.objects.filter(
            order_number=order_number,
            is_order_placed=True
        )

        # Create cancelled tracking record
        for cart in carts:

            Tracking.objects.create(
                cart=cart,
                status="cancelled",
                remark="Order cancelled by user",
                order_cancelled_by_user=True
            )

        return Response(
            {
                "message": "Order cancelled successfully",
                "order_number": order_number,
                "status": "cancelled"
            },
            status=200
        )

    except Address.DoesNotExist:

        return Response(
            {
                "message": "Order not found"
            },
            status=404
        )

    except Exception as e:

        print("CANCEL ORDER ERROR:", e)

        return Response(
            {
                "message": str(e)
            },
            status=500
        )