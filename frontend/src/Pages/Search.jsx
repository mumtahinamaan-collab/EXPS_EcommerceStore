import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/Productcard";
import API_BASE_URL from "../config/api";

const Search = () => {
  const [product, setProduct] = useState([]);

  const location = useLocation();

  const query =
    new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    if (query) {
      fetch(
        `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("SEARCH DATA:", data);
          setProduct(data);
        })
        .catch((error) => {
          console.log("SEARCH ERROR:", error);
        });
    }
  }, [query]);

  return (
    <div className="py-4">

      <h3 className="text-center text-red-500 font-bold text-3xl mb-6">
        Search For: "{query}"
      </h3>

      {product.length === 0 ? (
        <div className="text-center">
          <h3 className="text-xl font-bold">
            We're sorry
          </h3>

          <p>
            We can not find any matches for your search term.
          </p>

          <span className="font-bold">
            Try Different Keyword
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 px-4">

          {product.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
            />
          ))}

        </div>
      )}

    </div>
  );
};

export default Search;