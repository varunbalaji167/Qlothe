import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const getProductId = (product) =>
  product.ProductID ?? product.id ?? product.sku ?? product.ProductName;

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialFetchDone = useRef(false);

  // Load cart from Firestore on login
  useEffect(() => {
    const fetchCart = async () => {
      if (!user || initialFetchDone.current) return;

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const savedCart = userData.cart || [];
        // Ensure all items have quantity
        const cleanedCart = savedCart.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));
        setCart(cleanedCart);
      }
      initialFetchDone.current = true;
      setLoading(false);
    };

    fetchCart();
  }, [user]);

  // Sync cart to Firestore
  useEffect(() => {
    const saveCartToFirestore = async () => {
      if (user && initialFetchDone.current) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { cart }, { merge: true });
      }
    };

    saveCartToFirestore();
  }, [cart, user]);

  const addToCart = (product) => {
    const productId = getProductId(product);
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => getProductId(item) === productId
      );
      if (existing) {
        return prevCart.map((item) =>
          getProductId(item) === productId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => getProductId(item) !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        getProductId(item) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
