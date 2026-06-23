import React, { useEffect, useState } from "react";
import axios from "axios";

const Navbar = ({ onSelectCategory, onSearch }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (value) => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
        console.log(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  // Get cart count from localStorage
  const getCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch {
      return 0;
    }
  };

  return (
    <>
      <header className="ebay-navbar">
        {/* Top Bar: Logo | Search | Actions */}
        <div className="ebay-top-bar">
          {/* eBay-style multicolor logo */}
          <div className="ebay-logo">
            <a href="/">
              <span className="logo-ebuy">
                <span className="logo-e">e</span><span className="logo-b">b</span><span className="logo-u">u</span><span className="logo-y">y</span>
              </span>
            </a>
          </div>

          {/* Search Bar (centered, prominent) */}
          <div className="ebay-search-container" style={{ position: "relative" }}>
            <div className="ebay-search">
              <select className="search-category-select">
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="search"
                placeholder="Search for anything"
                aria-label="Search"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
              />
              <button className="search-btn" type="button">
                <i className="bi bi-search"></i>
              </button>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="search-results-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <div key={result.id} className="search-result-item">
                      <a href={`/product/${result.id}`}>
                        {result.name}
                      </a>
                    </div>
                  ))
                ) : (
                  noResults && (
                    <div className="no-results-msg">
                      No products match your search
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="ebay-actions">
            <div className="ebay-signin">
              <span>Hi! <strong>Sign in</strong></span>
            </div>

            <button className="theme-btn" onClick={() => toggleTheme()}>
              {theme === "dark-theme" ? (
                <i className="bi bi-moon-fill"></i>
              ) : (
                <i className="bi bi-sun-fill"></i>
              )}
            </button>

            <a href="/cart" className="ebay-cart-link">
              <i className="bi bi-cart3"></i>
              <span>Cart</span>
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </a>
          </div>
        </div>

        {/* Bottom Nav Links */}
        <div className="ebay-nav-links">
          <a href="/" className="ebay-nav-link active">Home</a>
          <div className="nav-category-dropdown">
            <button
              className="dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Shop by Category
            </button>
            <ul className="dropdown-menu">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className="dropdown-item"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <a href="/add_product" className="ebay-nav-link">Add Product</a>
        </div>
      </header>
    </>
  );
};

export default Navbar;
