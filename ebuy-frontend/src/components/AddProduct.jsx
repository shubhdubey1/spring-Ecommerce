import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setProduct({ ...product, [name]: fieldValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Please select a valid image file (JPEG or PNG)" });
      } else if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
      } else {
        setErrors({ ...errors, image: null });
      }
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.brand.trim()) newErrors.brand = "Brand is required";
    if (!product.description.trim()) newErrors.description = "Description is required";
    if (!product.price || parseFloat(product.price) <= 0) newErrors.price = "Price must be greater than zero";
    if (!product.category) newErrors.category = "Please select a category";
    if (!product.stockQuantity || parseInt(product.stockQuantity) < 0) newErrors.stockQuantity = "Stock quantity cannot be negative";
    if (!product.releaseDate) newErrors.releaseDate = "Release date is required";
    if (!image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setValidated(true);
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    axios
      .post(`${baseUrl}/api/product`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        toast.success("Product added successfully");
        setProduct({
          name: "",
          brand: "",
          description: "",
          price: "",
          category: "",
          stockQuantity: "",
          releaseDate: "",
          productAvailable: false,
        });
        setImage(null);
        setImagePreview(null);
        setValidated(false);
        setErrors({});
        navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        } else {
          toast.error("Error adding product");
        }
        setLoading(false);
      });
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2><i className="bi bi-plus-circle me-2"></i>Add Product</h2>
        <form onSubmit={submitHandler}>
          <div className="row" style={{ marginBottom: "16px" }}>
            <div className="col-md-6" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Name</label>
              <input
                type="text"
                name="name"
                className={`ebay-input ${errors.name ? "ebay-input-error" : ""}`}
                value={product.name}
                onChange={handleInputChange}
                placeholder="Product Name"
              />
              {errors.name && <div style={{ color: "var(--ebay-red)", fontSize: "12px", marginTop: "4px" }}>{errors.name}</div>}
            </div>
            <div className="col-md-6" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Brand</label>
              <input
                type="text"
                name="brand"
                className={`ebay-input ${errors.brand ? "ebay-input-error" : ""}`}
                value={product.brand}
                onChange={handleInputChange}
                placeholder="Brand Name"
              />
              {errors.brand && <div style={{ color: "var(--ebay-red)", fontSize: "12px", marginTop: "4px" }}>{errors.brand}</div>}
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label className="ebay-form-label">Description</label>
            <textarea
              name="description"
              className={`ebay-input ${errors.description ? "ebay-input-error" : ""}`}
              value={product.description}
              onChange={handleInputChange}
              placeholder="Product description"
              rows="3"
            />
            {errors.description && <div style={{ color: "var(--ebay-red)", fontSize: "12px", marginTop: "4px" }}>{errors.description}</div>}
          </div>

          <div className="row" style={{ marginBottom: "16px" }}>
            <div className="col-md-4" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                className={`ebay-input ${errors.price ? "ebay-input-error" : ""}`}
                value={product.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
              />
              {errors.price && <div style={{ color: "var(--ebay-red)", fontSize: "12px", marginTop: "4px" }}>{errors.price}</div>}
            </div>
            <div className="col-md-4" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Category</label>
              <select
                className={`ebay-select ${errors.category ? "ebay-input-error" : ""}`}
                value={product.category}
                onChange={handleInputChange}
                name="category"
              >
                <option value="">Select category</option>
                <option value="Laptop">Laptop</option>
                <option value="Headphone">Headphone</option>
                <option value="Mobile">Mobile</option>
                <option value="Electronics">Electronics</option>
                <option value="Toys">Toys</option>
                <option value="Fashion">Fashion</option>
              </select>
              {errors.category && <div style={{ color: "var(--ebay-red)", fontSize: "12px", marginTop: "4px" }}>{errors.category}</div>}
            </div>
            <div className="col-md-4" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                className={`ebay-input ${errors.stockQuantity ? "ebay-input-error" : ""}`}
                value={product.stockQuantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
              {errors.stockQuantity && <div style={{ color: "var(--ebay-red)", fontSize: "12px", marginTop: "4px" }}>{errors.stockQuantity}</div>}
            </div>
          </div>

          <div className="row" style={{ marginBottom: "16px" }}>
            <div className="col-md-6" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Release Date</label>
              <input
                type="date"
                name="releaseDate"
                className={`ebay-input ${errors.releaseDate ? "ebay-input-error" : ""}`}
                value={product.releaseDate}
                onChange={handleInputChange}
              />
              {errors.releaseDate && <div style={{ color: "var(--ebay-red)", fontSize: "12px", marginTop: "4px" }}>{errors.releaseDate}</div>}
            </div>
            <div className="col-md-6" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Image</label>
              <input
                type="file"
                className={`ebay-input ebay-file-input ${errors.image ? "ebay-input-error" : ""}`}
                onChange={handleImageChange}
                accept="image/png, image/jpeg"
              />
              {errors.image && <div style={{ color: "var(--ebay-red)", fontSize: "12px", marginTop: "4px" }}>{errors.image}</div>}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="ebay-image-preview"
                />
              )}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label className="ebay-checkbox-label">
              <input
                type="checkbox"
                name="productAvailable"
                checked={product.productAvailable}
                onChange={handleInputChange}
              />
              Product Available
            </label>
          </div>

          <button
            type="submit"
            className="ebay-btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Adding...</>
            ) : (
              <><i className="bi bi-plus-circle"></i> Add Product</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
