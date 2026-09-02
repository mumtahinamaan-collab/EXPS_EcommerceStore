from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from store.models import (
    User,
    Category,
    Product,
    Cart,
)


class AuthenticationTests(APITestCase):

    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("login")
        self.me_url = reverse("current-user")

        self.user_data = {
            "first_name": "Test",
            "last_name": "User",
            "email": "test@example.com",
            "password": "TestPassword123",
        }

    def test_register_user(self):
        response = self.client.post(
            self.register_url,
            self.user_data,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertTrue(
            User.objects.filter(
                email="test@example.com"
            ).exists()
        )

    def test_register_duplicate_user(self):
        User.objects.create_user(
            email="test@example.com",
            password="TestPassword123",
            first_name="Test",
            last_name="User",
        )

        response = self.client.post(
            self.register_url,
            self.user_data,
            format="json"
        )

        self.assertNotEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

    def test_login_user(self):
        User.objects.create_user(
            email="test@example.com",
            password="TestPassword123",
            first_name="Test",
            last_name="User",
        )

        response = self.client.post(
            self.login_url,
            {
                "email": "test@example.com",
                "password": "TestPassword123",
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_wrong_password(self):
        User.objects.create_user(
            email="test@example.com",
            password="TestPassword123",
            first_name="Test",
            last_name="User",
        )

        response = self.client.post(
            self.login_url,
            {
                "email": "test@example.com",
                "password": "WrongPassword123",
            },
            format="json"
        )

        self.assertNotEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_current_user_requires_authentication(self):
        response = self.client.get(self.me_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_current_user_authenticated(self):
        user = User.objects.create_user(
            email="test@example.com",
            password="TestPassword123",
            first_name="Test",
            last_name="User",
        )

        self.client.force_authenticate(user=user)

        response = self.client.get(self.me_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )


class CategoryTests(APITestCase):

    def setUp(self):
        self.category_url = reverse("category-list")

        self.category = Category.objects.create(
            name="Fashion"
        )

    def test_category_list(self):
        response = self.client.get(
            self.category_url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_category_exists(self):
        self.assertTrue(
            Category.objects.filter(
                name="Fashion"
            ).exists()
        )


class ProductTests(APITestCase):

    def setUp(self):
        self.category = Category.objects.create(
            name="Fashion"
        )

        self.product = Product.objects.create(
            name="Test Product",
            category=self.category,
            price=1000,
        )

    def test_product_list(self):
        url = reverse("product-list")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_random_products(self):
        url = reverse("random-products")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_product_search(self):
        url = reverse("product-search")

        response = self.client.get(
            url,
            {"q": "Test"},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )


class CartTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="cart@example.com",
            password="TestPassword123",
            first_name="Cart",
            last_name="User",
        )

        self.category = Category.objects.create(
            name="Fashion"
        )

        self.product = Product.objects.create(
            name="Cart Product",
            category=self.category,
            price=1500,
        )

        self.client.force_authenticate(
            user=self.user
        )

    def test_get_cart(self):
        url = reverse("cart")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_add_to_cart(self):
        url = reverse("cart-add")

        response = self.client.post(
            url,
            {
                "product_id": self.product.id,
                "quantity": 1,
            },
            format="json"
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_200_OK,
                status.HTTP_201_CREATED,
            ]
        )

    def test_cart_requires_authentication(self):
        self.client.force_authenticate(
            user=None
        )

        url = reverse("cart")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )


class OrderTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="order@example.com",
            password="TestPassword123",
            first_name="Order",
            last_name="User",
        )

        self.client.force_authenticate(
            user=self.user
        )

    def test_my_orders(self):
        url = reverse("my-orders")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_orders_require_authentication(self):
        self.client.force_authenticate(
            user=None
        )

        url = reverse("my-orders")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )


class ModelTests(TestCase):

    def test_create_user(self):
        user = User.objects.create_user(
            email="model@example.com",
            password="TestPassword123",
            first_name="Model",
            last_name="User",
        )

        self.assertEqual(
            user.email,
            "model@example.com"
        )

        self.assertTrue(
            user.check_password(
                "TestPassword123"
            )
        )

    def test_create_category(self):
        category = Category.objects.create(
            name="Electronics"
        )

        self.assertEqual(
            category.name,
            "Electronics"
        )

    def test_category_count(self):
        Category.objects.create(
            name="Fashion"
        )

        Category.objects.create(
            name="Shoes"
        )

        self.assertEqual(
            Category.objects.count(),
            2
        )