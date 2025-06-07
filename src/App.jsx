import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { usePaginatedProducts } from "./hooks/usePaginatedProducts";
// import UploadProducts from "./utils/uploadProducts"; // Optional for dev only

function AppContent() {
  const { user } = useAuth();
  const { products, loading, error, fetchProducts, hasMore } =
    usePaginatedProducts();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {user && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Root redirect based on auth status */}
          <Route
            path="/"
            element={user ? <Navigate to="/home" replace /> : <Login />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/home" replace /> : <Login />}
          />

          {/* Signup route */}
          <Route path="/signup" element={<SignUpPage />} />

          {/* Authenticated routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <LandingPage products={products} loading={loading} />
              </PrivateRoute>
            }
          />

          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductListingPage
                  products={products}
                  loading={loading}
                  error={error}
                  onLoadMore={() => fetchProducts(true)}
                  hasMore={hasMore}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <PrivateRoute>
                <ProductDetailPage products={products} />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            }
          />

          {/* Optional admin/dev route */}
          {/* <Route path="/upload" element={<UploadProducts />} /> */}
        </Routes>
      </main>

      {/* Footer for logged-in users */}
      {user && (
        <footer className="bg-gray-800 text-white text-center py-4">
          <p>
            &copy; {new Date().getFullYear()} Qlothe. All rights reserved.
          </p>
        </footer>
      )}
    </div>
  );
}

const App = () => (
  <AuthProvider>
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;
