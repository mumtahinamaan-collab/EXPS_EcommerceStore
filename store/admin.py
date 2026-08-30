from django.contrib import admin

from .models import (
    User,
    Product,
    ProductImage,
    Category,
    Cart,
    Address,
    Payment,
    Tracking,
    Order,
    OrderItem,
)


# ============================================================
# USER
# ============================================================

@admin.register(User)
class UserAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
    )

    search_fields = (
        "email",
        "first_name",
        "last_name",
    )

    list_filter = (
        "is_staff",
        "is_active",
    )


# ============================================================
# CATEGORY
# ============================================================

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "slug",
        "created_at",
    )

    search_fields = (
        "name",
        "slug",
    )

    list_filter = (
        "created_at",
    )


# ============================================================
# PRODUCT
# ============================================================

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "brand",
        "sku",
        "price",
        "quantity",
        "in_stock",
        "category",
        "created_at",
    )

    search_fields = (
        "name",
        "brand",
        "sku",
    )

    list_filter = (
        "category",
        "in_stock",
        "created_at",
    )


# ============================================================
# PRODUCT IMAGE
# ============================================================

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "product",
        "is_main",
        "order",
    )

    search_fields = (
        "product__name",
    )

    list_filter = (
        "is_main",
    )

    ordering = (
        "product",
        "order",
    )


# ============================================================
# ORDER
# ============================================================

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        "order_number",
        "user",
        "total_amount",
        "status",
        "payment_method",
        "payment_status",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "order_number",
        "user__email",
        "user__first_name",
        "user__last_name",
    )

    list_filter = (
        "status",
        "payment_method",
        "payment_status",
        "created_at",
    )

    readonly_fields = (
        "order_number",
        "user",
        "total_amount",
        "payment_method",
        "payment_status",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )


# ============================================================
# ORDER ITEM
# ============================================================

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "order",
        "product",
        "quantity",
        "price",
        "subtotal",
    )

    search_fields = (
        "order__order_number",
        "product__name",
    )

    list_filter = (
        "order__status",
    )


# ============================================================
# CART
# ============================================================

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "product",
        "quantity",
        "created_at",
    )

    search_fields = (
        "user__email",
        "product__name",
    )

    list_filter = (
        "created_at",
    )


# ============================================================
# ADDRESS
# ============================================================

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "order_number",
        "address",
        "order_at",
        "order_final_status",
    )

    search_fields = (
        "order_number",
        "user__email",
        "address",
    )

    list_filter = (
        "order_final_status",
        "order_at",
    )


# ============================================================
# PAYMENT
# ============================================================

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "order",
        "payment_method",
        "payment_status",
        "payment_reference",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "order__order_number",
        "payment_reference",
    )

    list_filter = (
        "payment_method",
        "payment_status",
        "created_at",
    )

    readonly_fields = (
        "order",
        "payment_method",
        "payment_status",
        "payment_reference",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )


# ============================================================
# TRACKING
# ============================================================

@admin.register(Tracking)
class TrackingAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "order",
        "status",
        "remark",
        "status_date",
        "order_cancelled_by_user",
    )

    search_fields = (
        "order__order_number",
        "order__user__email",
        "remark",
    )

    list_filter = (
        "status",
        "order_cancelled_by_user",
        "status_date",
    )

    ordering = (
        "-status_date",
    )