import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { toast } from "react-toastify";

const Product = () => {
  const { id } = useParams();
  const { addToCart, cart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(`${baseUrl}/api/product/${id}/image`, {
        responseType: "blob",
      });
      setImageUrl(URL.createObjectURL(response.data));
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`${baseUrl}/api/product/${id}`);
      toast.success("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    toast.success("Product added to cart");
  };

  if (!product) {
    return (
      <div className="ebay-loading">
        <div className="ebay-spinner"></div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-layout">
        {/* Product Image */}
        <div className="product-detail-image">
          <img
            src={imageUrl}
            alt={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="product-detail-info">
          <div className="product-detail-category">{product.category}</div>
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-brand">~ {product.brand}</p>

          <div className="product-detail-price-section">
            <div className="product-detail-price">${product.price}</div>
            <div className="product-detail-shipping">
              <i className="bi bi-truck"></i> Free Shipping
            </div>
          </div>

          <div className="product-detail-description">
            <strong>Description:</strong>
            <p style={{ marginTop: "8px" }}>{product.description}</p>
          </div>

          <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            <i className="bi bi-calendar me-1"></i>
            Listed: {new Date(product.releaseDate).toLocaleDateString()}
          </div>

          <div className="product-detail-actions">
            <button
              className="ebay-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={handlAddToCart}
              disabled={!product.productAvailable || product.stockQuantity === 0}
            >
              <i className="bi bi-cart-plus"></i>
              {product.stockQuantity !== 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="ebay-btn-secondary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={handleEditClick}
              >
                <i className="bi bi-pencil"></i> Update
              </button>
              <button
                className="ebay-btn-danger"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={deleteProduct}
              >
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>

            <div style={{ fontSize: "14px", color: "var(--text-primary)", marginTop: "8px" }}>
              <i className="bi bi-box-seam me-1"></i>
              Stock: <strong>{product.stockQuantity}</strong> available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
