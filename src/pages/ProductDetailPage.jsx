import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductDetailPage = ({ products }) => {
  const { id } = useParams();
  const { cart = [], addToCart, removeFromCart, updateQuantity } = useCart();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(
        (p) =>
          p.ProductID === id ||
          p.id === id ||
          p.ProductID?.toString() === id ||
          p.sku === id
      );
      setProduct(found || null);
    }
  }, [id, products]);

  if (!product) {
    return (
      <p className="p-6 text-red-500 text-center text-lg font-medium">
        Product not found!
      </p>
    );
  }

  const productId = product.ProductID ?? product.id ?? product.sku;
  const cartItem = cart.find(
    (item) =>
      item.ProductID === productId ||
      item.id === productId ||
      item.sku === productId
  );

  const imageList = product.images?.split("~").map((url) => url.trim());

  const handleAddToCart = () => {
    const productData = {
      ProductID: productId,
      ProductName: product.ProductName ?? product.name ?? "Unnamed Product",
      ProductBrand: product.ProductBrand ?? product.brand ?? "Unknown Brand",
      Price: parseFloat(product.Price ?? product.price ?? 0),
      image: product.images?.split("~")[0].trim() || "/placeholder.jpg",
      quantity: 1,
    };
    addToCart(productData);
  };

  const handleIncrease = () => {
    updateQuantity(productId, (cartItem?.quantity || 1) + 1);
  };

  const handleDecrease = () => {
    if ((cartItem?.quantity || 1) > 1) {
      updateQuantity(productId, cartItem.quantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-6 md:px-12 lg:px-24 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Product Images */}
        <div className="w-full">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            className="w-full max-w-lg"
          >
            {imageList?.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="rounded-xl w-full h-[420px] object-contain border border-gray-200 shadow-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-start space-y-6">
          <h2 className="text-4xl font-extrabold text-gray-900 leading-snug">
            {product.ProductName ?? product.name}
          </h2>
          <p className="text-lg text-gray-500 italic">
            {product.ProductBrand ?? product.brand}
          </p>
          <p className="text-3xl font-semibold text-blue-700">
            ₹{product.Price ?? product.price}
          </p>
          <p className="text-gray-600 leading-relaxed text-md">
            {product.Description ?? product.description}
          </p>

          {/* Cart Buttons */}
          {cartItem ? (
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={handleDecrease}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
              >
                −
              </button>
              <span className="font-medium text-xl">{cartItem.quantity}</span>
              <button
                onClick={handleIncrease}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 w-fit"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
