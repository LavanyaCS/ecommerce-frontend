import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../api";
import toast from "react-hot-toast";

// Stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51SDNhy3cVjarIpu9Rxm83nZTuerI1UuN3D1WSTCOzLSSHeXC8m6DlmFPzWf5S2heBLothhUjPEc3mZTBnZzAPAe800a0SYrioi");

function CardForm({ amount, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const token = localStorage.getItem("token");

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      const { data } = await axios.post(
        `${baseUrl}/payment/create-payment-intent`,
        { amount: amount * 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        onPaymentSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  return (
    <form onSubmit={handlePayment} className="border p-4 rounded mt-2">
      <CardElement className="mb-4 p-2 border rounded" />
      <button type="submit" className="cursor-pointer px-1 py-1 md:px-2 md:py-2 rounded shadow bg-white text-slate-900 accent-blue-600 dark:bg-gray-800 dark:text-gray-100 dark:accent-blue-600">
        Pay ₹{amount}
      </button>
    </form>
  );
}

function CheckoutPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
 const [shippingAddress, setShippingAddress] = useState({
  label: "Home",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
});
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return navigate("/login");
      try {
        const res = await axios.get(`${baseUrl}/cart`, { headers: { Authorization: `Bearer ${token}` } });
        setCart(res.data.cart);
      } catch {
        toast.error("Failed to fetch cart");
      }
    };
    fetchCart();
  }, [token, navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${baseUrl}/address`, { headers: { Authorization: `Bearer ${token}` } });
        setAddresses(res.data.addresses || []);
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
        } else if (!res.data.addresses?.length) setAddingNew(true);
      } catch { }
    };
    fetchAddresses();
  }, [token]);

  const handleChange = (e) => setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
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

  const placeOrder = async () => {
    if (!cart || cart.items.length === 0) { toast.error("Cart is empty"); return; }

    // Validate paymentMethod before sending
    const allowedPaymentMethods = ["COD", "Credit Card", "Debit Card", "UPI"];
    if (!allowedPaymentMethods.includes(paymentMethod)) {
      toast.error("Invalid payment method selected");
      return;
    }

    let shippingId = selectedAddressId;

 
if (addingNew) {
  const requiredFields = ["street", "city", "zip"];
  for (const field of requiredFields) {
    if (!shippingAddress[field] || shippingAddress[field].trim() === "") {
      toast.error(`Please fill the ${field} field`);
      return;
    }
  }

  try {
    const res = await axios.post(`${baseUrl}/address`, shippingAddress, {
      headers: { Authorization: `Bearer ${token}` },
    });
    shippingId = res.data.address._id;
  } catch {
    toast.error("Failed to save address");
    return;
  }
}
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      title: item.product.title,
      price: item.product.price,
      image: Array.isArray(item.product.image) ? item.product.image[0] : item.product.image
    }));

    const orderPayload = {
      orderItems,
      shippingAddress: shippingId,
      paymentMethod,
      subtotal: cart.totalPrice,
      totalAmount: cart.totalPrice
      // Removed orderStatus to match backend
    };

    try {
      const res = await axios.post(`${baseUrl}/order`, orderPayload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Order placed successfully");
      await axios.delete(`${baseUrl}/cart/clear`, { headers: { Authorization: `Bearer ${token}` } });
      navigate(`/order/${res.data.order._id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    }
  };

  if (!cart) return <p className="p-6">Loading cart...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Checkout</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 flex-col space-y-4">
          {/* Cart */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Your Cart</h3>
            {cart.items.length === 0 ? <p>Cart is empty</p> :
              cart.items.map(item => <div key={item.product._id} className="flex justify-between mb-2">
                <span>{item.product.title} x {item.quantity}</span>
                <span>₹{item.product.price * item.quantity}</span>
              </div>)
            }
            <div className="text-right font-bold mt-2">Total: ₹{cart.totalPrice}</div>
          </div>


          {/* Addresses */}
          {!addingNew && addresses.length > 0 && (
            <div className="border rounded p-4 space-y-2">
              <h3 className="font-semibold">Select Shipping Address</h3>
              {addresses.map(addr => (
                <div key={addr._id} onClick={() => handleSelectAddress(addr)}
                  className={`border p-2 rounded cursor-pointer ${selectedAddressId === addr._id ? "bg-gray-100" : ""}`}>
                  <p className="font-semibold">{addr.label}</p>
                  <p>{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                  <p>{addr.country}</p>
                </div>
              ))}
              <button className="mt-2 cursor-pointer px-1 py-1 md:px-2 md:py-2 rounded shadow bg-white text-slate-900 accent-blue-600 dark:bg-gray-800 dark:text-gray-100 dark:accent-blue-600" onClick={() => setAddingNew(true)}>Add New Address</button>
            </div>
          )}

          {(addingNew || addresses.length === 0) && (
            <div className="border rounded p-4 space-y-2">
              <h3 className="font-semibold">{addresses.length === 0 ? "Add Shipping Address" : "Edit / Add Address"}</h3>
             {["label", "street", "city", "state", "zip"].map(field => (
  <input
    key={field}
    type="text"
    name={field}
    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
    className="w-full border p-2 rounded"
    value={shippingAddress[field]}
    onChange={(e) => setShippingAddress({...shippingAddress, [field]: e.target.value})}
  />
))}

              {addresses.length > 0 && <button className="bg-gray-300 text-black py-2 rounded flex-1 mt-2 p-2" onClick={() => setAddingNew(false)}>Cancel</button>}
            </div>
          )}
        </div>
        <div className="col-span-1 flex-col space-y-4">
          {/* Payment */}
          <div className="border rounded p-4 space-y-2">
            <h3 className="font-semibold">Payment Method</h3>
            <select className="w-full border p-2 rounded" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="COD">Cash on Delivery</option>
              <option value="Credit Card">Online Payment</option>
            </select>
          </div>

          {/* Stripe Form for Online */}
          {paymentMethod === "Credit Card" && <Elements stripe={stripePromise}>
            <CardForm amount={cart.totalPrice} onPaymentSuccess={placeOrder} />
          </Elements>}

          {/* Place Order for COD */}
          {paymentMethod === "COD" && <button onClick={placeOrder} className="cursor-pointer bg-white dark:bg-gray-800 text-slate-900 accent-blue-600 dark:accent-blue-600 dark:text-gray-100 px-6 py-2 rounded shadow">Place Order</button>}
<p>Note:Payment Method is Stripe</p>

    <p>Dummy Card Details</p>
    <p className="card-number">4242 4242 4242 4242</p>
    <p>Validity:12/34</p>
    <p>cvc 123</p>
    <p>ZIP: any (e.g. 560001)</p>
        </div>
      </div>




    </div>
  );
}

export default CheckoutPage;

//Dummy Card
// 4242 4242 4242 4242
// 12/34
//cvc 123
// Card number: 4242 4242 4242 4242

// Expiry: 12/34

// CVC: 123

// ZIP: any (e.g. 560001)