import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    let toastTimer;
    if (showToast) {
      toastTimer = setTimeout(() => setShowToast(false), 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [showToast]);

  const convertBase64ToDataURL = (base64String, mimeType = "image/jpeg") => {
    if (!base64String) return unplugged;
    if (base64String.startsWith("data:")) return base64String;
    if (base64String.startsWith("http")) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  const filteredProducts = selectedCategory
    ? data.filter((product) => product.category === selectedCategory)
    : data;

  if (isError) {
    return (
      <div className="ebay-error">
        <img src={unplugged} alt="Error" style={{ width: "100px", opacity: 0.5 }} />
        <h4>Something went wrong</h4>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && toastProduct && (
        <div className="ebay-toast">
          <div className="ebay-toast-content">
            <img
              src={convertBase64ToDataURL(toastProduct.imageData)}
              alt={toastProduct.name}
              style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "4px" }}
              onError={(e) => { e.target.src = unplugged; }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px" }}>{toastProduct.name}</div>
              <small style={{ color: "var(--ebay-green)" }}>Added to cart!</small>
            </div>
            <button
              onClick={() => setShowToast(false)}
              style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "var(--text-tertiary)", marginLeft: "auto", padding: "0 4px" }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="product-grid">
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <i className="bi bi-box" style={{ fontSize: "48px", color: "var(--text-tertiary)" }}></i>
            <h4 style={{ marginTop: "16px", color: "var(--text-secondary)" }}>No Products Available</h4>
          </div>
        ) : (
          <div className="ebay-products-grid">
            {filteredProducts.map((product) => {
              const { id, brand, name, price, productAvailable, imageData, stockQuantity } = product;
              return (
                <div className="ebay-card" key={id}>
                  <Link to={`/product/${id}`} className="ebay-card-link">
                    <div className="ebay-card-img-wrapper">
                      <img
                        src={convertBase64ToDataURL(imageData)}
                        alt={name}
                        className="ebay-card-img"
                        onError={(e) => { e.target.src = unplugged; }}
                      />
                      {stockQuantity <= 5 && stockQuantity > 0 && (
                        <span className="ebay-card-badge">Only {stockQuantity} left</span>
                      )}
                    </div>
                    <div className="ebay-card-body">
                      <div className="ebay-card-brand">{brand}</div>
                      <div className="ebay-card-title">{name}</div>
                      <div className="ebay-card-price">${price}</div>
                      <div className="ebay-card-shipping"><i className="bi bi-truck"></i> Free Shipping</div>
                    </div>
                  </Link>
                  <div className="ebay-card-actions">
                    <button
                      className="ebay-add-to-cart"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={!productAvailable || stockQuantity === 0}
                    >
                      <i className="bi bi-cart-plus"></i>
                      {stockQuantity !== 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
