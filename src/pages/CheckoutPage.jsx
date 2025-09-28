import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../api";
import toast from "react-hot-toast";

function CheckoutPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: ""
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [addingNew, setAddingNew] = useState(false);

  // Fetch cart
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

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${baseUrl}/address`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(res.data.addresses || []);

        // Select default address if exists
        const defaultAddr = res.data.addresses?.find(a => a.isDefault);
        if (defaultAddr) {
          setShippingAddress({
            name: defaultAddr.label || "",
            address: defaultAddr.street || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            zip: defaultAddr.zip || "",
            phone: defaultAddr.phone || ""
          });
          setSelectedAddressId(defaultAddr._id);
          setAddingNew(false);
        } else if (!res.data.addresses?.length) {
          setAddingNew(true); // no saved addresses → show form
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAddresses();
  }, [token]);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (addr) => {
    setShippingAddress({
      name: addr.label || "",
      address: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
      phone: addr.phone || ""
    });
    setSelectedAddressId(addr._id);
    setAddingNew(false);
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    let shippingId = selectedAddressId;

    // If adding new, save address first
    if (addingNew) {
      for (const key in shippingAddress) {
        if (!shippingAddress[key]) {
          toast.error("Please fill all shipping details");
          return;
        }
      }

      try {
        const res = await axios.post(
          `${baseUrl}/address`,
          shippingAddress,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        shippingId = res.data.address._id;
      } catch (err) {
        console.error(err);
        toast.error("Failed to save new address");
        return;
      }
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      title: item.product.title,
      price: item.product.price,
      image: Array.isArray(item.product.image) ? item.product.image[0] : item.product.image
    }));

    const orderPayload = {
      orderItems,
      shippingAddress: shippingId, // send ObjectId
      paymentMethod,
      subtotal: cart.totalPrice,
      totalAmount: cart.totalPrice // add shipping cost if any
    };

    try {
      const res = await axios.post(
        `${baseUrl}/order`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order placed successfully");

      // Clear cart
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
          cart.items.map(item => (
            <div key={item.product._id} className="flex justify-between mb-2">
              <span>{item.product.title} x {item.quantity}</span>
              <span>${item.product.price * item.quantity}</span>
            </div>
          ))
        )}
        <div className="text-right font-bold mt-2">Total: ${cart.totalPrice}</div>
      </div>

      {/* Saved Addresses */}
      {!addingNew && addresses.length > 0 && (
        <div className="border rounded p-4 space-y-2">
          <h3 className="font-semibold">Select Shipping Address</h3>
          {addresses.map(addr => (
            <div
              key={addr._id}
              onClick={() => handleSelectAddress(addr)}
              className={`border p-2 rounded cursor-pointer ${
                selectedAddressId === addr._id ? "bg-gray-100" : ""
              }`}
            >
              <p className="font-semibold">{addr.label}</p>
              <p>{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
              <p>{addr.country}</p>
            </div>
          ))}
          <button
            className="mt-2 text-white hover:font-medium bg-primary p-2 rounded shadow"
            onClick={() => setAddingNew(true)}
          >
            Add New Address
          </button>
        </div>
      )}

      {/* Shipping Address Form */}
      {(addingNew || addresses.length === 0) && (
        <div className="border rounded p-4 space-y-2">
          <h3 className="font-semibold">{addresses.length === 0 ? "Add Shipping Address" : "Edit / Add Address"}</h3>
          {["name","address","city","state","zip","phone"].map(field => (
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
          {addresses.length > 0 && (
            <button
              className="bg-gray-300 text-black py-2 rounded flex-1 mt-2"
              onClick={() => setAddingNew(false)}
            >
              Cancel
            </button>
          )}
        </div>
      )}

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
        className="bg-primary text-white px-6 py-2 rounded shadow cursor-pointer hover:font-medium"
      >
        Place Order
      </button>
    </div>
  );
}

export default CheckoutPage;
