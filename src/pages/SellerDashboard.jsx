import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: 0,
    price: 0,
    category: "",
    image: "",
    id: null,
  });
  const [stats, setStats] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/category`);
      setCategories(res.data.categoryInfo || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      if (!token) return;

      const decoded = jwtDecode(token);
      if (decoded.role === "seller") {
        const res = await axios.get(`${baseUrl}/product/seller/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(res.data.products);

        // Prepare chart data: products per category
        const categoryCount = {};
        res.data.products.forEach((p) => {
          const name = p.category?.title || "Uncategorized";
          categoryCount[name] = (categoryCount[name] || 0) + 1;
        });
        const chartData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
        setStats(chartData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`${baseUrl}/product/${form.id}`, form, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${baseUrl}/product`, form, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Product created successfully");
      }
      setForm({ title: "", description: "", quantity: 0, price: 0, category: "", image: "", id: null });
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error occurred");
    }
  };

  const editProduct = (p) => {
    setForm({
      id: p._id,
      title: p.title,
      description: p.description,
      quantity: p.quantity,
      price: p.price,
      category: p.category?._id,
      image: p.image?.[0] || "",
    });
    setShowModal(true);
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${baseUrl}/product/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error occurred");
    }
  };

{/*Screen version */}

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // mobile & tablet
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
   if (isMobile) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-center p-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">⚠️ Desktop Only</h1>
          <p className="text-gray-600">
            The Seller Dashboard is only accessible on desktop devices.  
            Please use a larger screen to continue.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>

      {/* Enhanced Stats Chart */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Products by Category</h2>
        {stats.length === 0 ? (
          <p>No products to display</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Add Product Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-white dark:bg-gray-800 text-slate-900 accent-blue-600 dark:accent-blue-600 dark:text-gray-100 px-1 py-1 md:px-2 md:py-2 rounded cursor-pointer"
        >
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      
        <h2 className="font-semibold mb-2">My Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {products.length === 0 ? (
          <p>No products yet</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition">
              <Link 
                  to={`/product/${product._id}`}
                  >
                    <img
                className="w-full h-48 object-cover rounded-t-lg"
                src={Array.isArray(product.image) ? product.image[0] : product.image || "/fallback.png"}
                alt={product.title}
              />
              <div className="px-5 py-4 text-center">
                <h5 className="text-lg font-semibold text-gray-800">{product.title}</h5>
                <div className="mt-2 flex justify-center items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">${product.price}</span>
                  <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
                </div>
              </div></Link>
              <div className="grid grid-cols-2 divide-x border-t">
                                <button className="col-span-1 cursor-pointer text-yellow-600 text-sm hover:text-yellow-700 bg-white p-2 rounded shadow" onClick={() => editProduct(product)}>Edit</button>
                <button className="cursor-pointer col-span-1 text-red-600 text-sm hover:text-red-700  bg-white p-2 rounded shadow" onClick={() => deleteProduct(product._id)}>Delete</button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0000003b] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">{form.id ? "Edit Product" : "Add Product"}</h2>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <form onSubmit={handleSubmit} className="space-y-2">
               <div className=''>
            <label className='block mb-1 text-sm font-medium text-left text-black'>Product Image</label>
          
              <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 w-full rounded" required />
          </div> 
           <div className=''>
            <label className='block mb-1 text-sm font-medium text-left text-black'>Product Description</label>
             <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full rounded" required />
          </div> 
           <div className=''>
            <label className='block mb-1 text-sm font-medium text-left text-black'>Product Quantity</label>
            <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="border p-2 w-full rounded" min={0} required />
          </div> 
           <div className=''>
            <label className='block mb-1 text-sm font-medium text-left text-black'>Product Price</label>
             <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 w-full rounded" min={0} required />
          </div> 
           <div className=''>
            <label className='block mb-1 text-sm font-medium text-left text-black'>Product Image</label>
             <input type="text" name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="border p-2 w-full rounded" required />
          </div> 
           <div className=''>
            <label className='block mb-1 text-sm font-medium text-left text-black'>Select Category</label>
             <select name="category" value={form.category} onChange={handleChange} className="border p-2 w-full rounded" required>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
          </div>    <div className="flex justify-end mt-2">
                <button type="submit" className="bg-primary cursor-pointer text-white px-1 py-1 md:px-2 md:py-2 rounded">
                  {form.id ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
