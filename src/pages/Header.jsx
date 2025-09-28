import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../api";
import {
  Facebook,
  TwitterIcon,
  Linkedin,
  Instagram,
  Youtube,
  Heart,
  ShoppingBasket,
  Search,
  ChevronDown,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';

function Header() {
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const menuRef = useRef();
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "");
      } catch (err) {
        console.error("Invalid token:", err);
        setUsername("");
      }
    }
  }, [token]);
const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.error("Logged Out Successfully");
    navigate("/");
    setToken(null);
    setUsername("");
  };

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseUrl}/category`);
        setCategories(res.data.categoryInfo || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div>
    <header className="relative">
      <nav>
        {/* miniheader */}
        <div className="flex justify-between gap-4 h-8 bg-blue-200 items-center px-4 md:px-16 text-black text-sm">
          <div className="flex justify-start gap-3">
            <Link to="/faq" className="uppercase hover:underline">
              Faq
            </Link>
            |
            <Link to="/help" className="hover:underline">
              Help
            </Link>
            |
            <Link to="/support" className="hover:underline">
              Support
            </Link>
          </div>
          <div className="flex justify-end gap-4 text-gray-700">
            <Facebook size={14} />
            <TwitterIcon size={14} />
            <Linkedin size={14} />
            <Instagram size={14} />
            <Youtube size={14} />
          </div>
        </div>

        {/* mainheader */}
        <div className="flex justify-between gap-4 bg-white px-4 md:px-16 h-20 items-center">
          <div>
            <h1 className="m-0 font-semibold text-2xl">
              <span className="text-primary font-bold border border-gray-200 px-3 mr-1">
                E
              </span>
              Shopper
            </h1>
          </div>

          {/* Search (hidden on small screens) */}
          <div className="hidden md:flex justify-center gap-4 items-center w-1/2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">
                <Search size={16} />
              </span>
            </div>
          </div>

          {/* Wishlist + Cart */}
          <div className="flex gap-4 items-center">
            <div className="border border-gray-200 rounded-sm p-2 flex items-center gap-2">
              <Link to={`/my-wishlist`} >
              <Heart size={16} className="text-primary" />
              {/* <span>0</span> */}
            </Link>
              </div>
            <div className="border border-gray-200 rounded-sm p-2 flex items-center gap-2">
              <Link to={`/cart`} ><ShoppingBasket size={16} className="text-primary" />
</Link>              {/* <span>0</span> */}
            </div>
          </div>

          {/* Hamburger (mobile only) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* second header (desktop only) */}
        <div className="hidden md:flex justify-between gap-4 bg-white px-16 border-y border-gray-100 h-14 items-center">
          {/* Categories dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              className="flex items-center gap-2 px-6 h-14 py-2 bg-primary w-64 text-black font-semibold rounded-md"
            >
              Categories
              <ChevronDown
                className={`transition-transform ${open ? "rotate-180" : ""}`}
                size={16}
              />
            </button>

            {open && (
              <div className="absolute mt-2 py-1 w-48 bg-white shadow-lg border rounded-md z-50">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/shop/${cat.title}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {cat.title}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-500">No categories</p>
                )}
              </div>
            )}
          </div>

          {/* Center links */}
          <div className="flex justify-center gap-6 items-center w-1/2 font-medium">
            <Link to="/" className="hover:text-rose-600">
              Home
            </Link>
            <Link to="/product" className="hover:text-rose-600">
              Product
            </Link>
            <Link to="/contact" className="hover:text-rose-600">
              Contact
            </Link>
          </div>

          {/* Auth (Desktop) */}
          <div className="flex gap-4 items-center">
            {token ? (
                 <div className="hidden md:flex items-center gap-6 flex-1 justify-end relative group">
                  <span className="ml-4 font-bold capitalize flex gap-2 items-center cursor-pointer">
                    <UserCircle size={24} /> Hi {username}
                  </span>

                  {/* My Account Dropdown */}
                  <div className="absolute top-full right-0 bg-white border shadow-md rounded-md w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                    <Link
                      to="/account"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      My Account
                    </Link>
                     <Link
                      to="/myorders"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/account/addresses"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Saved Addresses
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
            ) : (
              <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
                <Link to="/login" className="hover:text-rose-600">
                  Login
                </Link>
                <Link to="/register" className="hover:text-rose-600">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-50">
          <div className="flex flex-col p-4 gap-2">
            <Link to="/" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link to="/product" onClick={() => setMobileOpen(false)}>
              Product
            </Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}>
              Contact
            </Link>

            {token ? (
              <>
                <span className="flex items-center gap-2 font-bold mt-2">
                  <UserCircle size={20} /> Hi {username}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="text-left hover:text-red-600 mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
</div>
  );
}

export default Header;
