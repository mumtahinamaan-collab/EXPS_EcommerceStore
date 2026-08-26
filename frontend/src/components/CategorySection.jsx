import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CategorySection() {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get("/api/categories/")
    .then((response) => {

        const allowedCategories = [
            "Fashion","Makeup","Fragrance","Bags","Shoes","jewellery","Watches","Smartphones",];

        const filteredCategories = response.data.filter(
            (category) => allowedCategories.includes(category.name)
        );

        setCategories(filteredCategories);

    })
    .catch((error) => {
        console.error("Category API Error:", error);
    });
},[])

    return (

        <section className="py-2">

            {/* Heading */}

            <div className="flex px-8 items-center justify-between mb-5">

                <h2 className="text-3xl  font-bold text-gray-900">
                    Shop By Category
                </h2>

                <Link
                    to="/products"
                    className="text-sm font-semibold text-red-500 hover:text-red-600"
                >
                    View All Categories →
                </Link>

            </div>


            {/* Categories */}

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">

                {categories.map((category) => (

                    <Link
                        key={category.id}
                        to={`/products/${category.slug}`}
                        className="group text-center"
                    >

                        {/* Image Circle */}

                        <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:scale-105">

                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-contain"
                            />

                        </div>


                        {/* Category Name */}

                        <p className="mt-3 text-sm font-medium text-gray-800 group-hover:text-red-500 transition-colors">

                            {category.name}

                        </p>

                    </Link>

                ))}

            </div>

        </section>

    );
}

export default CategorySection;