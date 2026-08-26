from django.urls import path

from .views import (
    category_list,
    random_products,
    list_product,
    product_detail,
    product_search,
    register,
    login,
    forgot_password,
    reset_password,

    get_cart_items,
    add_to_cart,
    update_cart_item,
    remove_from_cart,
    create_order,
    my_orders,
    cancel_order
)


urlpatterns = [

    # Categories
    path(
        "categories/",
        category_list
    ),

    # Random Products
    path(
        "random/",
        random_products
    ),

    # Products
    path(
        "products/",
        list_product
    ),

    path(
        "products/search/",
        product_search
    ),

    path(
        "products/<slug:slug>/",
        product_detail
    ),

    # Authentication
    path(
        "register/",
        register
    ),

    path(
        "login/",
        login
    ),
    path(
        "password-reset/",
        forgot_password
    ),

    path(
        "password-reset/confirm/",
        reset_password   ),

    # Cart
    path(
        "cart/<int:user_id>/",
        get_cart_items
    ),

    path(
        "cart/add/",
        add_to_cart
    ),

    path(
        "cart/update_quantity/",
        update_cart_item
    ),

    path(
        "cart/delete/<int:cart_id>/",
        remove_from_cart
     ),


#      Orders
    path(
        "place_order/",
        create_order
    ),

    path(
        "orders/<int:user_id>/",
        my_orders
    ),

    path(
        "orders/<int:order_number>/cancel/",
        cancel_order
        )

      
 ]