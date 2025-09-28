import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return navigate("/login");

      try {
        const res = await axios.get(`${baseUrl}/order/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.orders || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  if (loading) return <p className="p-6">Loading orders...</p>;

  if (!orders.length)
    return <p className="p-6">You have not placed any orders yet.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="border rounded p-4 space-y-2 shadow-sm">
          <div className="flex justify-between">
            <h3 className="font-semibold">Order ID: {order._id}</h3>
            <span className={`px-2 py-1 rounded ${
              order.orderStatus === "delivered" ? "bg-green-100 text-green-800" :
              order.orderStatus === "shipped" ? "bg-blue-100 text-blue-800" :
              order.orderStatus === "processing" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {order.orderStatus.toUpperCase()}
            </span>
          </div>

          <div className="border-t pt-2 space-y-1">
            {order.orderItems.map(item => (
              <div key={item.product} className="flex justify-between">
                <span>{item.title} x {item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-2 flex justify-between">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">${order.totalAmount}</span>
          </div>

          <div className="border-t pt-2 space-y-1">
            <h4 className="font-semibold">Shipping Address</h4>
            <p>{order.shippingAddress?.label || order.shippingAddress?.name}</p>
            <p>
              {order.shippingAddress?.street || order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}
            </p>
            <p>{order.shippingAddress?.phone}</p>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span>Payment Method: {order.paymentMethod}</span>
            <Link to={`/order/${order._id}`} className="text-white bg-primary px-3 py-1 rounded shadow hover:bg-blue-600">
  View Details
</Link>

          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderPage;
