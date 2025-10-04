import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../api";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${baseUrl}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.cart);
      } catch (err) {
        console.error(err.message);
        toast.error("Failed to fetch cart");
      }
    };
    fetchCart();
  }, [token]);

  // Update quantity
  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await axios.put(
        `${baseUrl}/cart/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart);
      toast.success("Cart updated");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update cart");
    }
  };

  // Remove item
  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${baseUrl}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart);
      toast.success("Item removed");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to remove item");
    }
  };

  // Clear cart
  const handleClear = async () => {
    try {
      const res = await axios.delete(`${baseUrl}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart);
      toast.success("Cart cleared");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to clear cart");
    }
  };

  if (!cart) return <p className="p-6">Loading cart...</p>;

  const cartItems = cart.items.filter((item) => item.product);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Cart</h2>

      <div className="bg-white shadow rounded p-6 space-y-4">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-semibold">{item.product.title}</p>
                  <p>
                    ${item.product.price} × {item.quantity} = $
                    {item.product.price * item.quantity}
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    className="border px-2 py-1 w-16"
                    onChange={(e) =>
                      handleUpdateQuantity(
                        item.product._id,
                        Number(e.target.value)
                      )
                    }
                  />
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    title="Remove Product"
                    className="text-gray-900 hover:underline p-2 bg-white shadow rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}

            {/* Total & Actions */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleClear}
                className="text-gray-800 hover:text-gray-900 mt-2 bg-white p-2 shadow rounded border-gray-100"
              >
                Clear Cart
              </button>
              <div className="flex items-center gap-4">
                <div className="text-lg font-semibold">
                  Total: ${cart.totalPrice || 0}
                </div>
                <button
  onClick={() => navigate("/checkout")}
  disabled={cartItems.length === 0}
  className={`
    cursor-pointer px-4 py-2 rounded shadow
    bg-white text-slate-900 accent-blue-600
    hover:bg-gray-200
    dark:bg-gray-800 dark:text-gray-100 dark:accent-blue-600 dark:hover:bg-gray-900
    transition-colors duration-200
    ${cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
  `}
>
  Proceed to Checkout
</button>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
