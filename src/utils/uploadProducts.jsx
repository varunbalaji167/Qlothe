import React, { useEffect } from "react";
import localProducts from "../data/Products.json";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const UploadProducts = () => {
  useEffect(() => {
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

    const upload = async () => {
      const productsRef = collection(db, "products");

      const filtered = localProducts.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const gender = product.gender?.toLowerCase() || "";
        const isClothing = clothingKeywords.some((k) => name.includes(k));
        const isExcluded = excludedKeywords.some((k) => name.includes(k));
        const isValidGender = ["men", "women", "unisex"].includes(gender);
        return isClothing && !isExcluded && isValidGender;
      });

      for (const item of filtered) {
        const docData = {
          ...item,
          imageArray: item.images.split(" ~ "),
          in_stock: item.in_stock === "true",
          price: Number(item.price),
        };

        try {
          await addDoc(productsRef, docData);
          console.log("✅ Uploaded:", item.name);
        } catch (error) {
          console.error("❌ Upload error:", item.name, error);
        }
      }

      alert("✅ Upload complete!");
    };

    upload();
  }, []);

  return (
    <div className="p-4 text-center">Uploading products... Check console.</div>
  );
};

export default UploadProducts;
