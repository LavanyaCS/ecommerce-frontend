import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../api";
import toast from "react-hot-toast";

function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) return navigate("/login");

      try {
        const res = await axios.get(`${baseUrl}/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.order);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch order details");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, navigate]);

  if (loading) return <p className="p-6">Loading order details...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     
    {/* Order Items */}
      <div className="col-span-2 border rounded p-4 space-y-2 shadow-sm">
        <h3 className="font-semibold mb-2">Items</h3>
        {order.orderItems.map(item => (
          <div key={item.product} className="flex justify-between items-center border-b py-2">
            <div className="flex items-center gap-4">
              {item.image && <img src={item.image} alt={item.title} className="w-16 h-16 object-cover" />}
              <span>{item.title} x {item.quantity}</span>
            </div>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-2">
          <span>Total:</span>
          <span>${order.totalAmount}</span>
        </div>
      </div>
   
   {/* Order Info */}
      <div className="col-span-2 md:col-span-1 border rounded p-4 space-y-2 shadow-sm min-h-40">
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
        <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Payment Status: {order.paymentStatus}</p>
        <p>Payment Method: {order.paymentMethod}</p>
      </div>  {/* Shipping Address */}
      <div className="col-span-2 md:col-span-1 border rounded p-4 space-y-1 shadow-sm min-h-40">
        <h3 className="font-semibold">Shipping Address</h3>
        <p>{order.shippingAddress?.label || order.shippingAddress?.name}</p>
        <p>{order.shippingAddress?.street || order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
        <p>{order.shippingAddress?.phone}</p>
      </div>
     
     
    </div>
</div>
  );
}

export default OrderDetailPage;
