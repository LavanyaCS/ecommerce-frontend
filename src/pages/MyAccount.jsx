import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MyAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>

      {/* Basic Info */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">Account Information</h2>
        <p><span className="font-medium">Username:</span> {user.username}</p>
        <p><span className="font-medium">Email:</span> {user.email || "Not Provided"}</p>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Saved Addresses</h2>
        <p className="text-gray-600 mb-3">Manage your shipping and billing addresses.</p>
        <Link
          to="/account/addresses"
          className="bg-gray-800 text-white px-1 py-1 md:px-2 md:py-2 rounded hover:bg-gray-900"
        >
          Go to Addresses
        </Link>
      </div>
    </div>
  );
};

export default MyAccount;
