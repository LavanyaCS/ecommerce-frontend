import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../api";
import { Heart, ShoppingBasket, Menu, X, UserCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import liyaraLogoDark from "../assets/images/liyara-logo-white.png";
import liyaraLogo from "../assets/images/liyara-logo.png";
function Header() {
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const menuRef = useRef();
  const navigate = useNavigate();
        const [isDark,setIsDark]=useState(false);
    useEffect(()=>{
        const savedTheme = localStorage.getItem('theme');
        if(savedTheme === 'dark'){
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    },[]);
    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.classList.toggle('dark',newTheme);
        localStorage.setItem('theme',newTheme ? 'dark' : 'light');
    }
  // Decode token
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username || "");
      setUserRole(decoded.role || "");
    } catch (err) {
      console.error("Invalid token:", err);
      setToken(null);
      setUsername("");
      setUserRole("");
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setToken(null);
    setUsername("");
    setUserRole("");
    navigate("/");
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseUrl}/category`);
        setCategories(res.data.categoryInfo || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Common menu links
  const menuLinks = (
    <>
      <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
      <Link to="/product" className="hover:text-blue-600 dark:hover:text-blue-400">Product</Link>
      <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About Us</Link>
      <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
    {userRole === "admin" && (
  <Link to="/admin/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">
    Admin Panel
  </Link>
)}

{userRole === "seller" && (
  <Link to="/seller/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">
    Seller Dashboard
  </Link>
)}
    </>
  );
//Wishlist and cart count
const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  //Wishlistlist count
  useEffect(() => { 
     if (!token) return;
    const fetchWishlistCount = async() =>{
    try{
     
      const res = await axios.get(`${baseUrl}/wishlist`,{
        headers:{Authorization: `Bearer ${token}`},
      });
      if(res.data.count !== undefined){
        setWishlistCount(res.data.count);
      }
       else if (res.data.wishlist) {
        setWishlistCount(res.data.wishlist.length);
      }

    }
     catch (error) {
      console.error("Failed to fetch wishlist count:", error);
    }
  }
   const fetchCartCount = async () => {
    try {
      const res = await axios.get(`${baseUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.count !== undefined) {
        setCartCount(res.data.count);
      } else if (res.data.cart && res.data.cart.items) {
        setCartCount(res.data.cart.items.length);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };
  fetchWishlistCount();
  fetchCartCount();
  },[token]);
  return (
    <header className="relative">
      <nav className="border-y border-gray-200">
        {/* Main Header */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 text-slate-900 accent-blue-600 dark:accent-blue-600 dark:text-gray-100 px-4 md:px-16 h-20">
          <div>
            <h1 className="font-semibold text-2xl">
               <Link to="/">
                <img
  src={isDark ? liyaraLogoDark : liyaraLogo}
  alt="Liyara Logo"
  className="w-28 h-8 inline-block mr-2"
/>
</Link>            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex justify-center items-center gap-6 font-medium">
            {menuLinks}
          </div>

          {/* Right: Wishlist, Cart, User */}
          <div className="flex items-center gap-4">
            {token ? (
              <div className="hidden md:flex items-center gap-6 relative group">
                <span className="ml-4 font-bold capitalize flex gap-2 items-center cursor-pointer">
                  <UserCircle size={24} /> Hi {username}
                </span>
                <div className="absolute top-full right-0 z-10 bg-white text-gray-900 border shadow-md rounded-md w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <Link to="/account" className="block px-1 py-1 md:px-2 md:py-2 hover:bg-gray-100 text-sm">My Account</Link>
                  <Link to="/myorders" className="block px-1 py-1 md:px-2 md:py-2 hover:bg-gray-100 text-sm">My Orders</Link>
                  <Link to="/account/addresses" className="block px-1 py-1 md:px-2 md:py-2 hover:bg-gray-100 text-sm">Saved Addresses</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-1 py-1 md:px-2 md:py-2 hover:bg-gray-100 text-sm">Logout</button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6">
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">Login</Link>
                <Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-400">Register</Link>
              </div>
            )}

      {/* Wishlist Icon */}
      <div className="border border-gray-200 rounded-sm p-2">
        <Link to="/my-wishlist" className="relative">
          <Heart
            size={20}
            className="
             bg-white text-black dark:bg-gray-800 dark:text-white
              transition-colors duration-300
            "
          />
          {wishlistCount > 0 && (
            <span
              className="
                absolute -top-2 -right-2
                 dark:bg-white dark:text-black bg-gray-800 text-white text-[10px] font-semibold
                flex justify-center items-center
                w-4 h-4 rounded-full
                border border-white dark:border-gray-800
              "
            >
              {wishlistCount}
            </span>
          )}
        </Link>
      </div>

      {/* Cart Icon */}
      <div className="border border-gray-200 rounded-sm p-2">
        <Link to="/cart" className="relative">
          <ShoppingBasket
            size={20}
            className="
              bg-white text-black dark:bg-gray-800 dark:text-white
              transition-colors duration-300
            "
          />
          {cartCount > 0 && (
            <span
              className="
                absolute -top-2 -right-2
                 dark:bg-white dark:text-black bg-gray-800 text-white text-[10px] font-semibold
                flex justify-center items-center
                w-4 h-4 rounded-full
                border border-white dark:border-gray-800
              "
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>
     
    <div>
     <button
      onClick={toggleTheme}
      className="z-50 px-2 h-10 py-1 md:px-2 md:py-2 text-sm text-black bg-white rounded-lg bottom-4 left-4 dark:bg-gray-800 dark:text-white border border-gray-200"
    >
      <span className="hidden md:inline">{isDark ? '☀️ Light' : '🌙 Dark'}</span>
      <span className="inline md:hidden">{isDark ? '☀️' : '🌙'}</span>
    </button></div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div ref={menuRef} className="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-50">
          <div className="flex flex-col p-4 gap-2">
            {menuLinks}
            {token ? (
              <>
                <span className="flex items-center gap-2 font-bold mt-2">
                  <UserCircle size={20} /> Hi {username}
                </span>
                  <Link to="/account" className="text-left  mt-2">My Account</Link>
                  <Link to="/myorders" className="text-left  mt-2">My Orders</Link>
                  <Link to="/account/addresses" className="text-left  mt-2">Saved Addresses</Link>
                <button onClick={handleLogout} className="text-left  mt-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
