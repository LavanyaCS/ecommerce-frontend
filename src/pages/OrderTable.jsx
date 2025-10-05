import React from "react";

const OrderTable = ({ orders, onView, onUpdateStatus, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-semibold mb-2">Orders List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">Order ID</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">User</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">Total Amount</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">Payment Status</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">Order Status</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="px-1 py-1 md:px-2 md:py-2">{order._id}</td>
                <td className="px-1 py-1 md:px-2 md:py-2">{order.user?.username || "—"}</td>
                <td className="px-1 py-1 md:px-2 md:py-2">₹{order.totalAmount}</td>
                <td className="px-1 py-1 md:px-2 md:py-2">{order.paymentStatus}</td>
                <td className="px-1 py-1 md:px-2 md:py-2">{order.orderStatus}</td>
                <td className="px-1 py-1 md:px-2 md:py-2 text-center space-x-2">
                  <button
                    onClick={() => onView(order)}
                    className="bg-green-600 text-white px-3 py-1 rounded mb-1"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onUpdateStatus(order)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => onDelete(order._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
