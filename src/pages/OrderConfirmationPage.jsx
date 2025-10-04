import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../api";

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const token = localStorage.getItem("token");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${baseUrl}/order/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const currentOrder = res.data.orders.find((o) => o._id === orderId);
        setOrder(currentOrder);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  if (!order) return <p className="p-6">Loading order...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-green-600">Order Confirmed!</h2>
      <p>Order ID: {order._id}</p>
      <p>Total Amount: ${order.totalAmount}</p>
      <p>Status: {order.orderStatus}</p>

      <h3 className="font-semibold mt-4">Items:</h3>
      {order.orderItems.map((item) => (
        <div key={item.product._id} className="flex justify-between mb-2">
          <span>{item.title} x {item.quantity}</span>
          <span>${item.price * item.quantity}</span>
        </div>
      ))}

      <h3 className="font-semibold mt-4">Shipping Address:</h3>
      <div>
        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
        <p>{order.shippingAddress.state} - {order.shippipngAddress.zip}</p>
        <p>Phone: {order.shippingAddress.phone}</p>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
