// src/components/ProductModal.jsx
import React from "react";

const ProductModal = ({
  show,
  onClose,
  categories,
  formProduct,
  setFormProduct,
  onSave,
  editing,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#0000003b] bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow w-96 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold mb-3">
          {editing ? "Edit Product" : "Add Product"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={formProduct.title}
          onChange={(e) =>
            setFormProduct({ ...formProduct, title: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />

        <textarea
          placeholder="Description"
          value={formProduct.description}
          onChange={(e) =>
            setFormProduct({ ...formProduct, description: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />

        <input
          type="number"
          placeholder="Price"
          value={formProduct.price}
          onChange={(e) =>
            setFormProduct({ ...formProduct, price: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={formProduct.quantity}
          onChange={(e) =>
            setFormProduct({ ...formProduct, quantity: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={formProduct.image}
          onChange={(e) =>
            setFormProduct({ ...formProduct, image: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />

        <select
          value={formProduct.category}
          onChange={(e) =>
            setFormProduct({ ...formProduct, category: e.target.value })
          }
          className="border p-2 w-full mb-4"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 w-full">
        
          <button
            onClick={onSave}
            className="bg-gray-800 cursor-pointer  text-white p-2 rounded w-fit"
          >
            Save
          </button>
            <button
            onClick={onClose}
            className="bg-gray-300 cursor-pointer  text-black p-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
