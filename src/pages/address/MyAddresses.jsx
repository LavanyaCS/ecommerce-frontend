import React, { useEffect, useState } from "react";
import { api } from "../api";
import AddressForm from "./AddressForm";

const MyAddress = () => {
  const [address, setAddress] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAddress = async () => {
    const { data } = await api.get("/address");
    setAddress(data.address);
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleAdd = async (form) => {
    await api.post("/address", form);
    fetchAddress();
    setShowForm(false);
  };

  const handleEdit = async (form) => {
    await api.put(`/address/${editing._id}`, form);
    fetchAddress();
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this address?")) {
      await api.delete(`/address/${id}`);
      fetchAddress();
    }
  };

  const handleSetDefault = async (id) => {
    await api.put(`/address/default/${id}`);
    fetchAddress();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-semibold mb-4">📍 My Address</h1>

      {showForm && !editing && (
        <AddressForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      {editing && (
        <AddressForm
          initialData={editing}
          onSubmit={handleEdit}
          onCancel={() => setEditing(null)}
        />
      )}

      {!showForm && !editing && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          ➕ Add New Address
        </button>
      )}

      <div className="space-y-3">
        {address.map((addr) => (
          <div key={addr._id} className="border rounded p-3 flex justify-between items-start">
            <div>
              <div className="font-semibold">{addr.label} {addr.isDefault && <span className="text-sm text-green-600">(Default)</span>}</div>
              <div>{addr.street}, {addr.city}, {addr.state}</div>
              <div>{addr.zip}, {addr.country}</div>
            </div>
            <div className="space-x-2">
              {!addr.isDefault && (
                <button onClick={() => handleSetDefault(addr._id)} className="text-blue-600">Set Default</button>
              )}
              <button onClick={() => setEditing(addr)} className="text-yellow-600">Edit</button>
              <button onClick={() => handleDelete(addr._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAddress;
