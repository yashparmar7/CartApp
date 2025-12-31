import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./app/store";

import HomePage from "./Pages/HomePage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import CartPage from "./Pages/CartPage";
import ShopPage from "./Pages/ShopPage";
import ProductDetailPage from "./components/ProductDetailPage";
import ContactPage from "./Pages/ContactPage";
import AboutPage from "./Pages/AboutPage";
import PageNotFound from "./Pages/PageNotFound";

function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
