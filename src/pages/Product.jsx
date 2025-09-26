import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../api";

function Product() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/product`);
        setProducts(res.data.productInfo || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  // Add to Cart
  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${baseUrl}/cart`,
        { product: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart");
      console.log("Cart:", res.data.cart);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="max-w-xs bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition"
            >
              {/* Product Image */}
              <img
                className="p-4 rounded-t-lg"
                src={Array.isArray(product.image) ? product.image[0] : product.image}
                alt={product.title}
              />

              {/* Product Info */}
              <div className="px-5 pb-5 text-center">
                <h5 className="text-lg font-semibold text-gray-800">{product.title}</h5>
                <div className="mt-2">
                  <span className="text-xl font-bold text-gray-900">${product.price}</span>
                  <span className="ml-2 text-sm line-through text-gray-500">
                    {product.quantity}
                  </span>
                </div>
              </div>

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
          <p className="px-4 py-2 text-gray-500 text-center">No products available</p>
        )}
      </div>
    </div>
  );
}

export default Product;
