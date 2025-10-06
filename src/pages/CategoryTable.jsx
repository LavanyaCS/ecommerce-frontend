import React from "react";

const CategoryTable = ({ categories, onEdit, onDelete, onAdd }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex justify-between mb-2">
        <h2 className="font-semibold">Category List</h2>
        <button
          onClick={onAdd}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          + Add Category
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">Title</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-left">Description</th>
            <th className="px-1 py-1 md:px-2 md:py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td
                colSpan="3"
                className="text-center py-4 text-gray-500"
              >
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category._id} className="border-b">
                <td className="px-1 py-1 md:px-2 md:py-2">{category.title}</td>
                <td className="px-1 py-1 md:px-2 md:py-2">{category.description}</td>
                <td className="px-1 py-1 md:px-2 md:py-2 text-center space-x-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="bg-blue-600 text-white px-3 py-1 rounded mb-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(category._id)}
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

export default CategoryTable;
