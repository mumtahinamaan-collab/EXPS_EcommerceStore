from rest_framework import serializers

from .models import (
    Product,
    ProductImage,
    Category,
    Cart,
    Address,
    Payment,
    Tracking,
    
)

# ==================================================
# IMAGE URL HELPER
# ==================================================

def get_image_url(obj, request=None):
    """
    Supports both:

    1. Local uploaded image:
       /media/product_images/shoes.jpg

    2. External image:
       https://cdn.dummyjson.com/...
    """

    if not obj:
        return None

    image = str(obj)

    # External image URL
    if image.startswith("http://") or image.startswith("https://"):
        return image

    # Local image
    try:
        url = obj.url

        if request:
            return request.build_absolute_uri(url)

        return url

    except ValueError:
        return None


# ==================================================
# PRODUCT IMAGE SERIALIZER
# ==================================================

class ProductImageSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage

        fields = [
            "id",
            "image",
            "image_url",
            "is_main",
            "order",
        ]

    def get_image_url(self, obj):

        request = self.context.get("request")

        return get_image_url(obj.image, request)


# ==================================================
# CATEGORY SERIALIZER
# ==================================================

class CategorySerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Category

        fields = [
            "id",
            "name",
            "image",
            "image_url",
            "created_at",
            "slug",
        ]

    def get_image_url(self, obj):

        request = self.context.get("request")

        return get_image_url(obj.image, request)


# ==================================================
# PRODUCT SERIALIZER
# ==================================================

class ProductSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    category_slug = serializers.CharField(
        source="category.slug",
        read_only=True
    )

    image_url = serializers.SerializerMethodField()

    images = ProductImageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Product

        fields = [
            "id",
            "name",
            "description",
            "price",
            "image",
            "image_url",
            "images",
            "brand",
            "discount_percentage",
            "sku",
            "in_stock",
            "quantity",
            "category",
            "category_name",
            "category_slug",
            "average_rating",
            "review_count",
            "created_at",
            "slug",
        ]

    def get_image_url(self, obj):

        request = self.context.get("request")

        return get_image_url(obj.image, request)

# ==================================================
# CART SERIALIZER
# ==================================================

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Cart

        fields = "__all__"

# ==================================================
# TRACKING SERIALIZER
# ==================================================

class TrackingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tracking
        fields = [
            "id",
            "status",
            "remark",
            "status_date",
            "order_cancelled_by_user",
        ]

# ==================================================
# ORDER SERIALIZER
# ==================================================

class OrderSerializer(serializers.ModelSerializer):

    status = serializers.SerializerMethodField()
    tracking = serializers.SerializerMethodField()
    payment_method = serializers.SerializerMethodField()
    products = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Address

        fields = [
            "id",
            "order_number",
            "address",
            "order_at",
            "status",
            "tracking",
            "payment_method",
            "products",
            "total_amount",
        ]

    # ==========================
    # CURRENT ORDER STATUS
    # ==========================

    def get_status(self, obj):

        tracking = Tracking.objects.filter(
            cart__order_number=obj.order_number,
            cart__is_order_placed=True
        ).order_by("-status_date").first()

        if tracking:
            return tracking.status

        return "pending"

    # ==========================
    # TRACKING HISTORY
    # ==========================

    def get_tracking(self, obj):

        tracking = Tracking.objects.filter(
            cart__order_number=obj.order_number,
            cart__is_order_placed=True
        ).order_by("status_date")

        return TrackingSerializer(
            tracking,
            many=True
        ).data

    # ==========================
    # PAYMENT
    # ==========================

    def get_payment_method(self, obj):

        payment = Payment.objects.filter(
            order_number=obj.order_number
        ).first()

        if payment:
            return payment.payment_method

        return "cod"

    # ==========================
    # PRODUCTS
    # ==========================

    def get_products(self, obj):

        carts = Cart.objects.filter(
            order_number=obj.order_number,
            is_order_placed=True
        ).select_related("product")

        data = []

        for cart in carts:

            data.append({
                "product_id": (
                    cart.product.id
                    if cart.product
                    else None
                ),

                "product_name": (
                    cart.product.name
                    if cart.product
                    else "Product"
                ),

                "quantity": cart.quantity,

                "price": (
                    str(cart.product.price)
                    if cart.product
                    else "0.00"
                ),
            })

        return data

    # ==========================
    # TOTAL AMOUNT
    # ==========================

    def get_total_amount(self, obj):

        carts = Cart.objects.filter(
            order_number=obj.order_number,
            is_order_placed=True
        ).select_related("product")

        total = 0

        for cart in carts:

            if cart.product:
                total += (
                    cart.product.price *
                    cart.quantity
                )

        return str(total)