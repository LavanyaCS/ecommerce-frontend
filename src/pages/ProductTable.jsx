import React from "react";

const ProductTable = ({ products, onEdit, onDelete, onAdd }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex justify-between mb-2">
        <h2 className="font-semibold">Product List</h2>
        <button
          onClick={onAdd}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          + Add Product
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">Title</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">Category</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">Price</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">Seller</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="px-1 py-1 md:px-2 md:py-2">{product.title}</td>
                <td className="px-1 py-1 md:px-2 md:py-2">{product.category?.title || "—"}</td>
                <td className="px-1 py-1 md:px-2 md:py-2">₹{product.price}</td>
                <td className="px-1 py-1 md:px-2 md:py-2">{product.user?.name || "—"}</td>
                <td className="px-1 py-1 md:px-2 md:py-2 text-center space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="bg-blue-600 text-white px-3 py-1 mb-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
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

export default ProductTable;
