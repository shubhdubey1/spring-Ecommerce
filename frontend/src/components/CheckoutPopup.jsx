import React from 'react';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="ebay-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ebay-modal-header">
          <h4>Checkout</h4>
          <button className="ebay-modal-close" onClick={handleClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="ebay-modal-body">
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item-row">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="checkout-item-img" 
                />
                <div className="checkout-item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-qty">Quantity: {item.quantity}</div>
                  <div className="item-line-total">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))}
            <div className="checkout-total-section">
              <span className="checkout-total-label">Total</span>
              <span className="checkout-total-amount">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="ebay-modal-footer">
          <button className="ebay-btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button className="ebay-btn-primary" onClick={handleCheckout}>
            <i className="bi bi-cart-check"></i> Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;
