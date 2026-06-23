import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import unplugged from "../assets/unplugged.png";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state && location.state.searchData) {
      setSearchData(location.state.searchData);
      setLoading(false);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  const convertBase64ToDataURL = (base64String, mimeType = "image/jpeg") => {
    if (!base64String) return unplugged;
    if (base64String.startsWith("data:")) return base64String;
    if (base64String.startsWith("http")) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="ebay-loading">
        <div className="ebay-spinner"></div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2><i className="bi bi-search me-2"></i>Search Results</h2>
          <div className="search-results-count">{searchData.length} product(s) found</div>
        </div>
      </div>

      {searchData.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
        }}>
          <i className="bi bi-search" style={{ fontSize: "48px", color: "var(--text-tertiary)" }}></i>
          <h4 style={{ marginTop: "16px", color: "var(--text-secondary)" }}>No products found</h4>
          <p style={{ color: "var(--text-tertiary)", marginTop: "8px" }}>Try different search terms or browse categories</p>
          <button className="ebay-btn-primary" style={{ marginTop: "16px" }} onClick={() => navigate("/")}>
            <i className="bi bi-arrow-left"></i> Back to Home
          </button>
        </div>
      ) : (
        <div className="ebay-products-grid">
          {searchData.map((product) => (
            <div key={product.id} className="ebay-card">
              <div className="ebay-card-link" onClick={() => handleViewProduct(product.id)} style={{ cursor: "pointer" }}>
                <div className="ebay-card-img-wrapper">
                  <img
                    src={convertBase64ToDataURL(product.productImage)}
                    alt={product.name}
                    className="ebay-card-img"
                    onError={(e) => { e.target.src = unplugged; }}
                  />
                  {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                    <span className="ebay-card-badge">Only {product.stockQuantity} left</span>
                  )}
                </div>
                <div className="ebay-card-body">
                  <div className="ebay-card-brand">{product.brand}</div>
                  <div className="ebay-card-title">{product.name}</div>
                  <div className="ebay-card-price">${product.price}</div>
                  <div className="ebay-card-shipping"><i className="bi bi-truck"></i> Free Shipping</div>
                </div>
              </div>
              <div className="ebay-card-actions">
                <button
                  className="ebay-add-to-cart"
                  onClick={() => handleViewProduct(product.id)}
                >
                  <i className="bi bi-eye"></i> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
