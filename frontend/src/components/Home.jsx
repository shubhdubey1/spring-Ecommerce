import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png"

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <div className="ebay-empty-state" style={{ paddingTop: "100px" }}>
        <img src={unplugged} alt="Error" />
        <h3>Something went wrong</h3>
      </div>
    );
  }

  return (
    <>
      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <div className="ebay-empty-state">
            <h3>No Products Available</h3>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl, stockQuantity } = product;
            return (
              <div
                className="ebay-card"
                key={id}
              >
                <Link
                  to={`/product/${id}`}
                  className="ebay-card-link"
                >
                  <div className="ebay-card-image-wrap">
                    <img
                      src={imageUrl}
                      alt={name}
                    />
                  </div>
                  <div className="ebay-card-body">
                    <h5 className="ebay-card-title">{name}</h5>
                    <div className="ebay-card-brand">{brand}</div>
                    <div className="ebay-card-price">${price}</div>
                    {productAvailable && stockQuantity > 0 && (
                      <div className="ebay-card-shipping">Free Shipping</div>
                    )}
                    {!productAvailable && (
                      <div className="ebay-card-stock">Out of Stock</div>
                    )}
                  </div>
                </Link>
                <div style={{ padding: "0 14px 14px" }}>
                  <button
                    className="ebay-add-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    disabled={!productAvailable}
                  >
                    {productAvailable ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;
