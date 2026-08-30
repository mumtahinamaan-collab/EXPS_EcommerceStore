from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    # Authentication
    register,
    login,
    forgot_password,
    reset_password,
    current_user,

    # Categories
    category_list,

    # Products
    random_products,
    list_product,
    product_detail,
    product_search,

    # Cart
    get_cart_items,
    add_to_cart,
    update_cart_item,
    remove_from_cart,

    # Orders
    create_order,
    confirm_stripe_payment,
    my_orders,
    cancel_order,
)

urlpatterns = [

    # ========================================================
    # CATEGORIES
    # ========================================================

    path(
        "categories/",
        category_list,
        name="category-list"
    ),


    # ========================================================
    # PRODUCTS
    # ========================================================

    path(
        "random/",
        random_products,
        name="random-products"
    ),

    path(
        "products/",
        list_product,
        name="product-list"
    ),

    path(
        "products/search/",
        product_search,
        name="product-search"
    ),

    path(
        "products/<slug:slug>/",
        product_detail,
        name="product-detail"
    ),


    # ========================================================
    # AUTHENTICATION
    # ========================================================

    path(
        "register/",
        register,
        name="register"
    ),

    path(
        "login/",
        login,
        name="login"
    ),

    path(
        "password-reset/",
        forgot_password,
        name="password-reset"
    ),

    path(
        "password-reset/confirm/",
        reset_password,
        name="password-reset-confirm"
    ),

    path(
        "me/",
        current_user,
        name="current-user"
    ),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),


    # ========================================================
    # CART
    # ========================================================

    path(
        "cart/",
        get_cart_items,
        name="cart"
    ),

    path(
        "cart/add/",
        add_to_cart,
        name="cart-add"
    ),

    path(
        "cart/update/",
        update_cart_item,
        name="cart-update"
    ),

    path(
        "cart/delete/<int:cart_id>/",
        remove_from_cart,
        name="cart-delete"
    ),


    # ========================================================
    # ORDERS
    # ========================================================

    path(
        "orders/place/",
        create_order,
        name="place-order"
    ),

    path(
        "orders/",
        my_orders,
        name="my-orders"
    ),

    path(
        "orders/<str:order_number>/cancel/",
        cancel_order,
        name="cancel-order"
    ),
    path(
        "orders/confirm-stripe/",
        confirm_stripe_payment,
        name="confirm-stripe-payment"
),
]