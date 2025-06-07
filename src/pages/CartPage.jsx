import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const getProductId = (product) =>
    product.ProductID ?? product.id ?? product.sku ?? product.ProductName;

  const handleIncrease = (item) => {
    updateQuantity(getProductId(item), (item.quantity || 1) + 1);
  };

  const handleDecrease = (item) => {
    if ((item.quantity || 1) > 1) {
      updateQuantity(getProductId(item), item.quantity - 1);
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + (item.Price ?? 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="p-8 max-w-4xl mt-2 mb-2 mx-auto bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center text-xl">
          Your cart is empty. Start shopping and add some items!
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={getProductId(item)}
                className="flex items-center justify-between border border-gray-300 rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt={item.ProductName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.ProductName}
                    </h2>
                    <p className="text-sm text-gray-500">{item.ProductBrand}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleDecrease(item)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition duration-200"
                      >
                        −
                      </button>
                      <span className="text-lg font-medium text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition duration-200"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm text-gray-700 mt-2">
                      Price: ₹{(item.Price * (item.quantity || 1)).toFixed(2)}
                    </p>

                    <Link
                      to={`/products/${getProductId(item)}`}
                      className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                    >
                      View Product
                    </Link>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(getProductId(item))}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition duration-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Total: ₹{totalPrice.toFixed(2)}
            </h2>
            <div className="flex gap-6">
              <button
                onClick={clearCart}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
