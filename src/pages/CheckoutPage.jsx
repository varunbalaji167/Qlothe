import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedAddressType, setSelectedAddressType] = useState("home");
  const [customAddress, setCustomAddress] = useState("");
  const [profile, setProfile] = useState(null);

  const fetchUserProfile = async () => {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) setProfile(snap.data());
  };

  useEffect(() => {
    if (user?.uid) fetchUserProfile();
  }, [user]);

  const calculateTotal = () =>
    cart
      .reduce(
        (total, item) =>
          total + (item.price ?? item.Price ?? 0) * (item.quantity || 1),
        0
      )
      .toFixed(2);

  const handlePayment = async () => {
    const totalAmount = calculateTotal();

    const shippingAddress =
      selectedAddressType === "other"
        ? customAddress
        : profile?.[`${selectedAddressType}Address`] || "";

    const order = {
      id: Date.now(),
      items: cart,
      total: parseFloat(totalAmount),
      date: new Date().toISOString(),
      shippingAddress, // address stored correctly
    };

    const options = {
      key: "rzp_test_GfC9QqI2cAovaJ",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Qlothe",
      description: "Order Payment",
      image: "/logo.png",
      handler: async () => {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const previousOrders = data.orders || [];
          await updateDoc(ref, {
            orders: [...previousOrders, order],
          });
        }
        clearCart();
        navigate("/profile");
      },
      prefill: {
        name: profile?.name,
        email: profile?.email,
      },
      notes: {
        address: shippingAddress,
        userId: user.uid,
      },
      theme: { color: "#0f172a" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    handlePayment();
  };

  if (!cart?.length) {
    return (
      <div className="p-8 text-center text-red-500 text-lg">
        Your cart is empty 🛍️
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-2 mb-2  mx-auto px-6 py-12 bg-gray-50 rounded-xl shadow-xl">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Checkout
      </h2>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Order Summary
        </h3>
        <div className="divide-y divide-gray-200">
          {cart.map((item) => (
            <div
              key={item.id || item.ProductID}
              className="flex justify-between py-4"
            >
              <div className="text-lg text-gray-700">
                {item.ProductName || item.name}
              </div>
              <div className="text-lg text-gray-700">
                {item.quantity} × ₹{(item.Price ?? item.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6 pt-4 border-t text-xl font-semibold text-gray-900">
          <span>Total:</span>
          <span>₹{calculateTotal()}</span>
        </div>
      </div>

      {/* Address Form */}
      <form
        onSubmit={handleCheckout}
        className="bg-white shadow-md rounded-xl p-8 space-y-6"
      >
        <h3 className="text-2xl font-semibold text-gray-800">
          Shipping Information
        </h3>

        <select
          value={selectedAddressType}
          onChange={(e) => setSelectedAddressType(e.target.value)}
          className="border border-gray-300 rounded-lg w-full px-5 py-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="home">Home Address</option>
          <option value="work">Work Address</option>
          <option value="other">Other</option>
        </select>

        {selectedAddressType === "other" && (
          <textarea
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            placeholder="Enter custom shipping address"
            className="border border-gray-300 rounded-lg w-full h-24 p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        )}

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-all duration-300"
        >
          Pay with Razorpay
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
