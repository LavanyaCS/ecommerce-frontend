import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../api";

const paymentOptions = ["pending", "paid", "failed"];
const orderOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

const OrderModal = ({ show, onClose, order, onSaved }) => {
  if (!show || !order) return null;

  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || "pending");
  const [orderStatus, setOrderStatus] = useState(order.orderStatus || "pending");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { paymentStatus, orderStatus };
      await axios.put(`${baseUrl}/order/${order._id}/status`, payload, axiosConfig);
      toast.success("Order status updated");
      onSaved?.();
      onClose();
    } catch (err) {
      console.error("Failed to update order:", err);
      toast.error(err.response?.data?.message || "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000003b] bg-opacity-40"
    >
      <div className="bg-white rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>

        <div className="mb-4">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>User:</strong> {order.user?.username || order.user?.email}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>

          <p className="mt-3"><strong>Payment Status:</strong></p>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          >
            {paymentOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <p><strong>Order Status:</strong></p>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          >
            {orderOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          {order.deliveredAt && (
            <p><strong>Delivered At:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Items</h3>
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item._id || item.title} className="border-b">
                  <td className="p-2 border">{item.title}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 mt-4 w-full">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gray-800 cursor-pointer text-white p-2 rounded w-fit disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Status"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 cursor-pointer text-black p-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
