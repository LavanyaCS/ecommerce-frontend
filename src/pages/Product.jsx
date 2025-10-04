import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../api";

function Product() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/product?sortBy=${sortBy}&order=${order}&search=${searchTerm}`
      );
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  // Trigger fetch on sort, order, or search change with debounce
  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [sortBy, order, searchTerm]);

  // Add to Cart
  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${baseUrl}/cart`,
        { product: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header & Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded w-60"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
            <option value="title">Name</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 hover:border-blue-200 rounded-lg shadow hover:shadow-lg transition"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  className="p-4 rounded-t-lg h-64 w-full object-cover"
                  src={Array.isArray(product.image) ? product.image[0] : product.image || "/placeholder.png"}
                  alt={product.title}
                />
                <div className="px-5 pb-5 text-center">
                  <h5 className="text-lg font-semibold text-gray-800">{product.title}</h5>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                  </div>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 divide-x border-t">
                <Link
                  to={`/product/${product._id}`}
                  className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-blue-600 transition"
                >
                  View Detail
                </Link>

                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-green-600 transition"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="px-4 py-2 text-gray-500 text-center col-span-full">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}

export default Product;
