import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  const [imageChanged, setImageChanged] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/product/${id}`);
        setProduct(response.data);

        const responseImage = await axios.get(
          `${baseUrl}/api/product/${id}/image`,
          { responseType: "blob" }
        );
        const imageFile = await converUrlToFile(responseImage.data, response.data.imageName);
        setImage(imageFile);
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const navigate = useNavigate();

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const updatedProduct = new FormData();
    // Always send imageFile — backend requires it for multipart parsing
    if (image) {
      updatedProduct.append("imageFile", image);
    }

    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    axios
      .put(`${baseUrl}/api/product/${id}`, updatedProduct, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        toast.success("Product updated successfully");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        toast.error("Failed to update product. Please try again.");
      })
      .finally(() => {
        setLoading(false);
        navigate("/");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageChanged(true);
    }
  };

  if (!product.id) {
    return (
      <div className="ebay-loading">
        <div className="ebay-spinner"></div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h2><i className="bi bi-pencil-square me-2"></i>Update Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="row" style={{ marginBottom: "16px" }}>
            <div className="col-md-6" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Name</label>
              <input
                type="text"
                className="ebay-input"
                placeholder={product.name}
                value={updateProduct.name}
                onChange={handleChange}
                name="name"
                required
              />
            </div>
            <div className="col-md-6" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Brand</label>
              <input
                type="text"
                name="brand"
                className="ebay-input"
                placeholder={product.brand}
                value={updateProduct.brand}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label className="ebay-form-label">Description</label>
            <textarea
              className="ebay-input"
              placeholder={product.description}
              value={updateProduct.description}
              name="description"
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="row" style={{ marginBottom: "16px" }}>
            <div className="col-md-4" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Price ($)</label>
              <input
                type="number"
                className="ebay-input"
                onChange={handleChange}
                value={updateProduct.price}
                placeholder={product.price}
                name="price"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <div className="col-md-4" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Category</label>
              <select
                className="ebay-select"
                value={updateProduct.category}
                onChange={handleChange}
                name="category"
                required
              >
                <option value="">Select category</option>
                <option value="Laptop">Laptop</option>
                <option value="Headphone">Headphone</option>
                <option value="Mobile">Mobile</option>
                <option value="Electronics">Electronics</option>
                <option value="Toys">Toys</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>
            <div className="col-md-4" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Stock Quantity</label>
              <input
                type="number"
                className="ebay-input"
                onChange={handleChange}
                placeholder={product.stockQuantity}
                value={updateProduct.stockQuantity}
                name="stockQuantity"
                min="0"
                required
              />
            </div>
          </div>

          <div className="row" style={{ marginBottom: "16px" }}>
            <div className="col-md-6" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Release Date</label>
              <input
                type="date"
                className="ebay-input"
                value={updateProduct.releaseDate ? updateProduct.releaseDate.slice(0, 10) : ""}
                name="releaseDate"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6" style={{ marginBottom: "12px" }}>
              <label className="ebay-form-label">Image</label>
              {image && (
                <img
                  src={image ? URL.createObjectURL(image) : ""}
                  alt={product.name}
                  className="ebay-image-preview"
                />
              )}
              <input
                className="ebay-input ebay-file-input"
                type="file"
                onChange={handleImageChange}
                accept="image/png, image/jpeg"
              />
              <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "4px" }}>
                Leave empty to keep current image
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label className="ebay-checkbox-label">
              <input
                type="checkbox"
                name="productAvailable"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
                }
              />
              Product Available
            </label>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {loading ? (
              <button className="ebay-btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Updating...
              </button>
            ) : (
              <button type="submit" className="ebay-btn-primary">
                <i className="bi bi-check-lg"></i> Update Product
              </button>
            )}
            <button
              type="button"
              className="ebay-btn-secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
