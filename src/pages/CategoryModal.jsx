import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import { toast } from "react-hot-toast";

const CategoryModal = ({ onClose, onSuccess, category }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setDescription(category.description);
      setImage(category.image);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (category) {
        // Edit
        await axios.put(`${baseUrl}/category/${category._id}`, { title, description,image }, axiosConfig);
        toast.success("Category updated");
      } else {
        // Add
        await axios.post(`${baseUrl}/category`, { title, description,image }, axiosConfig);
        toast.success("Category added");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0000003b] bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-semibold mb-4">
          {category ? "Edit Category" : "Add Category"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Image"
            className="border p-2 rounded"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 mt-2">

            <button
              type="submit"
              className="bg-gray-800 cursor-pointer  text-white p-2 rounded"
            >
              {category ? "Update" : "Add"}
              
            </button>
                        <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 cursor-pointer  text-black p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
