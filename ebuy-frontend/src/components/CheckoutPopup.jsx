import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsSubmitting(true);

    const orderItems = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const data = {
      customerName: name,
      email: email,
      items: orderItems,
    };

    try {
      const response = await fetch(`${baseUrl}/api/orders/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to place order");

      setToastVariant("success");
      setToastMessage("Order placed successfully!");
      setShowToast(true);

      localStorage.removeItem("cart");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      setToastVariant("danger");
      setToastMessage("Failed to place order. Please try again.");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="checkout-modal-overlay" onClick={handleClose}>
        <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
          <div className="checkout-modal-header">
            <h3><i className="bi bi-credit-card me-2"></i>Checkout</h3>
            <button className="checkout-modal-close" onClick={handleClose}>&times;</button>
          </div>

          <form onSubmit={handleConfirm}>
            <div className="checkout-modal-body">
              {/* Order Items */}
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img
                    src={`${baseUrl}/api/product/${item.id}/image`}
                    alt={item.name}
                    className="checkout-item-img"
                  />
                  <div className="checkout-item-info">
                    <div className="checkout-item-name">{item.name}</div>
                    <div className="checkout-item-qty">Qty: {item.quantity}</div>
                    <div className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}

              <div className="checkout-total">
                <span className="checkout-total-label">Total</span>
                <span className="checkout-total-amount">${totalPrice.toFixed(2)}</span>
              </div>

              {/* Customer Details */}
              <div style={{ marginTop: "20px" }}>
                <label className="ebay-form-label">Name</label>
                <input
                  type="text"
                  className={`ebay-input ${validated && !name ? "ebay-input-error" : ""}`}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ marginBottom: "12px" }}
                />
                {validated && !name && (
                  <div style={{ color: "var(--ebay-red)", fontSize: "12px", marginBottom: "8px" }}>Please provide your name.</div>
                )}

                <label className="ebay-form-label">Email</label>
                <input
                  type="email"
                  className={`ebay-input ${validated && !email ? "ebay-input-error" : ""}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {validated && !email && (
                  <div style={{ color: "var(--ebay-red)", fontSize: "12px", marginTop: "4px" }}>Please provide a valid email address.</div>
                )}
              </div>
            </div>

            <div className="checkout-modal-footer">
              <button type="button" className="ebay-btn-secondary" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="ebay-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Processing...</>
                ) : (
                  <><i className="bi bi-check-circle"></i> Confirm Purchase</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1070 }}>
          <div style={{
            background: toastVariant === "success" ? "var(--ebay-green)" : "var(--ebay-red)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            animation: "slideIn 0.3s ease",
          }}>
            <i className={`bi ${toastVariant === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"}`}></i>
            {toastMessage}
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPopup;
