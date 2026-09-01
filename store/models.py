
from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinValueValidator


# ============================================================
# USER MANAGER
# ============================================================

class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):

        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(
                "Superuser must have is_staff=True"
            )

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(
                "Superuser must have is_superuser=True"
            )

        return self.create_user(
            email=email,
            password=password,
            **extra_fields
        )


# ============================================================
# USER
# ============================================================

class User(AbstractUser):

    username = None

    first_name = models.CharField(
        max_length=50
    )

    last_name = models.CharField(
        max_length=50
    )

    email = models.EmailField(
        max_length=100,
        unique=True
    )

    reset_token = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    reset_token_created = models.DateTimeField(
        blank=True,
        null=True
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


# ============================================================
# CATEGORY
# ============================================================

class Category(models.Model):

    name = models.CharField(
        max_length=100
    )

    image = models.ImageField(
        upload_to="category_images/",
        blank=True,
        null=True
    )

    slug = models.SlugField(
        max_length=100,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name


# ============================================================
# PRODUCT
# ============================================================

class Product(models.Model):

    name = models.CharField(
        max_length=100
    )

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(0)
        ]
    )

    image = models.ImageField(
        upload_to="product_images/",
        max_length=500
    )

    brand = models.CharField(
        max_length=100,
        default="Generic"
    )

    sku = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    quantity = models.PositiveIntegerField(
        default=0
    )

    in_stock = models.BooleanField(
        default=True
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    slug = models.SlugField(
        blank=True
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):

        # Generate SKU automatically
        if not self.sku:
            self.sku = (
                "SKU-" +
                uuid.uuid4().hex[:10].upper()
            )

        # Keep stock status synchronized
        self.in_stock = self.quantity > 0

        super().save(*args, **kwargs)


# ============================================================
# PRODUCT IMAGE
# ============================================================

class ProductImage(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="product_images/",
        max_length=500
    )

    is_main = models.BooleanField(
        default=False
    )

    order = models.PositiveIntegerField(
        default=0
    )

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return (
            f"{self.product.name} - "
            f"Image {self.id}"
        )


# ============================================================
# CART
# ============================================================

class Cart(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="cart"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField(
        default=1,
        validators=[
            MinValueValidator(1)
        ]
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product"],
                name="unique_user_product_cart"
            )
        ]

    def __str__(self):
        return (
            f"{self.user} - "
            f"{self.product.name} x {self.quantity}"
        )


# ============================================================
# ORDER
# ============================================================

class Order(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    order_number = models.CharField(
        max_length=100,
        unique=True
    )

    address = models.TextField(
        max_length=255
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[
            MinValueValidator(0)
        ]
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    payment_method = models.CharField(
        max_length=30
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="pending"
    )

    # Prevent stock from being restored more than once
    inventory_restored = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        # Generate order number automatically
        if not self.order_number:
            self.order_number = (
                "ORD-" +
                uuid.uuid4().hex[:12].upper()
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.order_number} - "
            f"{self.user}"
        )


# ============================================================
# ORDER ITEM
# ============================================================

class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_items"
    )

    quantity = models.PositiveIntegerField(
        default=1,
        validators=[
            MinValueValidator(1)
        ]
    )

    # Price at the time of purchase
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(0)
        ]
    )

    # price × quantity
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(0)
        ]
    )

    def __str__(self):

        product_name = (
            self.product.name
            if self.product
            else "Deleted Product"
        )

        return (
            f"{self.order.order_number} - "
            f"{product_name} x {self.quantity}"
        )


# ============================================================
# ADDRESS
# ============================================================

class Address(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="addresses"
    )

    order_number = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    address = models.TextField(
        max_length=255,
        blank=True
    )

    order_at = models.DateTimeField(
        auto_now_add=True
    )

    order_final_status = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    def __str__(self):
        return (
            f"{self.order_number} - "
            f"{self.user}"
        )


# ============================================================
# PAYMENT
# ============================================================
class Payment(models.Model):

    PAYMENT_METHOD_CHOICES = [
        ("cod", "Cash on Delivery"),
        ("stripe", "Stripe"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name="payment",
        null=True,
        blank=True
    )

    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="pending"
    )

    payment_reference = models.CharField(
        max_length=150,
        unique=True,
        null=True,
        blank=True
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    currency = models.CharField(
        max_length=10,
        default="PKR"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.order.order_number} - "
            f"{self.payment_method} - "
            f"{self.payment_status}"
        )

# ============================================================
# TRACKING
# ============================================================

class Tracking(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="tracking"
    )

    remark = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    status_date = models.DateTimeField(
        auto_now_add=True
    )

    order_cancelled_by_user = models.BooleanField(
        default=False
    )

    def __str__(self):
        return (
            f"{self.order.order_number} - "
            f"{self.status}"
        )

