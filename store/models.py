from django.db import models
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
# ==================================================
# USER
# ==================================================

class User(models.Model):

    first_name = models.CharField(
        max_length=50
    )

    last_name = models.CharField(
        max_length=50
    )

    email = models.EmailField(
        max_length=50,
        unique=True
    )
    password=models.CharField(
        max_length=50)

    reg_date = models.DateTimeField(
        auto_now_add=True
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


    def __str__(self):
        return f"{self.first_name} {self.last_name}"


# ==================================================
# CATEGORY
# ==================================================

class Category(models.Model):

    name = models.CharField(
        max_length=100
    )

    image = models.ImageField(
        upload_to="category_images/",
        blank=True,
        null=True
    )
    slug = models.SlugField(max_length=100, blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name


# ==================================================
# PRODUCT
# ==================================================

class Product(models.Model):

    name = models.CharField(
        max_length=100
    )

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    image = models.ImageField(
        upload_to="product_images/"
    )

    brand = models.CharField(
        max_length=100,
        default="Generic"
    )

    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    sku = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    in_stock = models.BooleanField(
        default=True
    )

    quantity = models.PositiveIntegerField(
        default=0
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )

    # Product rating information
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0
    )

    review_count = models.PositiveIntegerField(
        default=0
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

        if not self.sku:
            self.sku = "SKU-" + uuid.uuid4().hex[:10].upper()

        super().save(*args, **kwargs)


# ==================================================
# PRODUCT IMAGE
# ==================================================

class ProductImage(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="product_images/"
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
        return f"{self.product.name} - Image {self.id}"


# ==================================================
# CART
# ==================================================

class Cart(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="cart"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,null=True,blank=True
    )
    quantity = models.PositiveIntegerField(
        default=1
    )
    is_order_placed=models.BooleanField(
        default=False
    )
    order_number=models.CharField(max_length=100,null=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.order_number} - {self.user}"
# ==================================================
# ADDRESS
# ==================================================

class Address(models.Model):

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="addresses")
    order_number=models.CharField(max_length=100,null=True)
    address = models.TextField(max_length=255,blank=True)
    order_at = models.DateTimeField(auto_now_add=True)
    order_final_status=models.CharField(max_length=100,null=True)
    def __str__(self):
        return f"{self.order_number} - {self.user}"

# PAYMENT

class Payment(models.Model):
    PAYMENT_CHOICES=[
        ("cod", "Cash on Delivery"),
        ("online", "Online Payments"),

    ]
    

    user = models.ForeignKey(User,on_delete=models.CASCADE)
    order_number=models.CharField(max_length=100,null=True)

    payment_method = models.CharField(max_length=20,choices=PAYMENT_CHOICES)
    card_number = models.CharField( max_length=20,null=True,blank=True)
    card_holder = models.CharField( max_length=20,null=True,blank=True)
    expiry_date = models.CharField(max_length=5, null=True, blank=True)
    cvv=models.CharField(max_length=3,null=True,blank=True)
    Payment_date = models.DateTimeField(auto_now_add=True)


    def __str__(self):
         return f"{self.order_number} **** {self.payment_method}"

# TRACKING

class Tracking(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
        ]
    cart = models.ForeignKey(Cart,on_delete=models.CASCADE)
    remark=models.CharField(max_length=200,null=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="pending")
    status_date = models.DateTimeField(auto_now_add=True)
    order_cancelled_by_user=models.BooleanField(null=True)
    def __str__(self):
        return f"{self.cart.order_number} - {self.status}"
