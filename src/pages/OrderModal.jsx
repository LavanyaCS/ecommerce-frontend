import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../api";

const OrderModal = ({ show, onClose, order, onSaved }) => {
  if (!show || !order) return null;

  const [paymentstatus, setPaymentStatus] = useState(order.paymentStatus);
  const [orderstatus, setOrderStatus] = useState(order.orderStatus);
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const handleSave = async () => {
    try {
      await axios.put(`${baseUrl}/order/${order._id}/status`, { paymentStatus: paymentstatus,orderStatus: orderstatus }, axiosConfig);
      toast.success("Order status updated");
      onSaved(); // refresh the dashboard/orders table
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000003b] bg-opacity-40">
      <div className="bg-white rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="mb-4">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>User:</strong> {order.user?.username || order.user?.email}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          
          <p><strong>Payment Status:</strong></p>
          <select
            value={status}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
          <p><strong>Order Status:</strong></p>
          <select
            value={status}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {order.deliveredAt && <p><strong>Delivered At:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>}
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
              {order.orderItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 border">{item.title}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 mt-4 w-full">
            
          <button onClick={handleSave} className="bg-primary cursor-pointer  text-white p-2 rounded w-fit">
            Save Status
          </button>
          <button onClick={onClose} className="bg-gray-300 cursor-pointer  text-black p-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
