import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../Context/Context";
import API from "../axios";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const { cart } = useContext(AppContext);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await API.get(`${baseUrl}/products`);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleInputChange = (value) => {
    setInput(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    setShowNoProductsMessage(false);
    setIsLoading(true);

    try {
      const response = await API.get(
        `${baseUrl}/products/search?keyword=${input}`
      );
      if (response.data.length === 0) {
        setShowNoProductsMessage(true);
      } else {
        navigate(`/search-results`, { state: { searchData: response.data } });
      }
    } catch (error) {
      console.error("Error searching:", error);
      setShowNoProductsMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/logout");
    } catch (err) {
      // still clear local state even if server errors
    }
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
    setMobileMenuOpen(false);
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
    "Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion",
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="ebay-top-bar">
        <div style={{ maxWidth: "1260px", margin: "0 auto", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div>
            <span style={{ color: "#999" }}>Hi, </span>
            <span style={{ fontWeight: 600, color: "#fff" }}>{localStorage.getItem("username") || "User"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/orders"); }}>My Orders</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/add_product"); }}>
              <i className="bi bi-megaphone me-1"></i>Sell
            </a>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={(e) => e.target.style.background = "none"}
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="ebay-navbar" ref={navbarRef}>
        <div className="ebay-navbar-container">
          <Link to="/" className="ebay-logo">
            <span className="ebay-logo-e">e</span>
            <span className="ebay-logo-b">b</span>
            <span className="ebay-logo-u">u</span>
            <span className="ebay-logo-y">y</span>
          </Link>

          <button
            className="ebay-navbar-toggler"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list"></i>
          </button>

          <div className={`ebay-nav-links ${mobileMenuOpen ? "show" : ""}`}>
            <a href="/" className="ebay-nav-link" onClick={(e) => { e.preventDefault(); navigate("/"); setMobileMenuOpen(false); }}>
              <span className="ebay-nav-label">Daily Deals</span>
              <span className="ebay-nav-value">Shop Now</span>
            </a>
            <a href="/orders" className="ebay-nav-link" onClick={(e) => { e.preventDefault(); navigate("/orders"); setMobileMenuOpen(false); }}>
              <span className="ebay-nav-label">My</span>
              <span className="ebay-nav-value">Orders</span>
            </a>
            <a href="/add_product" className="ebay-nav-link" onClick={(e) => { e.preventDefault(); navigate("/add_product"); setMobileMenuOpen(false); }}>
              <span className="ebay-nav-label">Sell</span>
              <span className="ebay-nav-value">Product</span>
            </a>
          </div>

          <div className="ebay-search-wrapper">
            <form className="ebay-search-form" onSubmit={handleSubmit}>
              <input
                className="ebay-search-input"
                type="search"
                placeholder="Search for anything"
                aria-label="Search"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              {isLoading ? (
                <button className="ebay-search-btn" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                </button>
              ) : (
                <button className="ebay-search-btn" type="submit">
                  <i className="bi bi-search"></i> Search
                </button>
              )}
            </form>
            {showNoProductsMessage && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "4px", padding: "8px 12px", fontSize: "13px", color: "var(--text-secondary)", zIndex: 1000, marginTop: "2px" }}>
                No products found matching your search.
              </div>
            )}
          </div>

          <Link to="/cart" className="ebay-cart-link">
            <i className="bi bi-cart3 ebay-cart-icon"></i>
            {cartCount > 0 && <span className="ebay-cart-badge">{cartCount}</span>}
          </Link>

          <button className="ebay-theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === "dark-theme" ? <i className="bi bi-sun"></i> : <i className="bi bi-moon"></i>}
          </button>
        </div>
      </nav>

      {/* Category Bar */}
      <div className="ebay-category-bar">
        <ul className="ebay-category-list">
          <li>
            <button
              className={`ebay-category-link ${selectedCategory === "" ? "active" : ""}`}
              onClick={() => handleCategorySelect("")}
            >
              All
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
   
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
