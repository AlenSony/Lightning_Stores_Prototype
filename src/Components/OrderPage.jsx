import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../assets/navbar.jsx";
import { useToast } from "../assets/Toast.jsx";
import "../Stylings/OrderPage.css";

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/order/my-orders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
        showToast("Failed to load orders", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [showToast]);

  if (isLoading) return <div className="order-page"><h1>Loading Orders...</h1></div>;
  if (error) return <div className="order-page"><h1>Error: {error}</h1></div>;

  return (
    <div className="order-page">
      <NavBar />
      <h1>Your Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <i className="fa-solid fa-box-open"></i>
          <p>You haven’t placed any orders yet.</p>
          <Link to="/main" className="back-to-profile-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-details">
                <p><strong>Total Price:</strong> ₹{order.totalPrice.toFixed(2)}</p>
                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              </div>
              <div className="order-items-list">
                <h3>Items:</h3>
                {order.devices.map((device) => (
                  <div key={device.id} className="order-item">
                    <div className="order-item-image">
                      <img
                        src={device.imageUrl || "/fallback-product.png"}
                        alt={device.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/fallback-product.png";
                        }}
                      />
                    </div>
                    <div className="order-item-info">
                      <h4>{device.name}</h4>
                      <p>{device.company} - {device.category}</p>
                      <p>Qty: {device.quantity}</p>
                      <p className="device-price">₹{device.expectedPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Link to="/profile" className="back-to-profile-btn">
            Back to Profile
          </Link>
        </div>
      )}
    </div>
  );
}

export default OrderPage;
