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
)


admin.site.register(User)
admin.site.register(Category)

admin.site.register(Product)
admin.site.register(ProductImage)

admin.site.register(Cart)
admin.site.register(Address)
admin.site.register(Payment)
admin.site.register(Tracking)

