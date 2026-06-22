import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      console.log("Cart", cart);
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const imageFile = await converUrlToFile(response.data, response.data.imageName);
              setCartImage(imageFile)
              const imageUrl = URL.createObjectURL(response.data);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );
        console.log("cart",cart)
        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
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
        console.log("updated product data", updatedProductData)
  
        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );
  
        await axios
          .put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Product updated successfully:", (cartProduct));
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
      <div className="cart-content">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          {cartItems.length > 0 && (
            <span style={{fontSize:"13px", color:"var(--text_secondary)"}}>{cartItems.length} item(s)</span>
          )}
        </div>
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h4>Your cart is empty</h4>
            <p style={{fontSize:"13px", color:"var(--text_secondary)", marginTop:"8px"}}>Looks like you haven't added any items yet.</p>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-img">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                  />
                </div>
                <div className="cart-item-info">
                  <div className="item-brand">{item.brand}</div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${item.price}</div>
                </div>

                <div className="cart-item-qty">
                  <button onClick={() => handleDecreaseQuantity(item.id)}>
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                    type="button"
                    value={item.quantity}
                    readOnly
                  />
                  <button onClick={() => handleIncreaseQuantity(item.id)}>
                    <i className="bi bi-plus"></i>
                  </button>
                </div>

                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            ))}
            <div className="cart-footer">
              <div className="cart-total">
                <span className="cart-total-label">Subtotal:</span>
                <span className="cart-total-amount">${totalPrice.toFixed(2)}</span>
              </div>
              <Button
                className="ebay-btn-primary"
                style={{border:"none"}}
                onClick={() => setShowModal(true)}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
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
