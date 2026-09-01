
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.core import signing
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db import transaction

from django.utils import timezone
from datetime import timedelta

import os
import random
import uuid
import requests
import stripe

from .models import (
    User,
    Product,
    Category,
    Cart,
    Order,
    OrderItem,
    Payment,
    Tracking,
)

from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    OrderSerializer,
)


# ============================================================
# CATEGORY
# ============================================================

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


# ============================================================
# RANDOM PRODUCTS
# ============================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def random_products(request):

    products = list(Product.objects.all())

    random.shuffle(products)

    serializer = ProductSerializer(
        products[:8],
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)


# ============================================================
# PRODUCTS
# ============================================================

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


# ============================================================
# PRODUCT DETAIL
# ============================================================

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


# ============================================================
# PRODUCT SEARCH
# ============================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def product_search(request):

    query = request.GET.get("q", "").strip()

    if not query:
        return Response([])

    products = Product.objects.filter(
        name__icontains=query
    )

    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)


# ============================================================
# REGISTER
# ============================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):

    first_name = request.data.get(
        "first_name",
        ""
    ).strip()

    last_name = request.data.get(
        "last_name",
        ""
    ).strip()

    email = request.data.get(
        "email",
        ""
    ).strip().lower()

    password = request.data.get("password")

    if not first_name or not last_name or not email or not password:

        return Response(
            {
                "message": "All fields are required"
            },
            status=400
        )

    if len(password) < 8:

        return Response(
            {
                "message": "Password must be at least 8 characters"
            },
            status=400
        )

    if User.objects.filter(email=email).exists():

        return Response(
            {
                "message": "Email already registered"
            },
            status=400
        )

    user = User.objects.create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )

    return Response(
        {
            "message": "Registered successfully",
            "user_id": user.id
        },
        status=201
    )


# ============================================================
# LOGIN
# ============================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):

    email = request.data.get(
        "email",
        ""
    ).strip().lower()

    password = request.data.get("password")

    if not email or not password:

        return Response(
            {
                "message": "Email and password are required"
            },
            status=400
        )

    try:

        user = User.objects.get(
            email=email
        )

    except User.DoesNotExist:

        return Response(
            {
                "message": "Invalid email or password"
            },
            status=401
        )

    if not user.is_active or not check_password(
        password,
        user.password
    ):

        return Response(
            {
                "message": "Invalid email or password"
            },
            status=401
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "message": "Login successful",
            "userId": user.id,
            "userName": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
        status=200
    )


# ============================================================
# FORGOT PASSWORD
# ============================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password(request):

    email = request.data.get(
        "email",
        ""
    ).strip().lower()

    if not email:

        return Response(
            {
                "success": False,
                "message": "Email is required"
            },
            status=400
        )

    user = User.objects.filter(
        email=email
    ).first()

    # Don't reveal whether email exists
    if not user:

        return Response(
            {
                "success": True,
                "message": "If this email exists, a reset link has been sent."
            },
            status=200
        )

    # ========================================================
    # CREATE UID-LESS SIGNED TOKEN
    # ========================================================

    token_data = {
        "user_id": user.id,
        "email": user.email,
    }

    token = signing.dumps(
        token_data,
        salt="shopora-password-reset"
    )

    # ========================================================
    # FRONTEND URL
    # ========================================================

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "https://shopora-omega.vercel.app"
    ).rstrip("/")

    reset_url = (
        f"{frontend_url}/reset-password/"
        f"?token={token}"
    )

    # ========================================================
    # BREVO API KEY
    # ========================================================

    api_key = os.getenv(
        "BREVO_API_KEY"
    )

    if not api_key:

        print(
            "ERROR: BREVO_API_KEY is missing"
        )

        return Response(
            {
                "success": False,
                "message": "Email service is not configured."
            },
            status=500
        )

    # ========================================================
    # BREVO EMAIL PAYLOAD
    # ========================================================

    payload = {

        "sender": {
            "name": "Shopora",
            "email": "mumtahina486@gmail.com"
        },

        "to": [
            {
                "email": email
            }
        ],

        "subject": "Shopora - Reset Your Password",

        "htmlContent": f"""
        <!DOCTYPE html>

        <html>

        <body style="
            margin:0;
            padding:0;
            background:#f8f8f8;
            font-family:Arial,sans-serif;
        ">

            <div style="
                max-width:600px;
                margin:40px auto;
                background:white;
                padding:40px;
                border-radius:12px;
            ">

                <h2>
                    Reset Your Shopora Password
                </h2>

                <p>
                    Hello {user.first_name},
                </p>

                <p>
                    We received a request to reset
                    your Shopora password.
                </p>

                <p>
                    Click the button below to create
                    a new password:
                </p>

                <p style="margin:30px 0;">

                    <a
                        href="{reset_url}"
                        style="
                            display:inline-block;
                            padding:13px 24px;
                            background:#e11d48;
                            color:white;
                            text-decoration:none;
                            border-radius:7px;
                            font-weight:bold;
                        "
                    >
                        Reset Password
                    </a>

                </p>

                <p>
                    This reset link will expire
                    after 1 hour.
                </p>

                <p>
                    If you did not request this password
                    reset, you can safely ignore this email.
                </p>

                <p>
                    Thanks,<br>
                    Shopora Team
                </p>

            </div>

        </body>

        </html>
        """
    }

    # ========================================================
    # SEND EMAIL USING BREVO HTTP API
    # ========================================================

    try:

        response = requests.post(

            "https://api.brevo.com/v3/smtp/email",

            headers={
                "accept": "application/json",
                "api-key": api_key,
                "content-type": "application/json",
            },

            json=payload,

            timeout=15,
        )

        print(
            "===================================="
        )

        print(
            "BREVO STATUS:",
            response.status_code
        )

        print(
            "BREVO RESPONSE:",
            response.text
        )

        print(
            "===================================="
        )

        if response.status_code not in [
            200,
            201,
            202
        ]:

            return Response(
                {
                    "success": False,
                    "message": "Unable to send reset email.",
                    "brevo_status": response.status_code,
                    "brevo_error": response.text,
                },
                status=500
            )

        return Response(
            {
                "success": True,
                "message": "Password reset link has been sent to your email."
            },
            status=200
        )

    except requests.exceptions.Timeout:

        print(
            "BREVO ERROR: Request timed out"
        )

        return Response(
            {
                "success": False,
                "message": "Email service timed out."
            },
            status=500
        )

    except Exception as e:

        print(
            "BREVO ERROR:",
            str(e)
        )

        return Response(
            {
                "success": False,
                "message": "Email service error.",
                "error": str(e),
            },
            status=500
        )


# ============================================================
# RESET PASSWORD
# UID KE BAGHAIR
# ============================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):

    token = request.data.get("token")

    password = request.data.get("password")

    # ========================================================
    # VALIDATION
    # ========================================================

    if not token or not password:

        return Response(
            {
                "success": False,
                "message": "Token and password are required"
            },
            status=400
        )

    if len(password) < 8:

        return Response(
            {
                "success": False,
                "message": "Password must be at least 8 characters"
            },
            status=400
        )

    # ========================================================
    # DECODE SIGNED TOKEN
    # ========================================================

    try:

        token_data = signing.loads(
            token,
            salt="shopora-password-reset",
            max_age=3600
        )

    except signing.SignatureExpired:

        return Response(
            {
                "success": False,
                "message": "Reset link has expired"
            },
            status=400
        )

    except signing.BadSignature:

        return Response(
            {
                "success": False,
                "message": "Invalid reset link"
            },
            status=400
        )

    # ========================================================
    # GET USER
    # ========================================================

    user_id = token_data.get(
        "user_id"
    )

    email = token_data.get(
        "email"
    )

    if not user_id or not email:

        return Response(
            {
                "success": False,
                "message": "Invalid reset link"
            },
            status=400
        )

    try:

        user = User.objects.get(
            id=user_id,
            email=email
        )

    except User.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Invalid reset link"
            },
            status=400
        )

    # ========================================================
    # SET NEW PASSWORD
    # ========================================================

    user.set_password(
        password
    )

    user.save(
        update_fields=["password"]
    )

    return Response(
        {
            "success": True,
            "message": "Password reset successfully"
        },
        status=200
    )


# ============================================================
# CURRENT USER
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):

    return Response(
        {
            "id": request.user.id,
            "email": request.user.email,
            "name": (
                f"{request.user.first_name} "
                f"{request.user.last_name}"
            )
        }
    )


# ============================================================
# CART
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart_items(request):

    carts = Cart.objects.filter(
        user=request.user
    ).select_related("product")

    serializer = CartSerializer(
        carts,
        many=True,
        context={"request": request}
    )

    return Response(
        serializer.data
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):

    product_id = request.data.get("productId")

    # ========================================================
    # QUANTITY VALIDATION
    # ========================================================

    try:
        quantity = int(
            request.data.get("quantity", 1)
        )
    except (TypeError, ValueError):
        return Response(
            {
                "message": "Quantity must be a valid number"
            },
            status=400
        )

    if not product_id:
        return Response(
            {
                "message": "Product ID is required"
            },
            status=400
        )

    # Maximum 5 items per product
    if quantity <= 0:
        return Response(
            {
                "message": "Quantity must be at least 1"
            },
            status=400
        )

    if quantity > 5:
        return Response(
            {
                "message": "You can add maximum 5 items of one product."
            },
            status=400
        )

    # ========================================================
    # GET PRODUCT
    # ========================================================

    product = get_object_or_404(
        Product,
        id=product_id
    )

    if not product.in_stock or product.quantity <= 0:
        return Response(
            {
                "message": "Product is out of stock"
            },
            status=400
        )

    # ========================================================
    # STOCK CHECK
    # ========================================================

    if quantity > product.quantity:
        return Response(
            {
                "message":
                f"Only {product.quantity} items are available"
            },
            status=400
        )

    # ========================================================
    # GET / CREATE CART
    # ========================================================

    cart, created = Cart.objects.get_or_create(

        user=request.user,

        product=product,

        defaults={
            "quantity": quantity
        }
    )

    # ========================================================
    # EXISTING CART ITEM
    # ========================================================

    if not created:

        new_quantity = cart.quantity + quantity

        # Maximum 5 per product
        if new_quantity > 5:
            return Response(
                {
                    "message":
                    "You can have maximum 5 items of one product in your cart."
                },
                status=400
            )

        # Stock check
        if new_quantity > product.quantity:
            return Response(
                {
                    "message":
                    f"Only {product.quantity} items are available"
                },
                status=400
            )

        cart.quantity = new_quantity

        cart.save(
            update_fields=["quantity"]
        )

    # ========================================================
    # SUCCESS
    # ========================================================

    return Response(
        {
            "message": "Product added to cart",
            "quantity": cart.quantity
        },
        status=200
    )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_cart_item(request):

    cart_id = request.data.get("cart_id")

    # ========================================================
    # QUANTITY VALIDATION
    # ========================================================

    try:
        quantity = int(
            request.data.get("quantity", 0)
        )
    except (TypeError, ValueError):
        return Response(
            {
                "message": "Quantity must be a valid number"
            },
            status=400
        )

    if not cart_id:
        return Response(
            {
                "message": "Cart ID is required"
            },
            status=400
        )

    if quantity <= 0:
        return Response(
            {
                "message": "Quantity must be at least 1"
            },
            status=400
        )

    # ========================================================
    # MAXIMUM 5 CHECK
    # ========================================================

    if quantity > 5:
        return Response(
            {
                "message":
                "You can have maximum 5 items of one product in your cart."
            },
            status=400
        )

    # ========================================================
    # GET USER'S CART
    # ========================================================

    cart = get_object_or_404(
        Cart,
        id=cart_id,
        user=request.user
    )

    # ========================================================
    # STOCK CHECK
    # ========================================================

    if quantity > cart.product.quantity:
        return Response(
            {
                "message":
                f"Only {cart.product.quantity} items are available"
            },
            status=400
        )

    # ========================================================
    # UPDATE
    # ========================================================

    cart.quantity = quantity

    cart.save(
        update_fields=["quantity"]
    )

    return Response(
        {
            "message": "Cart updated",
            "quantity": cart.quantity
        },
        status=200
    )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, cart_id):

    cart = get_object_or_404(
        Cart,
        id=cart_id,
        user=request.user
    )

    cart.delete()

    return Response(
        {
            "message": "Item removed from cart"
        },
        status=200
    )


# ============================================================
# ORDER NUMBER
# ============================================================

def make_unique_order_number():

    while True:

        number = str(
            random.randint(
                100000000,
                999999999
            )
        )

        if not Order.objects.filter(
            order_number=number
        ).exists():

            return number


# ============================================================
# STRIPE PAYMENT INTENT
# ============================================================

def create_stripe_payment_intent(
    order,
    payment
):

    stripe.api_key = settings.STRIPE_SECRET_KEY

    if not stripe.api_key:

        raise Exception(
            "STRIPE_SECRET_KEY is missing in settings.py"
        )

    try:

        amount = int(
            float(order.total_amount) * 100
        )

        intent = stripe.PaymentIntent.create(

            amount=amount,

            currency="usd",

            metadata={
                "order_number":
                order.order_number,

                "user_id":
                str(order.user.id)
            },

            automatic_payment_methods={
                "enabled": True
            },
        )

        payment.payment_reference = intent.id

        payment.save(
            update_fields=[
                "payment_reference",
                "updated_at"
            ]
        )

        return intent

    except Exception as e:

        print(
            "REAL STRIPE ERROR:",
            str(e)
        )

        raise Exception(
            str(e)
        )


# ============================================================
# CREATE ORDER
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):

    address = request.data.get(
        "address",
        ""
    ).strip()

    payment_method = (
        request.data.get("payment_method")
        or
        request.data.get("paymentMethod")
    )

    buy_now_product_id = (
        request.data.get("buy_now_product_id")
        or
        request.data.get("buyNowProductId")
    )

    buy_now_quantity = (
        request.data.get("buy_now_quantity")
        or
        request.data.get("buyNowQuantity")
        or
        1
    )

    # ========================================================
    # BASIC VALIDATION
    # ========================================================

    if not address:
        return Response(
            {
                "message": "Address is required"
            },
            status=400
        )

    if payment_method not in [
        "cod",
        "stripe"
    ]:
        return Response(
            {
                "message": "Invalid payment method"
            },
            status=400
        )

    # ========================================================
    # BUY NOW
    # ========================================================

    if buy_now_product_id:

        try:
            buy_now_quantity = int(
                buy_now_quantity
            )
        except (TypeError, ValueError):
            return Response(
                {
                    "message": "Quantity must be a valid number"
                },
                status=400
            )

        # ====================================================
        # BUY NOW QUANTITY CHECK
        # ====================================================

        if buy_now_quantity <= 0:
            return Response(
                {
                    "message": "Quantity must be at least 1"
                },
                status=400
            )

        if buy_now_quantity > 5:
            return Response(
                {
                    "message":
                    "You can purchase maximum 5 items of one product."
                },
                status=400
            )

        try:

            with transaction.atomic():

                product = get_object_or_404(

                    Product.objects.select_for_update(),

                    id=buy_now_product_id
                )

                # ====================================================
                # STOCK CHECK
                # ====================================================

                if (
                    not product.in_stock
                    or
                    product.quantity < buy_now_quantity
                ):

                    return Response(
                        {
                            "message":
                            f"Only {product.quantity} items available for {product.name}"
                        },
                        status=400
                    )

                # ====================================================
                # ORDER
                # ====================================================

                order_number = (
                    make_unique_order_number()
                )

                subtotal = (
                    product.price
                    *
                    buy_now_quantity
                )

                order = Order.objects.create(

                    user=request.user,

                    order_number=order_number,

                    address=address,

                    total_amount=subtotal,

                    status="pending",

                    payment_method=payment_method,

                    payment_status="pending",
                )

                OrderItem.objects.create(

                    order=order,

                    product=product,

                    quantity=buy_now_quantity,

                    price=product.price,

                    subtotal=subtotal
                )

                # ====================================================
                # REDUCE STOCK
                # ====================================================

                product.quantity -= (
                    buy_now_quantity
                )

                if product.quantity <= 0:

                    product.quantity = 0

                    product.in_stock = False

                product.save(
                    update_fields=[
                        "quantity",
                        "in_stock"
                    ]
                )

                # ====================================================
                # PAYMENT
                # ====================================================

                payment = Payment.objects.create(

                    order=order,

                    payment_method=payment_method,

                    payment_status="pending"
                )

                Tracking.objects.create(

                    order=order,

                    status="pending",

                    remark="Order placed"
                )

                # ====================================================
                # COD
                # ====================================================

                if payment_method == "cod":

                    return Response(
                        {
                            "message":
                            "Order placed successfully",

                            "order_number":
                            order_number,

                            "total_amount":
                            str(order.total_amount)
                        },
                        status=201
                    )

                # ====================================================
                # STRIPE
                # ====================================================

                intent = (
                    create_stripe_payment_intent(
                        order,
                        payment
                    )
                )

                return Response(
                    {
                        "message":
                        "Order created. Complete Stripe payment.",

                        "order_number":
                        order_number,

                        "total_amount":
                        str(order.total_amount),

                        "client_secret":
                        intent.client_secret,
                    },
                    status=201
                )

        except Exception as e:

            return Response(
                {
                    "message":
                    f"Stripe error: {str(e)}"
                },
                status=400
            )

    # ========================================================
    # CART CHECKOUT
    # ========================================================

    try:

        with transaction.atomic():

            carts = list(

                Cart.objects

                .select_for_update()

                .filter(
                    user=request.user
                )

                .select_related("product")
            )

            # ====================================================
            # EMPTY CART
            # ====================================================

            if not carts:

                return Response(
                    {
                        "message": "Cart is empty"
                    },
                    status=400
                )

            # ====================================================
            # VALIDATE EVERY CART ITEM
            # ====================================================

            for cart in carts:

                # Quantity must be positive
                if cart.quantity <= 0:

                    return Response(
                        {
                            "message":
                            f"Invalid quantity for {cart.product.name}"
                        },
                        status=400
                    )

                # Maximum 5 per product
                if cart.quantity > 5:

                    return Response(
                        {
                            "message":
                            f"You can purchase maximum 5 items of {cart.product.name}."
                        },
                        status=400
                    )

                # Stock validation
                if (
                    not cart.product.in_stock
                    or
                    cart.quantity > cart.product.quantity
                ):

                    return Response(
                        {
                            "message":
                            f"Only {cart.product.quantity} items are available for {cart.product.name}"
                        },
                        status=400
                    )

            # ====================================================
            # CREATE ORDER
            # ====================================================

            order_number = (
                make_unique_order_number()
            )

            order = Order.objects.create(

                user=request.user,

                order_number=order_number,

                address=address,

                total_amount=0,

                status="pending",

                payment_method=payment_method,

                payment_status="pending"
            )

            total_amount = 0

            # ====================================================
            # CREATE ORDER ITEMS + REDUCE STOCK
            # ====================================================

            for cart in carts:

                # Extra final security check
                if cart.quantity > 5:

                    return Response(
                        {
                            "message":
                            f"Maximum 5 items allowed for {cart.product.name}"
                        },
                        status=400
                    )

                subtotal = (
                    cart.product.price
                    *
                    cart.quantity
                )

                OrderItem.objects.create(

                    order=order,

                    product=cart.product,

                    quantity=cart.quantity,

                    price=cart.product.price,

                    subtotal=subtotal
                )

                total_amount += subtotal

                cart.product.quantity -= (
                    cart.quantity
                )

                if cart.product.quantity <= 0:

                    cart.product.quantity = 0

                    cart.product.in_stock = False

                cart.product.save(
                    update_fields=[
                        "quantity",
                        "in_stock"
                    ]
                )

            # ====================================================
            # SAVE TOTAL
            # ====================================================

            order.total_amount = (
                total_amount
            )

            order.save(
                update_fields=[
                    "total_amount"
                ]
            )

            # ====================================================
            # PAYMENT
            # ====================================================

            payment = Payment.objects.create(

                order=order,

                payment_method=payment_method,

                payment_status="pending"
            )

            Tracking.objects.create(

                order=order,

                status="pending",

                remark="Order placed"
            )

            # ====================================================
            # COD
            # ====================================================

            if payment_method == "cod":

                Cart.objects.filter(
                    user=request.user
                ).delete()

                return Response(
                    {
                        "message":
                        "Order placed successfully",

                        "order_number":
                        order_number,

                        "total_amount":
                        str(order.total_amount)
                    },
                    status=201
                )

            # ====================================================
            # STRIPE
            # ====================================================

            intent = (
                create_stripe_payment_intent(
                    order,
                    payment
                )
            )

            return Response(
                {
                    "message":
                    "Order created. Complete Stripe payment.",

                    "order_number":
                    order_number,

                    "total_amount":
                    str(order.total_amount),

                    "client_secret":
                    intent.client_secret,
                },
                status=201
            )

    except Exception as e:

        print(
            "ORDER ERROR:",
            str(e)
        )

        return Response(
            {
                "message":
                f"Stripe error: {str(e)}"
            },
            status=400
        )

# ============================================================
# CONFIRM STRIPE PAYMENT
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def confirm_stripe_payment(request):

    order_number = request.data.get("order_number")

    if not order_number:
        return Response(
            {
                "message": "Order number is required"
            },
            status=400
        )

    # ========================================================
    # GET USER'S ORDER
    # ========================================================

    order = get_object_or_404(
        Order.objects.select_for_update(),
        order_number=order_number,
        user=request.user
    )

    # ========================================================
    # GET PAYMENT
    # ========================================================

    try:
        payment = order.payment

    except Payment.DoesNotExist:
        return Response(
            {
                "message": "Payment record not found"
            },
            status=404
        )

    # ========================================================
    # ALREADY PAID
    # ========================================================

    if (
        payment.payment_status == "paid"
        and
        order.payment_status == "paid"
        and
        order.status == "confirmed"
    ):

        return Response(
            {
                "message": "Payment already confirmed",
                "order_number": order.order_number
            },
            status=200
        )

    # ========================================================
    # ALREADY FAILED / CANCELLED
    # ========================================================

    if (
        payment.payment_status == "failed"
        and
        order.payment_status == "failed"
        and
        order.status == "cancelled"
    ):

        return Response(
            {
                "message": "Payment has already failed",
                "order_number": order.order_number
            },
            status=400
        )

    # ========================================================
    # STRIPE PAYMENT REFERENCE CHECK
    # ========================================================

    if not payment.payment_reference:

        return Response(
            {
                "message": "Stripe PaymentIntent not found"
            },
            status=400
        )

    # ========================================================
    # STRIPE API KEY
    # ========================================================

    stripe.api_key = settings.STRIPE_SECRET_KEY

    if not stripe.api_key:

        return Response(
            {
                "message": "Stripe secret key is not configured"
            },
            status=500
        )

    # ========================================================
    # RETRIEVE PAYMENT INTENT
    # ========================================================

    try:

        intent = stripe.PaymentIntent.retrieve(
            payment.payment_reference
        )

    except Exception as e:

        return Response(
            {
                "message": "Unable to verify payment",
                "error": str(e)
            },
            status=400
        )

    # ========================================================
    # PAYMENT SUCCESS
    # ========================================================

    if intent.status == "succeeded":

        # -----------------------------------------------
        # Update payment
        # -----------------------------------------------

        payment.payment_status = "paid"

        payment.save(
            update_fields=[
                "payment_status",
                "updated_at"
            ]
        )

        # -----------------------------------------------
        # Update order
        # -----------------------------------------------

        order.payment_status = "paid"
        order.status = "confirmed"

        order.save(
            update_fields=[
                "payment_status",
                "status",
                "updated_at"
            ]
        )

        # -----------------------------------------------
        # Delete cart items
        # -----------------------------------------------

        Cart.objects.filter(
            user=request.user
        ).delete()

        # -----------------------------------------------
        # Tracking
        # -----------------------------------------------

        Tracking.objects.create(
            order=order,
            status="confirmed",
            remark="Payment successful"
        )

        return Response(
            {
                "message": "Payment successful",
                "order_number": order.order_number
            },
            status=200
        )

    # ========================================================
    # PAYMENT FAILED / CANCELLED
    # ========================================================

    if intent.status in [
        "requires_payment_method",
        "canceled"
    ]:

        # IMPORTANT:
        # Agar order pehle hi failed/cancelled ho chuka hai,
        # stock dobara restore nahi karna.
        if (
            order.status == "cancelled"
            and
            order.payment_status == "failed"
        ):

            return Response(
                {
                    "message": "Payment has already failed",
                    "order_number": order.order_number
                },
                status=400
            )

        # -----------------------------------------------
        # Mark payment failed
        # -----------------------------------------------

        payment.payment_status = "failed"

        payment.save(
            update_fields=[
                "payment_status",
                "updated_at"
            ]
        )

        # -----------------------------------------------
        # Mark order cancelled
        # -----------------------------------------------

        order.payment_status = "failed"
        order.status = "cancelled"

        order.save(
            update_fields=[
                "payment_status",
                "status",
                "updated_at"
            ]
        )

        # -----------------------------------------------
        # RESTORE STOCK ONLY ON FIRST FAILURE
        # -----------------------------------------------

        for item in (
            OrderItem.objects
            .select_related("product")
            .filter(order=order)
        ):

            if not item.product:
                continue

            product = Product.objects.select_for_update().get(
                id=item.product.id
            )

            product.quantity += item.quantity

            product.in_stock = (
                product.quantity > 0
            )

            product.save(
                update_fields=[
                    "quantity",
                    "in_stock"
                ]
            )

        # -----------------------------------------------
        # Tracking
        # -----------------------------------------------

        Tracking.objects.create(
            order=order,
            status="cancelled",
            remark="Payment failed - stock restored"
        )

        return Response(
            {
                "message": "Payment failed",
                "order_number": order.order_number
            },
            status=400
        )

    # ========================================================
    # PAYMENT STILL PROCESSING
    # ========================================================

    return Response(
        {
            "message": "Payment is still processing",
            "stripe_status": intent.status,
            "order_number": order.order_number
        },
        status=202
    )



# ============================================================
# MY ORDERS
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):

    orders = (
        Order.objects
        .filter(user=request.user)
        .prefetch_related(
            "items__product",
            "tracking",
            "payment"
        )
        .order_by("-created_at")
    )

    serializer = OrderSerializer(
        orders,
        many=True,
        context={"request": request}
    )

    return Response(
        serializer.data,
        status=200
    )


# ============================================================
# CANCEL ORDER
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def cancel_order(
    request,
    order_number
):

    order = get_object_or_404(

        Order.objects.select_for_update(),

        order_number=order_number,

        user=request.user
    )

    if order.status not in [
        "pending",
        "confirmed"
    ]:

        return Response(
            {
                "message":
                "This order cannot be cancelled"
            },
            status=400
        )

    try:

        payment = order.payment

    except:

        payment = None

    stripe.api_key = (
        settings.STRIPE_SECRET_KEY
    )

    if (
        payment
        and
        payment.payment_method == "stripe"
        and
        payment.payment_status == "paid"
        and
        payment.payment_reference
    ):

        try:

            stripe.Refund.create(

                payment_intent=
                payment.payment_reference,

                metadata={
                    "order_number":
                    order.order_number
                }
            )

            payment.payment_status = (
                "refunded"
            )

            payment.save(
                update_fields=[
                    "payment_status"
                ]
            )

            order.payment_status = (
                "refunded"
            )

        except Exception as e:

            return Response(
                {
                    "message":
                    "Refund could not be processed",

                    "error":
                    str(e)
                },
                status=400
            )

    for item in (
        OrderItem.objects
        .filter(order=order)
        .select_related("product")
    ):

        if item.product:

            item.product.quantity += (
                item.quantity
            )

            item.product.in_stock = True

            item.product.save(
                update_fields=[
                    "quantity",
                    "in_stock"
                ]
            )

    order.status = "cancelled"

    order.save(
        update_fields=[
            "status",
            "payment_status"
        ]
    )

    Tracking.objects.create(

        order=order,

        status="cancelled",

        remark="Order cancelled by user",

        order_cancelled_by_user=True
    )

    return Response(
        {
            "message":
            "Order cancelled successfully",

            "order_number":
            order.order_number
        },
        status=200
    )

# ============================================================
# STRIPE WEBHOOK
# ============================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def stripe_webhook(request):

    payload = request.body

    sig_header = request.META.get(
        "HTTP_STRIPE_SIGNATURE"
    )

    webhook_secret = settings.STRIPE_WEBHOOK_SECRET

    if not webhook_secret:
        return Response(
            {
                "message": "Stripe webhook secret is not configured"
            },
            status=500
        )

    try:

        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            webhook_secret
        )

    except ValueError:

        return Response(
            {
                "message": "Invalid webhook payload"
            },
            status=400
        )

    except stripe.error.SignatureVerificationError:

        return Response(
            {
                "message": "Invalid webhook signature"
            },
            status=400
        )

    # ========================================================
    # PAYMENT SUCCESS
    # ========================================================

    if event["type"] == "payment_intent.succeeded":

        intent = event["data"]["object"]

        order_number = intent.get(
            "metadata",
            {}
        ).get("order_number")

        if not order_number:

            return Response(
                {
                    "message": "Order number missing"
                },
                status=400
            )

        try:

            with transaction.atomic():

                order = (
                    Order.objects
                    .select_for_update()
                    .get(
                        order_number=order_number
                    )
                )

                payment = Payment.objects.get(
                    order=order
                )

                # ------------------------------------------
                # Already processed
                # ------------------------------------------

                if (
                    payment.payment_status == "paid"
                    and
                    order.payment_status == "paid"
                ):

                    return Response(
                        {
                            "message": "Already processed"
                        },
                        status=200
                    )

                # ------------------------------------------
                # Payment update
                # ------------------------------------------

                payment.payment_status = "paid"
                payment.payment_reference = intent["id"]

                payment.save(
                    update_fields=[
                        "payment_status",
                        "payment_reference",
                        "updated_at"
                    ]
                )

                # ------------------------------------------
                # Order update
                # ------------------------------------------

                order.payment_status = "paid"
                order.status = "confirmed"

                order.save(
                    update_fields=[
                        "payment_status",
                        "status",
                        "updated_at"
                    ]
                )

                # ------------------------------------------
                # Remove user's cart
                # ------------------------------------------

                Cart.objects.filter(
                    user=order.user
                ).delete()

                # ------------------------------------------
                # Tracking
                # ------------------------------------------

                Tracking.objects.create(
                    order=order,
                    status="confirmed",
                    remark="Stripe payment confirmed"
                )

        except Order.DoesNotExist:

            return Response(
                {
                    "message": "Order not found"
                },
                status=404
            )

    # ========================================================
    # PAYMENT FAILED
    # ========================================================

    elif event["type"] == "payment_intent.payment_failed":

        intent = event["data"]["object"]

        order_number = intent.get(
            "metadata",
            {}
        ).get("order_number")

        if not order_number:

            return Response(
                {
                    "message": "Order number missing"
                },
                status=400
            )

        try:

            with transaction.atomic():

                order = (
                    Order.objects
                    .select_for_update()
                    .get(
                        order_number=order_number
                    )
                )

                payment = Payment.objects.get(
                    order=order
                )

                # ------------------------------------------
                # IMPORTANT:
                # Don't restore stock twice
                # ------------------------------------------

                if (
                    order.status == "cancelled"
                    and
                    order.payment_status == "failed"
                ):

                    return Response(
                        {
                            "message": "Already processed"
                        },
                        status=200
                    )

                # ------------------------------------------
                # Mark payment failed
                # ------------------------------------------

                payment.payment_status = "failed"

                payment.save(
                    update_fields=[
                        "payment_status",
                        "updated_at"
                    ]
                )

                # ------------------------------------------
                # Mark order failed
                # ------------------------------------------

                order.payment_status = "failed"
                order.status = "cancelled"

                order.save(
                    update_fields=[
                        "payment_status",
                        "status",
                        "updated_at"
                    ]
                )

                # ------------------------------------------
                # Restore stock
                # ------------------------------------------

                for item in (
                    OrderItem.objects
                    .filter(order=order)
                    .select_related("product")
                ):

                    if not item.product:
                        continue

                    product = (
                        Product.objects
                        .select_for_update()
                        .get(
                            id=item.product.id
                        )
                    )

                    product.quantity += item.quantity

                    product.in_stock = (
                        product.quantity > 0
                    )

                    product.save(
                        update_fields=[
                            "quantity",
                            "in_stock"
                        ]
                    )

                # ------------------------------------------
                # Tracking
                # ------------------------------------------

                Tracking.objects.create(
                    order=order,
                    status="cancelled",
                    remark="Stripe payment failed - stock restored"
                )

        except Order.DoesNotExist:

            return Response(
                {
                    "message": "Order not found"
                },
                status=404
            )

    # ========================================================
    # RESPONSE
    # ========================================================

    return Response(
        {
            "message": "Webhook received"
        },
        status=200
    )



