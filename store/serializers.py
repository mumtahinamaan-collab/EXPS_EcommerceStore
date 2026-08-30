from rest_framework import serializers

from .models import (
    Product,
    ProductImage,
    Category,
    Cart,
    Order,
    OrderItem,
    Payment,
    Tracking,
)


# ============================================================
# IMAGE URL HELPER
# ============================================================

def get_image_url(obj, request=None):

    if not obj:
        return None

    image = str(obj)

    # External image URL
    if image.startswith("http://") or image.startswith("https://"):
        return image

    try:
        url = obj.url

        if request:
            return request.build_absolute_uri(url)

        return url

    except (ValueError, AttributeError):
        return None


# ============================================================
# PRODUCT IMAGE SERIALIZER
# ============================================================

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

        return get_image_url(
            obj.image,
            request
        )


# ============================================================
# CATEGORY SERIALIZER
# ============================================================

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

        return get_image_url(
            obj.image,
            request
        )


# ============================================================
# PRODUCT SERIALIZER
# ============================================================

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
            "sku",
            "in_stock",
            "quantity",
            "category",
            "category_name",
            "category_slug",
            "created_at",
            "slug",
        ]

    def get_image_url(self, obj):

        request = self.context.get("request")

        return get_image_url(
            obj.image,
            request
        )


# ============================================================
# CART SERIALIZER
# ============================================================

class CartSerializer(serializers.ModelSerializer):

    product = ProductSerializer(
        read_only=True
    )

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = Cart

        fields = [
            "id",
            "product",
            "quantity",
            "created_at",
            "subtotal",
        ]

    def get_subtotal(self, obj):

        if not obj.product:
            return "0.00"

        total = (
            obj.product.price *
            obj.quantity
        )

        return str(total)


# ============================================================
# ORDER ITEM SERIALIZER
# ============================================================

class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.SerializerMethodField()

    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem

        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "quantity",
            "price",
            "subtotal",
        ]

    def get_product_name(self, obj):

        if obj.product:
            return obj.product.name

        return "Deleted Product"

    def get_product_image(self, obj):

        if not obj.product:
            return None

        request = self.context.get("request")

        return get_image_url(
            obj.product.image,
            request
        )


# ============================================================
# PAYMENT SERIALIZER
# ============================================================

class PaymentSerializer(serializers.ModelSerializer):

    order_number = serializers.CharField(
        source="order.order_number",
        read_only=True
    )

    class Meta:
        model = Payment

        fields = [
            "id",
            "order_number",
            "payment_method",
            "payment_status",
            "payment_reference",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "order_number",
            "payment_status",
            "payment_reference",
            "created_at",
            "updated_at",
        ]


# ============================================================
# TRACKING SERIALIZER
# ============================================================

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


# ============================================================
# ORDER SERIALIZER
# ============================================================

class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    tracking = serializers.SerializerMethodField()

    payment = serializers.SerializerMethodField()

    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Order

        fields = [
            "id",
            "order_number",
            "address",
            "total_amount",
            "status",
            "payment_method",
            "payment_status",
            "created_at",
            "updated_at",
            "items",
            "item_count",
            "tracking",
            "payment",
        ]

    # --------------------------------------------------------
    # ITEM COUNT
    # --------------------------------------------------------

    def get_item_count(self, obj):

        return sum(
            item.quantity
            for item in obj.items.all()
        )

    # --------------------------------------------------------
    # TRACKING
    # --------------------------------------------------------

    def get_tracking(self, obj):

        tracking = (
            Tracking.objects
            .filter(order=obj)
            .order_by("status_date")
        )

        return TrackingSerializer(
            tracking,
            many=True
        ).data

    # --------------------------------------------------------
    # PAYMENT
    # --------------------------------------------------------

    def get_payment(self, obj):

        try:
            payment = obj.payment

        except Payment.DoesNotExist:
            return None

        return PaymentSerializer(
            payment,
            context=self.context
        ).data