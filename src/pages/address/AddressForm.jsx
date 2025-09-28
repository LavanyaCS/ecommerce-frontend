import React, { useState, useEffect } from "react";

const AddressForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [form, setForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    isDefault: false,
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="label" value={form.label} onChange={handleChange} placeholder="Label (Home/Work)" className="border p-2 rounded"/>
        <input name="street" value={form.street} onChange={handleChange} placeholder="Street" required className="border p-2 rounded"/>
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="border p-2 rounded"/>
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border p-2 rounded"/>
        <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP" required className="border p-2 rounded"/>
        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="border p-2 rounded"/>
      </div>
      <label className="flex items-center space-x-2">
        <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange}/>
        <span>Set as default address</span>
      </label>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  );
};

export default AddressForm;
