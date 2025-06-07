// uploadProducts.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { readFile } from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

// Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
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
