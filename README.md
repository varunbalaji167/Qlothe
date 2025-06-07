# Qlothe - E-commerce Website

## Introduction
**Qlothe** is a modern e-commerce platform built with React, Firebase, Razorpay, and Tailwind CSS. The platform allows users to browse clothing products, manage their cart, and complete transactions with an integrated Razorpay payment gateway(Test mode). Qlothe features Firebase for user authentication, Firestore for product and user data management, and Razorpay for seamless online payments.

The website is designed to offer a smooth user experience for both browsing and shopping, supporting features such as personalized user profiles, order history, cart management, and a secure checkout process.

## Features

### 1. **User Authentication**
Qlothe uses **Firebase Authentication** to enable users to sign up, log in, and manage their accounts(via regular email,password method and Google Authentication). Once logged in, users can access their profile page to view and update their information, including email and addresses.

### 2. **Product Catalog**
The platform allows users to view a dynamic collection of clothing products fetched from **Firebase Firestore**. Each product has a detailed page displaying product information like name, description, price, and color options. The catalog supports **searching**, **filtering**, **sorting** to make shopping more efficient.

The Products are viewed in **pages** (24 products at once) to reduce the load on website and Firestore read operations **enhancing the loading time improvements**.

### 3. **Cart Management**
Users can add items to their cart, view the cart contents, update item quantities, and remove items. The **React Context API** is used for state management, making it easy to track and update the cart in real-time. The cart items are stored in **Firestore** to persist user data across sessions.

### 4. **Checkout & Payment**
Once users are ready to place an order, they can enter their shipping information, review the cart summary, and proceed to checkout. Payment is securely handled via **Razorpay**, a popular payment gateway. The platform supports **Payments** in the test environment, allowing users to complete their transactions quickly. 

After payment, users are redirected to the home page, and the cart is cleared. Order details are saved in Firestore under the user’s profile, where users can view their order history.

### 5. **Order History**
Users can view their past orders in the profile section of the website. The order history is stored in Firestore and includes details such as product names, quantities, total price, and shipping information.

## Tech Stack

- **Frontend**: 
  - React for building the UI.
  - Vite as the build tool for fast development and hot reloading.
  - Tailwind CSS for styling the application with a responsive and modern design.
  
- **Backend**: 
  - Firebase for Authentication, Firestore for database, and Firebase Hosting for deployment.
  
- **Payment Gateway**: 
  - Razorpay for handling secure payments and processing UPI payments.

## Installation Guide

### Prerequisites

Before running the project locally, ensure you have the following:

- **Node.js** (version 14 or higher)
- **Firebase account**: Set up Firebase for Authentication and Firestore.
- **Razorpay account**: Get your Razorpay API key for payment integration.

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/theebika28/eclothing.git
   cd client
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set Up Firebase

- Create a Firebase project at Firebase Console.
- Set up Firebase Authentication (Email/Password sign-in method) and Cloud Firestore
- Create .env file with
```bash
# .env (frontend Vite-compatible)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```
- Create .env.node with
```bash
# .env.node (Node.js usage — no VITE_ prefix needed)
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```
- Create Firestore collections (users, products) using src/utils/uploadProducts.js.
- Copy the Firebase configuration from your Firebase console and add it to the src/firebase.js file.

4. Set up Razorpay:

- Go to Razorpay and create an account.
- Get your API keys and add them to your environment variables or directly in the app configuration.

5. Run the app locally
```bash
npm run dev
```

## API Reference

### 1. Product Data Storage in Firestore

Product data is stored in Firestore under the `products` collection, each document containing product details such as:

- **ProductID**: Unique product identifier
- **ProductName**: Name of the product
- **ProductBrand**: Brand name
- **Price**: Product price
- **PrimaryColor**: Main color
- **Description**: Product description
- **Category**: Product category
- **ImageURL**: Link to the product image
- **Stock**: Available stock quantity

**Example Firestore Document:**
```json
{
  "ProductID": "product_123",
  "ProductName": "Men's T-Shirt",
  "Price": 499.99,
  "PrimaryColor": "Blue",
  "Description": "Comfortable cotton t-shirt.",
  "ImageURL": "https://example.com/image.jpg",
  "Stock": 50
}
```

### 2. Fetching Product Data from Firestore

The products are fetched from Firestore using Firebase’s getDocs and query methods to retrieve data dynamically. Here’s how it’s done in a custom React hook:
```bash
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), limit(limitCount));
        const querySnapshot = await getDocs(q);
        const productData = querySnapshot.docs.map(doc => doc.data());
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
   ```
   

## Deployment

To deploy this project using Firebase run following commands 

1. In Code editor
```bash
  npm run build
```
2. In command prompt/terminal at root of client

```bash
firebase login
firebase init
```
3. After ✔  Firebase initialization complete!
```bash
firebase deploy --only hosting
```
### Hosted URL
https://eclothing-5f52e.web.app
## Acknowledgements

 - **Products Dataset** is collected from **kaggle** Dataset(https://www.kaggle.com/datasets/nirokey/myntra-fashion-products)
