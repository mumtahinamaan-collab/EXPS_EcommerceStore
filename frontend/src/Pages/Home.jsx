import Hero from "../components/Hero.jsx";
import Benefits from "../components/Benefits.jsx";
import ProductCard from "../components/Productcard.jsx";
import CategorySection from "../components/CategorySection.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://exps-ecommercestore.onrender.com/api/random/")
      .then((res) => {
        console.log("RANDOM PRODUCTS API RESPONSE:", res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];

        console.log("RANDOM PRODUCTS:", data);

        setProducts(data);
      })
      .catch((error) => {
        console.error("RANDOM PRODUCTS API ERROR:", error);
      });
  }, []);

  const FreshPicks = products;

  return (
    <div>
      <Hero />

      <Benefits />
      <div className="flex px-8 items-center justify-between mb-5">

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold py-4">
                    Shop By Category
                </h2>

                <Link
                    to="/products"
                    className="hidden md:block text-md py-4 text-red-500 cursor-pointer"
                >
                    View All Categories →
                </Link>

            </div>
      <CategorySection />

      <div className="flex justify-between items-center px-8">
        <div className="text-xl sm:text-2xl md:text-3xl font-bold py-4">Fresh Picks</div>

        <Link
          to="/products"
          className="hidden md:block text-md py-4 text-red-500 cursor-pointer"
        >
          View All Products →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {FreshPicks.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="my-6 flex justify-center md:hidden">
  <Link
    to="/products"
    className="rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
  >
    Explore More Products
  </Link>
</div>
    </div>
  );
}
