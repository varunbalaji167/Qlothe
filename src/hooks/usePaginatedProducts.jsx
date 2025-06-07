import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
} from "firebase/firestore";

const FETCH_BATCH_SIZE = 100;
const PRODUCTS_PER_PAGE = 24;

const clothingKeywords = [
  "shirt",
  "kurta",
  "t-shirt",
  "jeans",
  "top",
  "jacket",
  "saree",
  "dress",
  "suit",
  "lehenga",
  "hoodie",
  "shorts",
  "trousers",
  "blouse",
  "skirt",
  "coat",
  "sweater",
  "choli",
  "tank",
  "pant",
  "sweatshirt",
  "track",
];

const excludedKeywords = [
  "bag",
  "trolley",
  "watch",
  "sunglasses",
  "wallet",
  "luggage",
  "perfume",
  "belt",
  "cap",
];

const isClothingItem = (product) => {
  const name = product.name?.toLowerCase() || "";
  return (
    clothingKeywords.some((k) => name.includes(k)) &&
    !excludedKeywords.some((k) => name.includes(k))
  );
};

export const usePaginatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (loadMore = false) => {
    setLoading(true);
    setError(null);

    try {
      let q = query(collection(db, "products"), limit(FETCH_BATCH_SIZE));
      if (loadMore && lastDoc) {
        q = query(
          collection(db, "products"),
          startAfter(lastDoc),
          limit(FETCH_BATCH_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const fetchedDocs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible);

      // Filter only clothing items
      const clothingProducts = fetchedDocs.filter(isClothingItem);

      // Group by gender
      const genderBuckets = {
        men: [],
        women: [],
        // unisex: [],
        // boys: [],
        // girls: [],
      };

      for (const product of clothingProducts) {
        const gender = product.gender?.toLowerCase() || "unisex";
        if (genderBuckets[gender]) genderBuckets[gender].push(product);
      }

      // Merge all genders and shuffle
      let allClothing = Object.values(genderBuckets).flat();
      const shuffled = allClothing.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, PRODUCTS_PER_PAGE);

      // Format imageArray
      const parsed = selected.map((item) => ({
        ...item,
        imageArray: item.images?.split(" ~ ") || [],
      }));

      setProducts((prev) => (loadMore ? [...prev, ...parsed] : parsed));
      setHasMore(snapshot.docs.length === FETCH_BATCH_SIZE);
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError("Failed to load products. Please try again later.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, fetchProducts, hasMore };
};
