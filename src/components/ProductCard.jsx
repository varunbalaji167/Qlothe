import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const {
    cart = [],
    addToCart = () => {},
    removeFromCart = () => {},
    updateQuantity = () => {},
  } = useCart() || {};

  const productId = product.ProductID ?? product.sku ?? product.id;
  const name = product.ProductName ?? product.name ?? "Unnamed Product";
  const brand = product.ProductBrand ?? product.brand ?? "Unknown Brand";
  const price = parseFloat(product.Price ?? product.price ?? 0);

  const image =
    product.imageArray?.[0] ||
    (typeof product.images === "string" && product.images.includes("~")
      ? product.images.split("~")[0].trim()
      : product.images) ||
    "/placeholder.jpg";

  const cartItem = cart.find(
    (item) =>
      item.ProductID === productId ||
      item.id === productId ||
      item.sku === productId
  );

  const handleAddToCart = () => {
    const productData = {
      ProductID: productId,
      ProductName: name,
      ProductBrand: brand,
      Price: price,
      image,
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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4 flex flex-col">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
          {brand}
        </span>
      </div>

      <div className="mt-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{name}</h3>
        <p className="text-gray-600 text-sm mt-1">by {brand}</p>
        <p className="text-lg font-bold text-gray-900 mt-2">₹{price.toFixed(2)}</p>

        <div className="flex justify-between items-center mt-auto pt-4">
          <Link
            to={`/products/${productId}`}
            className="text-sm font-medium text-blue-600 hover:underline hover:text-blue-700 transition"
          >
            View Details
          </Link>

          {cartItem ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrease}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm font-semibold"
              >
                −
              </button>
              <span className="px-2 text-sm font-medium">
                {cartItem.quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm font-semibold"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;