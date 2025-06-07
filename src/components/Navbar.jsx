import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-md px-10 py-5 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200">
      <Link
        to="/home"
        className="text-3xl font-serif font-extrabold tracking-tight text-gray-900 hover:text-indigo-600 transition-all duration-300"
      >
        Qlothe
      </Link>

      <ul className="flex space-x-8 text-gray-800 font-medium items-center text-lg">
        <li>
          <Link
            to="/home"
            className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
          >
            Shop
          </Link>
        </li>
        <li className="relative">
          <Link
            to="/cart"
            className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-4 -right-4 bg-rose-500 text-white text-[12px] font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-xl ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </Link>
        </li>

        {user ? (
          <>
            <li>
              <Link
                to="/profile"
                className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-semibold transition-all duration-200"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/"
              className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;