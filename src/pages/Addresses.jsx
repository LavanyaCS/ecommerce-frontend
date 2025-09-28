import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../api";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseUrl}/address`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ label: "Home", street: "", city: "", state: "", zip: "", country: "India", isDefault: false });
      fetchAddresses();
    } catch (err) {
      console.error("Failed to add address", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  const setDefault = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${baseUrl}/address/default/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
    } catch (err) {
      console.error("Failed to set default", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Addresses</h1>

      {/* Add New Address */}
      <form onSubmit={handleAdd} className="grid gap-2 mb-6 bg-white p-4 shadow rounded">
        <input type="text" placeholder="Street" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required className="border p-2 rounded" />
        <input type="text" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required className="border p-2 rounded" />
        <input type="text" placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="border p-2 rounded" />
        <input type="text" placeholder="Zip Code" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} required className="border p-2 rounded" />
        <label className="flex gap-2 items-center">
          <input type="checkbox" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} />
          Set as Default
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Address</button>
      </form>

      {/* Address List */}
      <div className="space-y-3">
        {addresses.length === 0 && <p>No addresses found.</p>}
        {addresses.map((addr) => (
          <div key={addr._id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{addr.label} {addr.isDefault && <span className="text-green-600 text-sm">(Default)</span>}</p>
              <p>{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
              <p>{addr.country}</p>
            </div>
            <div className="flex gap-2">
              {!addr.isDefault && (
                <button onClick={() => setDefault(addr._id)} className="text-blue-600">Set Default</button>
              )}
              <button onClick={() => handleDelete(addr._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
