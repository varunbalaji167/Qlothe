// uploadProducts.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { readFile } from "fs/promises";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const uploadProducts = async () => {
  try {
    const data = await readFile("./src/data/products.json", "utf-8");
    const products = JSON.parse(data);
    const collectionRef = collection(db, "products");

    for (const product of products) {
      await addDoc(collectionRef, product);
      console.log("✅ Uploaded:", product.ProductName);
    }
  } catch (error) {
    console.error("❌ Error uploading products:", error);
  }
};

uploadProducts();