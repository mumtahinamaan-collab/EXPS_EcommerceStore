from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from store.models import Category, Product
from django.utils.text import slugify

from PIL import Image, ImageDraw
from io import BytesIO


class Command(BaseCommand):

    help = "Create dummy fashion categories and products"

    def create_image(self, product_name, category_name):
        image = Image.new("RGB", (800, 1000), "white")
        draw = ImageDraw.Draw(image)

        # Category-based background
        backgrounds = {
            "Clothing": "#f5e6dc",
            "Dresses": "#f7d6e0",
            "Tops": "#e5d9f2",
            "Bottoms": "#dce8f5",
            "Shoes": "#eadcc8",
            "Bags": "#e8d5c4",
            "Accessories": "#e6e6e6",
        }

        bg = backgrounds.get(category_name, "#f5f5f5")

        image = Image.new("RGB", (800, 1000), bg)
        draw = ImageDraw.Draw(image)

        # Simple fashion-style placeholder
        draw.rectangle(
            (120, 180, 680, 820),
            fill="white",
            outline="#cccccc",
            width=4,
        )

        draw.text(
            (400, 450),
            category_name,
            fill="#333333",
            anchor="mm",
        )

        draw.text(
            (400, 520),
            product_name[:35],
            fill="#666666",
            anchor="mm",
        )

        buffer = BytesIO()
        image.save(buffer, format="JPEG", quality=90)

        return ContentFile(
            buffer.getvalue(),
            name=f"{slugify(product_name)}.jpg",
        )

    def handle(self, *args, **kwargs):

        categories_data = [
            "Clothing",
            "Dresses",
            "Tops",
            "Bottoms",
            "Shoes",
            "Bags",
            "Accessories",
        ]

        categories = {}

        for name in categories_data:
            category, created = Category.objects.get_or_create(
                name=name,
                defaults={
                    "slug": slugify(name),
                },
            )

            if not category.slug:
                category.slug = slugify(name)
                category.save()

            categories[name] = category

        products = [

            # ================= CLOTHING =================

            {
                "name": "Classic Casual Outfit",
                "category": "Clothing",
                "price": "49.99",
                "brand": "StyleHub",
                "quantity": 25,
            },
            {
                "name": "Elegant Everyday Wear",
                "category": "Clothing",
                "price": "59.99",
                "brand": "UrbanStyle",
                "quantity": 20,
            },
            {
                "name": "Premium Cotton Outfit",
                "category": "Clothing",
                "price": "69.99",
                "brand": "CottonHouse",
                "quantity": 18,
            },
            {
                "name": "Modern Casual Set",
                "category": "Clothing",
                "price": "54.99",
                "brand": "FashionLine",
                "quantity": 30,
            },
            {
                "name": "Classic Summer Outfit",
                "category": "Clothing",
                "price": "64.99",
                "brand": "StyleHub",
                "quantity": 22,
            },

            # ================= DRESSES =================

            {
                "name": "Floral Summer Dress",
                "category": "Dresses",
                "price": "79.99",
                "brand": "RoseWear",
                "quantity": 15,
            },
            {
                "name": "Elegant Evening Dress",
                "category": "Dresses",
                "price": "119.99",
                "brand": "LuxeStyle",
                "quantity": 10,
            },
            {
                "name": "Classic Midi Dress",
                "category": "Dresses",
                "price": "89.99",
                "brand": "UrbanStyle",
                "quantity": 17,
            },
            {
                "name": "Printed Casual Dress",
                "category": "Dresses",
                "price": "69.99",
                "brand": "RoseWear",
                "quantity": 25,
            },
            {
                "name": "Satin Party Dress",
                "category": "Dresses",
                "price": "129.99",
                "brand": "LuxeStyle",
                "quantity": 8,
            },

            # ================= TOPS =================

            {
                "name": "Basic Cotton Top",
                "category": "Tops",
                "price": "29.99",
                "brand": "CottonHouse",
                "quantity": 40,
            },
            {
                "name": "Oversized Casual Top",
                "category": "Tops",
                "price": "34.99",
                "brand": "UrbanStyle",
                "quantity": 30,
            },
            {
                "name": "Elegant Satin Top",
                "category": "Tops",
                "price": "49.99",
                "brand": "LuxeStyle",
                "quantity": 18,
            },
            {
                "name": "Ribbed Knit Top",
                "category": "Tops",
                "price": "39.99",
                "brand": "StyleHub",
                "quantity": 27,
            },
            {
                "name": "Printed Summer Top",
                "category": "Tops",
                "price": "32.99",
                "brand": "RoseWear",
                "quantity": 35,
            },

            # ================= BOTTOMS =================

            {
                "name": "High Waist Jeans",
                "category": "Bottoms",
                "price": "59.99",
                "brand": "DenimCo",
                "quantity": 25,
            },
            {
                "name": "Wide Leg Trousers",
                "category": "Bottoms",
                "price": "54.99",
                "brand": "UrbanStyle",
                "quantity": 20,
            },
            {
                "name": "Classic Straight Pants",
                "category": "Bottoms",
                "price": "49.99",
                "brand": "StyleHub",
                "quantity": 30,
            },
            {
                "name": "Casual Denim Skirt",
                "category": "Bottoms",
                "price": "44.99",
                "brand": "DenimCo",
                "quantity": 22,
            },
            {
                "name": "Pleated Midi Skirt",
                "category": "Bottoms",
                "price": "47.99",
                "brand": "RoseWear",
                "quantity": 19,
            },

            # ================= SHOES =================

            {
                "name": "Classic White Sneakers",
                "category": "Shoes",
                "price": "74.99",
                "brand": "StepStyle",
                "quantity": 20,
            },
            {
                "name": "Elegant Block Heels",
                "category": "Shoes",
                "price": "89.99",
                "brand": "LuxeStyle",
                "quantity": 15,
            },
            {
                "name": "Casual Slip On Shoes",
                "category": "Shoes",
                "price": "64.99",
                "brand": "StepStyle",
                "quantity": 25,
            },
            {
                "name": "Classic Ankle Boots",
                "category": "Shoes",
                "price": "99.99",
                "brand": "UrbanStyle",
                "quantity": 12,
            },
            {
                "name": "Minimal Sandals",
                "category": "Shoes",
                "price": "39.99",
                "brand": "StepStyle",
                "quantity": 30,
            },

            # ================= BAGS =================

            {
                "name": "Classic Leather Handbag",
                "category": "Bags",
                "price": "99.99",
                "brand": "LuxeStyle",
                "quantity": 15,
            },
            {
                "name": "Mini Shoulder Bag",
                "category": "Bags",
                "price": "59.99",
                "brand": "StyleHub",
                "quantity": 20,
            },
            {
                "name": "Elegant Tote Bag",
                "category": "Bags",
                "price": "79.99",
                "brand": "UrbanStyle",
                "quantity": 18,
            },
            {
                "name": "Casual Crossbody Bag",
                "category": "Bags",
                "price": "69.99",
                "brand": "RoseWear",
                "quantity": 25,
            },
            {
                "name": "Premium Evening Clutch",
                "category": "Bags",
                "price": "84.99",
                "brand": "LuxeStyle",
                "quantity": 10,
            },

            # ================= ACCESSORIES =================

            {
                "name": "Minimal Gold Necklace",
                "category": "Accessories",
                "price": "34.99",
                "brand": "LuxeStyle",
                "quantity": 30,
            },
            {
                "name": "Classic Sunglasses",
                "category": "Accessories",
                "price": "39.99",
                "brand": "StyleHub",
                "quantity": 25,
            },
            {
                "name": "Elegant Wrist Watch",
                "category": "Accessories",
                "price": "89.99",
                "brand": "UrbanStyle",
                "quantity": 15,
            },
            {
                "name": "Pearl Bracelet",
                "category": "Accessories",
                "price": "29.99",
                "brand": "RoseWear",
                "quantity": 35,
            },
            {
                "name": "Classic Fashion Belt",
                "category": "Accessories",
                "price": "24.99",
                "brand": "StyleHub",
                "quantity": 40,
            },
        ]

        created_count = 0

        for data in products:

            category = categories[data["category"]]

            product, created = Product.objects.get_or_create(
                name=data["name"],
                defaults={
                    "description": (
                        f"Beautiful {data['name']} "
                        f"from our {data['category']} collection. "
                        "Designed for a stylish and comfortable look."
                    ),
                    "price": data["price"],
                    "brand": data["brand"],
                    "quantity": data["quantity"],
                    "in_stock": True,
                    "category": category,
                    "slug": slugify(data["name"]),
                },
            )

            if created:
                image = self.create_image(
                    data["name"],
                    data["category"],
                )

                product.image.save(
                    image.name,
                    image,
                    save=True,
                )

                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {created_count} products!"
            )
        )