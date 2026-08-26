
import React, { useEffect, useState } from "react";
import ProductCard from "../components/Productcard";
import { useNavigate, useParams } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 9;

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    fetch("https://exps-ecommercestore.onrender.com/api/products/")
      .then((response) => response.json())
      .then((data) => {
        const productData = Array.isArray(data)
          ? data
          : data.results || [];

        setProducts(productData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("PRODUCTS ERROR:", error);
        setLoading(false);
      });
  }, []);

  // ==========================================
  // SET CATEGORY FROM URL
  // ==========================================

  useEffect(() => {
    if (!categorySlug) {
      setCategory("All");
      setCurrentPage(1);
      return;
    }

    const matchedProduct = products.find(
      (product) => product.category_slug === categorySlug
    );

    if (matchedProduct) {
      setCategory(matchedProduct.category_name);
      setCurrentPage(1);
    } else if (products.length > 0) {
      setCategory("All");
    }
  }, [categorySlug, products]);

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category_name)
        .filter(Boolean)
    ),
  ];

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  let filteredProducts = products.filter((product) => {
    const price = Number(product.price);

    const categoryMatch =
      category === "All" ||
      product.category_name === category;

    const minMatch =
      minPrice === "" ||
      price >= Number(minPrice);

    const maxMatch =
      maxPrice === "" ||
      price <= Number(maxPrice);

    return categoryMatch && minMatch && maxMatch;
  });

  // ==========================================
  // SORT PRODUCTS
  // ==========================================

  if (sort === "low") {
    filteredProducts.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  }

  if (sort === "high") {
    filteredProducts.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  }

  if (sort === "newest") {
    filteredProducts.sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    );
  }

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // ==========================================
  // CATEGORY CLICK
  // ==========================================

  const handleCategoryClick = (cat) => {
    setCurrentPage(1);

    if (cat === "All") {
      navigate("/products");
      return;
    }

    const selectedProduct = products.find(
      (product) => product.category_name === cat
    );

    if (selectedProduct?.category_slug) {
      navigate(
        `/products/${selectedProduct.category_slug}`
      );
    }
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setCurrentPage(1);

    navigate("/products");
  };

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-3 py-6 sm:px-5 sm:py-10 md:px-8">

      <div className="mx-auto w-full max-w-7xl">

        {/* PAGE HEADER */}

        <div className="mb-6 rounded-2xl bg-white px-5 py-6 shadow-lg sm:rounded-3xl sm:px-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {category === "All"
                  ? "All Products"
                  : category}
              </h1>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Find the perfect products for you
              </p>

            </div>

            {/* SORT */}

            <div className="flex items-center gap-2">

              <label className="text-sm font-medium text-gray-700">
                Sort by:
              </label>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
              >

                <option value="newest">
                  Newest
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

          {/* SIDEBAR */}

          <aside className="lg:col-span-1">

            <div className="rounded-2xl bg-white p-5 shadow-lg sm:rounded-3xl">

              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Categories
              </h2>

              <div className="space-y-2">

                {categories.map((cat) => (

                  <button
                    key={cat}
                    onClick={() =>
                      handleCategoryClick(cat)
                    }
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      category === cat
                        ? "bg-red-500 font-semibold text-white shadow-sm"
                        : "text-gray-600 hover:bg-rose-50 hover:text-red-500"
                    }`}
                  >
                    {cat}
                  </button>

                ))}

              </div>

              {/* DIVIDER */}

              <div className="my-6 border-t border-gray-200" />

              {/* PRICE */}

              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Price Range
              </h2>

              <div className="grid grid-cols-2 gap-2">

                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="min-h-[44px] w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />

                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="min-h-[44px] w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />

              </div>

              {/* CLEAR */}

              <button
                onClick={clearFilters}
                className="mt-4 min-h-[44px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-red-500 hover:bg-red-50 hover:text-red-500"
              >
                Clear Filters
              </button>

            </div>

          </aside>

          {/* PRODUCTS */}

          <main className="lg:col-span-3">

            {/* RESULT COUNT */}

            <div className="mb-5 rounded-xl bg-white px-4 py-3 shadow-sm">

              <p className="text-sm text-gray-500">

                Showing{" "}

                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}

                products

              </p>

            </div>

            {/* LOADING */}

            {loading ? (

              <div className="rounded-2xl bg-white py-24 text-center shadow-lg">

                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-500" />

                <p className="text-sm text-gray-500">
                  Loading products...
                </p>

              </div>

            ) : filteredProducts.length === 0 ? (

              /* NO PRODUCTS */

              <div className="rounded-2xl bg-white px-5 py-20 text-center shadow-lg sm:rounded-3xl">

                <h2 className="text-xl font-bold text-gray-900">
                  No Products Found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              <>

                {/* PRODUCT GRID */}

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">

                  {currentProducts.map((product) => (

                    <ProductCard
                      key={product.id}
                      product={product}
                    />

                  ))}

                </div>

                {/* PAGINATION */}

                {totalPages > 1 && (

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">

                    <button
                      onClick={() =>
                        changePage(currentPage - 1)
                      }
                      disabled={currentPage === 1}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Prev
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => (

                        <button
                          key={index + 1}
                          onClick={() =>
                            changePage(index + 1)
                          }
                          className={`h-10 w-10 rounded-lg border text-sm font-medium transition ${
                            currentPage === index + 1
                              ? "border-red-500 bg-red-500 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-red-400 hover:text-red-500"
                          }`}
                        >
                          {index + 1}
                        </button>

                      )
                    )}

                    <button
                      onClick={() =>
                        changePage(currentPage + 1)
                      }
                      disabled={
                        currentPage === totalPages
                      }
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>

                  </div>

                )}

              </>

            )}

          </main>

        </div>

      </div>

    </div>
  );
};

export default Products;
