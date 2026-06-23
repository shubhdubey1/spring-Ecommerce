import React, { useState } from "react";
import axios from "axios";

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
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    axios
      .post("http://localhost:8080/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product added successfully:", response.data);
        alert("Product added successfully");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Error adding product");
      });
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Add Product</h1>
        <form onSubmit={submitHandler}>
          <div className="row" style={{marginBottom:"16px"}}>
            <div className="col-md-6" style={{marginBottom:"12px"}}>
              <label className="ebay-form-label">Name</label>
              <input
                type="text"
                className="ebay-input"
                placeholder="Product Name"
                onChange={handleInputChange}
                value={product.name}
                name="name"
              />
            </div>
            <div className="col-md-6" style={{marginBottom:"12px"}}>
              <label className="ebay-form-label">Brand</label>
              <input
                type="text"
                name="brand"
                className="ebay-input"
                placeholder="Enter your Brand"
                value={product.brand}
                onChange={handleInputChange}
                id="brand"
              />
            </div>
          </div>

          <div style={{marginBottom:"12px"}}>
            <label className="ebay-form-label">Description</label>
            <input
              type="text"
              className="ebay-input"
              placeholder="Add product description"
              value={product.description}
              name="description"
              onChange={handleInputChange}
              id="description"
            />
          </div>

          <div className="row" style={{marginBottom:"16px"}}>
            <div className="col-md-4" style={{marginBottom:"12px"}}>
              <label className="ebay-form-label">Price ($)</label>
              <input
                type="number"
                className="ebay-input"
                placeholder="Eg: 1000"
                onChange={handleInputChange}
                value={product.price}
                name="price"
                id="price"
              />
            </div>
            <div className="col-md-4" style={{marginBottom:"12px"}}>
              <label className="ebay-form-label">Category</label>
              <select
                className="ebay-select"
                value={product.category}
                onChange={handleInputChange}
                name="category"
                id="category"
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
            <div className="col-md-4" style={{marginBottom:"12px"}}>
              <label className="ebay-form-label">Stock Quantity</label>
              <input
                type="number"
                className="ebay-input"
                placeholder="Stock Remaining"
                onChange={handleInputChange}
                value={product.stockQuantity}
                name="stockQuantity"
                id="stockQuantity"
              />
            </div>
          </div>

          <div className="row" style={{marginBottom:"16px"}}>
            <div className="col-md-6" style={{marginBottom:"12px"}}>
              <label className="ebay-form-label">Release Date</label>
              <input
                type="date"
                className="ebay-input"
                value={product.releaseDate}
                name="releaseDate"
                onChange={handleInputChange}
                id="releaseDate"
              />
            </div>
            <div className="col-md-6" style={{marginBottom:"12px"}}>
              <label className="ebay-form-label">Image</label>
              <input
                className="ebay-input ebay-file-input"
                type="file"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div style={{marginBottom:"20px"}}>
            <label className="ebay-checkbox-label">
              <input
                type="checkbox"
                name="productAvailable"
                checked={product.productAvailable}
                onChange={(e) =>
                  setProduct({ ...product, productAvailable: e.target.checked })
                }
              />
              Product Available
            </label>
          </div>

          <button type="submit" className="ebay-btn-primary" style={{width:"100%", justifyContent:"center"}}>
            <i className="bi bi-plus-circle"></i> Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
