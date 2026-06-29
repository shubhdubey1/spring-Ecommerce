import axios from "axios";
import React, { useEffect, useState } from "react";

const Order = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [baseUrl]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED": return "bg-info";
      case "SHIPPED": return "bg-primary";
      case "DELIVERED": return "bg-success";
      case "CANCELLED": return "bg-danger";
      default: return "bg-secondary";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className="ebay-loading">
        <div className="ebay-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-page">
        <div style={{
          padding: "16px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          color: "#dc2626",
        }}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="form-card">
        <h2 style={{ marginBottom: "24px" }}>
          <i className="bi bi-truck me-2"></i>Order Management
          <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--text-secondary)", marginLeft: "12px" }}>
            ({orders.length} order{orders.length !== 1 ? "s" : ""})
          </span>
        </h2>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <i className="bi bi-inbox" style={{ fontSize: "48px", color: "var(--text-tertiary)" }}></i>
            <h5 style={{ marginTop: "12px", color: "var(--text-secondary)" }}>No orders found</h5>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0",
              fontSize: "14px",
            }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Items</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order.orderId}>
                    <tr style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-secondary)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 600, color: "var(--ebay-primary)" }}>#{order.orderId}</span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{order.email}</div>
                      </td>
                      <td style={tdStyle}>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td style={tdStyle}>
                        <span style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          ...getStatusStyle(order.status),
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>{order.items.length}</td>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>{formatCurrency(calculateOrderTotal(order.items))}</td>
                      <td style={tdStyle}>
                        <button
                          className="ebay-btn-secondary"
                          style={{ padding: "6px 14px", fontSize: "12px", height: "auto" }}
                          onClick={() => toggleOrderDetails(order.orderId)}
                        >
                          {expandedOrder === order.orderId ? "Hide Details" : "View Details"}
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order.orderId && (
                      <tr>
                        <td colSpan="7" style={{ padding: "0" }}>
                          <div style={{
                            background: "var(--bg-secondary)",
                            padding: "16px 20px",
                            borderBottom: "1px solid var(--border-color)",
                          }}>
                            <h6 style={{ marginBottom: "12px", fontWeight: 600 }}>
                              <i className="bi bi-box-seam me-1"></i>Order Items
                            </h6>
                            <table style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              fontSize: "13px",
                              background: "var(--bg-card)",
                              borderRadius: "8px",
                              overflow: "hidden",
                            }}>
                              <thead>
                                <tr style={{ background: "var(--bg-tertiary)" }}>
                                  <th style={{ ...thStyle, padding: "8px 12px" }}>Product</th>
                                  <th style={{ ...thStyle, padding: "8px 12px", textAlign: "center" }}>Quantity</th>
                                  <th style={{ ...thStyle, padding: "8px 12px", textAlign: "right" }}>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, index) => (
                                  <tr key={index} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                    <td style={{ ...tdStyle, padding: "8px 12px" }}>{item.productName}</td>
                                    <td style={{ ...tdStyle, padding: "8px 12px", textAlign: "center" }}>{item.quantity}</td>
                                    <td style={{ ...tdStyle, padding: "8px 12px", textAlign: "right" }}>{formatCurrency(item.totalPrice)}</td>
                                  </tr>
                                ))}
                                <tr style={{ background: "var(--ebay-primary-light)" }}>
                                  <td colSpan="2" style={{ ...tdStyle, padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>Total</td>
                                  <td style={{ ...tdStyle, padding: "10px 12px", fontWeight: 700, textAlign: "right", color: "var(--ebay-primary)" }}>
                                    {formatCurrency(calculateOrderTotal(order.items))}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const thStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "var(--text-secondary)",
  borderBottom: "2px solid var(--border-color)",
};

const tdStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid var(--border-color)",
};

const getStatusStyle = (status) => {
  switch (status) {
    case "PLACED":
      return { background: "rgba(59,130,246,0.1)", color: "#3b82f6" };
    case "SHIPPED":
      return { background: "rgba(139,92,246,0.1)", color: "#8b5cf6" };
    case "DELIVERED":
      return { background: "rgba(34,197,94,0.1)", color: "#16a34a" };
    case "CANCELLED":
      return { background: "rgba(239,68,68,0.1)", color: "#dc2626" };
    default:
      return { background: "rgba(100,116,139,0.1)", color: "#64748b" };
  }
};

export default Order;
