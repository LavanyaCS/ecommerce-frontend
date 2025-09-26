import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../api";
import toast from "react-hot-toast";

function CheckoutPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD / Online

  // Fetch user cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return navigate("/login");

      try {
        const res = await axios.get(`${baseUrl}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data.cart);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch cart");
      }
    };
    fetchCart();
  }, [token, navigate]);

  // Handle form input change
  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // Basic validation
    for (const key in shippingAddress) {
      if (!shippingAddress[key]) {
        toast.error("Please fill all shipping details");
        return;
      }
    }

    try {
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity
      }));

      const res = await axios.post(
        `${baseUrl}/order`,
        { orderItems, shippingAddress, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order placed successfully");
      // Clear cart after order
      await axios.delete(`${baseUrl}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate(`/order/${res.data.order._id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    }
  };

  if (!cart) return <p className="p-6">Loading cart...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Checkout</h2>

      {/* Cart Items */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">Your Cart</h3>
        {cart.items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.items.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-2">
              <span>{item.product.title} x {item.quantity}</span>
              <span>${item.product.price * item.quantity}</span>
            </div>
          ))
        )}
        <div className="text-right font-bold mt-2">Total: ${cart.totalPrice}</div>
      </div>

      {/* Shipping Address */}
      <div className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Shipping Address</h3>
        {["name","address","city","state","zip","phone"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border p-2 rounded"
            value={shippingAddress[field]}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Payment Method */}
      <div className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Payment Method</h3>
        <select
          className="w-full border p-2 rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Online">Online Payment</option>
        </select>
      </div>

      {/* Place Order */}
      <button
        onClick={handlePlaceOrder}
        className="bg-primary text-white px-6 py-2 rounded shadow"
      >
        Place Order
      </button>
    </div>
  );
}

export default CheckoutPage;
