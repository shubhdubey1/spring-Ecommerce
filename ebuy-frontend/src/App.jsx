import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import Auth from "./components/Auth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import Order from "./components/Order";
import SearchResults from "./components/SearchResults";

import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlUsername = params.get("username");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      if (urlUsername) {
        localStorage.setItem("username", urlUsername);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setToken(localStorage.getItem("token"));
    setAuthReady(true);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  if (!authReady) return null;

  return (
    <BrowserRouter>
      <ToastContainer autoClose={2000} hideProgressBar={true} />

      {token ? (
        <AppProvider>
          <>
            <Navbar onSelectCategory={handleCategorySelect} />
            <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
              <Routes>
                <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
                <Route path="/products" element={<Home selectedCategory={selectedCategory} />} />
                <Route path="/add_product" element={<AddProduct />} />
                <Route path="/product" element={<Product />} />
                <Route path="product/:id" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/update/:id" element={<UpdateProduct />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/search-results" element={<SearchResults />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </>
        </AppProvider>
      ) : (
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
