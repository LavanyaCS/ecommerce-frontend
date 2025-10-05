import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    isDefault: false,
  });
  const [editingId, setEditingId] = useState(null); // Tracks which address is being edited

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getAuthHeaders = () => {
    if (!token) {
      toast.error("Please login to manage addresses");
      navigate("/login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchAddresses = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await axios.get(`${baseUrl}/address`, { headers });
      setAddresses(res.data.addresses || []);
    } catch (err) {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add or update address
  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      if (editingId) {
        // Update existing address
        await axios.put(`${baseUrl}/address/${editingId}`, form, { headers });
        toast.success("Address updated");
        setEditingId(null);
      } else {
        // Add new address
        await axios.post(`${baseUrl}/address`, form, { headers });
        toast.success("Address added");
      }
      setForm({
        label: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        isDefault: false,
      });
      fetchAddresses();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to save address");
      }
    }
  };

  const handleDelete = async (id) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      await axios.delete(`${baseUrl}/address/${id}`, { headers });
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const setDefault = async (id) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      await axios.put(`${baseUrl}/address/default/${id}`, {}, { headers });
      toast.success("Default address updated");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to set default");
    }
  };

  const handleEdit = (address) => {
    setForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingId(address._id);
  };

  const handleCancelEdit = () => {
    setForm({
      label: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      isDefault: false,
    });
    setEditingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">My Saved Addresses</h2>

      {/* Add / Edit Address Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder="Label (e.g. Home / Office)"
          className="border p-2 col-span-2"
        />
        <input
          name="street"
          value={form.street}
          onChange={handleChange}
          placeholder="Street"
          required
          className="border p-2 col-span-2"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          required
          className="border p-2"
        />
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="border p-2"
        />
        <input
          name="zip"
          value={form.zip}
          onChange={handleChange}
          placeholder="ZIP"
          required
          className="border p-2"
        />
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="border p-2"
        />
        <label className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
          />
          Set as default address
        </label>
        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            className="cursor-pointer px-1 py-1 md:px-2 md:py-2 shadow bg-white text-slate-900 accent-blue-600 dark:bg-gray-800 dark:text-gray-100 dark:accent-blue-600 rounded flex-1"
          >
            {editingId ? "Update Address" : "Add Address"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 cursor-pointer  text-black py-2 rounded flex-1"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Saved Addresses */}
      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="border p-4 rounded flex justify-between"
            >
              <div>
                <p className="font-semibold">{addr.label}</p>
                <p>{addr.street}</p>
                <p>
                  {addr.city}, {addr.state} - {addr.zip}
                </p>
                <p>{addr.country}</p>
                {addr.isDefault && (
                  <span className="text-green-600 text-sm font-bold">
                    Default
                  </span>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-end gap-2">
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr._id)}
                    className="text-blue-600 text-sm hover:text-blue-700 cursor-pointer  bg-white p-2 rounded shadow"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleEdit(addr)}
                  className="cursor-pointer text-yellow-600 text-sm hover:text-yellow-700 bg-white p-2 rounded shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="cursor-pointer text-red-600 text-sm hover:text-red-700  bg-white p-2 rounded shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No saved addresses yet.</p>
      )}
    </div>
  );
}

export default AddressPage;
