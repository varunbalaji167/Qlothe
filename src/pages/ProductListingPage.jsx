import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import BackToTopButton from "../components/BackToTopButton";

const ProductListingPage = ({
  products = [],
  loading,
  error,
  onLoadMore,
  hasMore,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = products.filter((product) => {
    const gender = product.gender?.toLowerCase() || "";
    const name = product.name?.toLowerCase() || "";
    const brand = product.brand?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";

    const matchCategory =
      categoryFilter === "all" || gender === categoryFilter.toLowerCase();
    const matchSearch =
      name.includes(searchTerm.toLowerCase()) ||
      brand.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12 lg:px-20">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <input
          type="text"
          placeholder="Search stylish essentials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border border-gray-200 bg-white p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm transition"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full md:w-1/4 border border-gray-200 bg-white p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
        >
          <option value="all">All Genders</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          {/* <option value="Unisex">Unisex</option> */}
        </select>
      </div>

      {/* Product Grid or Messages */}
      {loading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-lg font-semibold mt-12">
          {error}
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-14">
              <button
                onClick={() => onLoadMore(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-8 py-3 rounded-full shadow-md transition-all duration-300 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Loading more..." : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-20 text-gray-500 text-lg font-medium">
          No products match your search. Try something else!
        </div>
      )}

      {/* Back to Top */}
      <BackToTopButton />
    </div>
  );
};

export default ProductListingPage;
