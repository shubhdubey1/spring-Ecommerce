import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    setCartItems(cart.length ? cart : []);
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId && item.quantity < item.stockQuantity) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;
        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };

        const cartProduct = new FormData();
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        await axios
          .put(`${baseUrl}/api/product/${item.id}`, cartProduct, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            console.log("Product updated successfully:", cartProduct);
          })
          .catch((error) => {
            console.error("Error updating product:", error);
          });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("error during checkout", error);
    }
  };

  return (
    <div className="cart-page">
      <h2><i className="bi bi-cart3 me-2"></i>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <i className="bi bi-cart-x" style={{ fontSize: "48px", color: "var(--text-tertiary)" }}></i>
          <h5 style={{ marginTop: "16px", color: "var(--text-secondary)" }}>Your cart is empty</h5>
          <a href="/" className="ebay-btn-primary" style={{ marginTop: "16px", textDecoration: "none" }}>
            <i className="bi bi-arrow-left"></i> Continue Shopping
          </a>
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={`${baseUrl}/api/product/${item.id}/image`}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-brand">{item.brand}</div>
                  <div className="cart-item-price">${item.price}</div>
                </div>
                <div className="cart-item-controls">
                  <button
                    className="cart-qty-btn"
                    onClick={() => handleDecreaseQuantity(item.id)}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="cart-qty-input">{item.quantity}</span>
                  <button
                    className="cart-qty-btn"
                    onClick={() => handleIncreaseQuantity(item.id)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => handleRemoveFromCart(item.id)}
                  title="Remove item"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div>
              <div className="cart-total-label">Total ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})</div>
              <div className="cart-total-amount">${totalPrice.toFixed(2)}</div>
            </div>
            <button
              className="ebay-btn-primary"
              style={{ height: "48px", padding: "0 32px" }}
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-credit-card"></i> Proceed to Checkout
            </button>
          </div>
        </>
      )}

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
