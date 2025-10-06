import toast from 'react-hot-toast';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { baseUrl } from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {jwtDecode} from 'jwt-decode';

function Login() {
  const [loginForm, setloginForm] = useState({
    email: "", password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  //Eye Visibiloty
  const handleTogglePasswordVisibility = (e) => {
    setshowPassword(!showPassword);
  }
  //Once login navigate
  const navigate = useNavigate();
  const handleChange = (e) => {
    setloginForm({ ...loginForm, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/auth/login`, loginForm);
      console.log(res.data);
      toast.success("Logged Successfully");
      localStorage.setItem("token", res.data.token);
      
      const decoded = jwtDecode(res.data.token);
if (decoded.role === "admin") navigate("/admin/dashboard");
else if (decoded.role === "seller") navigate("/seller/dashboard");
else navigate("/");

// if (decode.role === 'admin' || decode.role === 'seller') {
//         navigate("/dashboard")
//       }
//       else {
//         navigate("/")
//       }

    }
    catch (error) {
      console.error("Error message", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <div className='w-[90%] md:w-1/2 p-6 bg-white-90 shadow rounded mx-auto mt-20 border border-gray-100'>
        <form className='space-y-2' onSubmit={handleSubmit}>
          <div className=''>
            <label className='block mb-1 text-sm font-medium text-left text-black'>Email Address</label>
            <input type="email" name="email" onChange={handleChange} value={loginForm.email} placeholder='Enter a email address' className='w-full px-1 py-1 md:px-2 md:py-2 border border-gray-900 rounded focus:border-gray-700   focus:ring-1 focus:ring-gray-700 focus:outline-0' />
          </div>
          <div className='relative'>
            <label className='block mb-1 text-sm font-medium text-left text-black'>Password</label>
            <input type={showPassword ? 'text' : 'password'} name="password" onChange={handleChange} value={loginForm.password} placeholder='Enter a password' className='w-full px-1 py-1 md:px-2 md:py-2 border border-gray-900 rounded focus:border-gray-700   focus:ring-1 focus:ring-gray-700 focus:outline-0' />
            <span onClick={handleTogglePasswordVisibility} className="absolute top-1/2 right-3 cursor-pointer">
              {showPassword ? (<EyeOff />) : (<Eye />)}
            </span>
          </div>
          <div>
            <button type="submit" disabled={loading} className="cursor-pointer w-full py-2 text-white bg-gray-800 rounded-lg hover:bg-rose-900">
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <p className="text-sm text-center text-black">
            Don't have an account?{' '}
            <Link to="/register" className="cursor-pointer font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>

      </div>
    </div>
  )
}

export default Login
