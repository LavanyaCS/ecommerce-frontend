import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import toast from "react-hot-toast";
function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");
  // Fetch wishlist items
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${baseUrl}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };
  // Add to cart
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

  useEffect(() => {
    fetchWishlist();
  }, []);
  const removeItem = async (productId) => {
    if (!token) return;
    try {
      await axios.delete(`${baseUrl}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update local state
      setWishlist(wishlist.filter((item) => item.product._id !== productId));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // Toggle wishlist (for demonstration, could be used for add/remove hearts)
  const toggleWishlist = async (productId) => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${baseUrl}/wishlist/toggle`,
        { product: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state based on removed or added
      if (res.data.removed) {
        setWishlist(wishlist.filter((item) => item.product._id !== productId));
      } else {
        setWishlist([...wishlist, res.data.wishlist]);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  if (!token) return <p>Please log in to view your wishlist.</p>;
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="border p-4 rounded shadow relative">
              <img
                src={item.product?.image}
                alt={item.product.title}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold">{item.product.title}</h3>
              <p className="text-red-500 font-bold">${item.product.price}</p>

              {/* Buttons */}
              <div className="flex gap-2 mt-2">
               
                <button
                  onClick={() => handleAddToCart(item.product._id)}
              className="cursor-pointer px-1 py-1 md:px-2 md:py-2 rounded shadow bg-white dark:bg-gray-800 text-slate-900 accent-blue-600 dark:accent-blue-600 dark:text-gray-100" 
                >
                  Add to Cart
                </button>
                 <button
                  onClick={() => removeItem(item.product._id)}
                  className="bg-gray-100 text-slate-700 px-3 py-1 rounded hover:bg-gray-800 hover:text-white"
                >
                  Remove Wishlist
                </button>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
