import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const LandingPage = ({ products = [], loading = false }) => {
  const featured = products.slice(0, 9);
  const navigate = useNavigate();

  return (
    <div className="bg-white font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#f0f4ff] to-[#e6e8f5] px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
          Welcome to <span className="text-blue-600">Qlothe</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Elevate your style with curated fashion pieces that define modern
          elegance.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300"
        >
          Shop Now
        </button>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center tracking-wide">
          Featured Products
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {Array.from({ length: 9 }).map((_, idx) => (
              <LoadingSkeleton key={idx} />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6 text-lg">
            No featured products available at the moment.
          </p>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
